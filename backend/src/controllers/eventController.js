const Event = require('../models/Event');
const User = require('../models/User');

// List upcoming events
exports.listEvents = async (req, res) => {
  try {
    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const events = await Event.find(query)
      .sort({ date: 1, createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      data: {
        events,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching events',
    });
  }
};

// Get details for a single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        event,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching event details',
    });
  }
};

// Toggle save/unsave for an event
exports.toggleSaveForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const alreadySaved = user.eventsSaved.some((savedEventId) => savedEventId.equals(event._id));

    if (alreadySaved) {
      user.eventsSaved.pull(event._id);
      await user.save();
      return res.status(200).json({
        success: true,
        message: 'Removed from wishlist',
        data: {
          saved: false,
          eventId: event._id,
        },
      });
    }

    user.eventsSaved.addToSet(event._id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Saved to wishlist',
      data: {
        saved: true,
        eventId: event._id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating wishlist',
    });
  }
};

// Get events saved in the authenticated user's wishlist
exports.getSavedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('eventsSaved');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        events: user.eventsSaved,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching wishlist',
    });
  }
};

// Register the authenticated user for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const userId = req.user.id;
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is full. Please join the waitlist later.',
      });
    }

    event.registeredUsers.push(userId);
    await event.save();

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { eventsRegistered: event._id, eventsAttended: event._id },
        $inc: { points: event.points },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Registered successfully',
      data: {
        event,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error registering for event',
    });
  }
};