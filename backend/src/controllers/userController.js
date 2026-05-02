const User = require('../models/User');

// @route   GET /api/users/leaderboard
// @desc    Get top users ranked by points
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name points badges profileImage department year')
      .sort({ points: -1 })
      .limit(50);

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
    const user = await User.findById(req.user.id)
      .select('points badges eventsAttended eventsRegistered rank');
    
    // Calculate rank (this is a simple implementation, in production use a cached value)
    const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;

    return res.status(200).json({
      success: true,
      data: {
        points: user.points,
        badges: user.badges,
        rank,
        eventsCount: user.eventsAttended.length,
      },
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
    const friendIds = user.friends.map(f => f._id);

    // Find recent activity of friends
    // For simplicity, we'll just return the friends and their last attended event
    const activity = await User.find({ _id: { $in: friendIds } })
      .select('name profileImage eventsAttended')
      .populate({
        path: 'eventsAttended',
        options: { limit: 1, sort: { createdAt: -1 } }
      });

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

