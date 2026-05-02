const Club = require('../models/Club');
const User = require('../models/User');

// @route   GET /api/clubs
// @desc    Get all clubs with their total points
// @access  Public
exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('captain', 'name')
      .sort({ points: -1 });

    return res.status(200).json({
      success: true,
      data: {
        clubs,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching clubs',
    });
  }
};

// @route   POST /api/clubs
// @desc    Create a new club
// @access  Private
exports.createClub = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Check if user already in a club
    const user = await User.findById(req.user.id);
    if (user.club) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of a club. Leave it first to create a new one.',
      });
    }

    const club = await Club.create({
      name,
      description,
      category,
      captain: req.user.id,
      members: [req.user.id],
      points: user.points, // Initial points from the captain
    });

    user.club = club._id;
    await user.save();

    return res.status(201).json({
      success: true,
      data: {
        club,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating club',
    });
  }
};

// @route   POST /api/clubs/:id/join
// @desc    Join a club
// @access  Private
exports.joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    const user = await User.findById(req.user.id);
    if (user.club) {
      return res.status(400).json({
        success: false,
        message: 'You are already in a club',
      });
    }

    user.club = club._id;
    await user.save();

    club.members.push(user._id);
    club.points += user.points;
    await club.save();

    return res.status(200).json({
      success: true,
      message: `Joined ${club.name} successfully`,
      data: {
        club,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error joining club',
    });
  }
};

// @route   POST /api/clubs/leave
// @desc    Leave current club
// @access  Private
exports.leaveClub = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.club) {
      return res.status(400).json({
        success: false,
        message: 'You are not in a club',
      });
    }

    const club = await Club.findById(user.club);
    if (club) {
      if (club.captain.toString() === user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Captain cannot leave the club. Transfer leadership or delete the club.',
        });
      }

      club.members.pull(user._id);
      club.points -= user.points;
      await club.save();
    }

    user.club = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Left the club successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error leaving club',
    });
  }
};
