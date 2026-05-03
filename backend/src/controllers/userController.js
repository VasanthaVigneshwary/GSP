const User = require('../models/User');

// @route   GET /api/users/leaderboard
// @desc    Get top users ranked by points
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    let users = await User.find()
      .select('name points badges profileImage department year')
      .sort({ points: -1 })
      .limit(50);

    if (users.length === 0) {
      users = [
        { name: 'Demo Student', points: 435, department: 'Computer Science', year: 'Freshman' },
        { name: 'Alice Smith', points: 380, department: 'Engineering', year: 'Sophomore' },
        { name: 'Bob Johnson', points: 290, department: 'Business', year: 'Junior' },
      ];
    }

    return res.status(200).json({
      success: true,
      data: {
        leaderboard: users,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching leaderboard',
    });
  }
};

// @route   GET /api/users/stats
// @desc    Get current user stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    let user = await User.findById(req.user.id)
      .select('points badges eventsAttended eventsRegistered rank activityLog streak');
    
    // Fallback for demo user if DB is unavailable
    if (!user && req.user.id === 'demo-user-id') {
      user = {
        points: 435,
        streak: 7,
        activityLog: [
          { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], count: 3 },
          { date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], count: 5 },
          { date: new Date().toISOString().split('T')[0], count: 2 },
          { date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0], count: 1 },
          { date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0], count: 4 },
        ],
        badges: ['Early Bird', 'Social Butterfly'],
        eventsAttended: { length: 3 } // Mock for count
      };
    }
    
    // Calculate rank (this is a simple implementation, in production use a cached value)
    const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;

    return res.status(200).json({
      success: true,
      data: {
        points: user.points,
        badges: user.badges,
        rank,
        streak: user.streak || 0,
        activityLog: user.activityLog || [],
        eventsCount: user.eventsAttended.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user stats',
    });
  }
};

// Toggle follow/unfollow a friend
exports.toggleFriend = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.user.id;

    if (friendId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isFriend = user.friends.includes(friendId);

    if (isFriend) {
      user.friends.pull(friendId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: `Unfollowed ${friend.name}`,
        isFriend: false,
      });
    } else {
      user.friends.addToSet(friendId);
      await user.save();
      
      // Award 10 points for connecting
      user.points += 10;
      await user.save();

      return res.status(200).json({
        success: true,
        message: `Now following ${friend.name}! +10 points earned.`,
        isFriend: true,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error toggling friend',
    });
  }
};

// Get activity feed (events attended by friends)
exports.getActivityFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends');
    
    let activity = [];
    if (user && user.friends && user.friends.length > 0) {
      const friendIds = user.friends.map(f => f._id);
      activity = await User.find({ _id: { $in: friendIds } })
        .select('name profileImage eventsAttended')
        .populate({
          path: 'eventsAttended',
          options: { limit: 1, sort: { createdAt: -1 } }
        });
    }

    if (activity.length === 0) {
      activity = [
        { _id: 'a1', name: 'Alice Smith', eventsAttended: [{ title: 'Code Challenge', date: new Date() }] },
        { _id: 'a2', name: 'Bob Johnson', eventsAttended: [{ title: 'Campus Social', date: new Date() }] },
      ];
    }

    return res.status(200).json({
      success: true,
      data: {
        activity,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching activity feed',
    });
  }
};
const learningService = require('../services/aiLearningService');

// @route   POST /api/users/learning/contribute
// @desc    Receive federated learning contribution from device
// @access  Private
exports.postLearningContribution = async (req, res) => {
  try {
    const { contribution } = req.body;
    if (!contribution) {
      return res.status(400).json({ success: false, message: 'No contribution data' });
    }

    const success = await learningService.aggregateContribution(contribution);
    
    if (success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Learning contribution aggregated successfully' 
      });
    } else {
      throw new Error('Failed to aggregate');
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
