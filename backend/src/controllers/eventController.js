const Event = require('../models/Event');
const User = require('../models/User');
const { createNotification } = require('./notificationController');


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

// Register the authenticated user for an event (with waitlist support)
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
    
    // Check if already registered
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Check if already on waitlist
    if (event.waitlist.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already on the waitlist for this event',
      });
    }

    // Check capacity
    if (event.registeredUsers.length >= event.capacity) {
      event.waitlist.push(userId);
      await event.save();

      await createNotification(
        userId,
        'Waitlist Joined',
        `You've been added to the waitlist for ${event.title}. We'll notify you if a spot opens up!`,
        'System',
        '/dashboard'
      );

      return res.status(200).json({
        success: true,
        message: 'Event is full. You have been added to the waitlist.',
        data: {
          event,
          status: 'waitlisted',
        },
      });
    }

    event.registeredUsers.push(userId);
    await event.save();

    // Award 5 points for registration
    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { eventsRegistered: event._id },
        $inc: { points: 5 },
      },
      { new: true }
    );

    await createNotification(
      userId,
      'Registration Success',
      `You've registered for ${event.title}! +5 points earned.`,
      'Check-in Success',
      '/dashboard'
    );

    return res.status(200).json({
      success: true,
      message: 'Registered successfully! +5 points earned.',
      data: {
        event,
        status: 'registered',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error registering for event',
    });
  }
};

// Cancel registration or waitlist entry
exports.cancelRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const userId = req.user.id;
    let wasRegistered = false;

    if (event.registeredUsers.includes(userId)) {
      event.registeredUsers.pull(userId);
      wasRegistered = true;
    } else if (event.waitlist.includes(userId)) {
      event.waitlist.pull(userId);
    } else {
      return res.status(400).json({
        success: false,
        message: 'You are not registered or waitlisted for this event',
      });
    }

    // If a registered user cancelled, move someone from waitlist to registered
    let promotedUser = null;
    if (wasRegistered && event.waitlist.length > 0) {
      promotedUser = event.waitlist.shift(); // FIFO
      event.registeredUsers.push(promotedUser);
      
      // Notify promoted user
      await createNotification(
        promotedUser,
        'Spot Opened!',
        `Good news! A spot opened up for ${event.title} and you've been moved from the waitlist to registered!`,
        'Event Reminder',
        '/dashboard'
      );
      
      // Also award them the registration points now
      await User.findByIdAndUpdate(promotedUser, {
        $addToSet: { eventsRegistered: event._id },
        $inc: { points: 5 }
      });
    }

    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully cancelled your entry.',
      data: {
        promotedUser: promotedUser ? 'A user from waitlist was promoted' : null
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling registration',
    });
  }
};


// Check-in to an event using QR code
exports.checkIn = async (req, res) => {
  try {
    const { qrCode } = req.body;
    
    if (!qrCode) {
      return res.status(400).json({
        success: false,
        message: 'QR code is required',
      });
    }

    const event = await Event.findOne({ qrCode });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Invalid QR code. Event not found.',
      });
    }


    const userId = req.user.id;

    // Check if already checked in
    if (event.attendees.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in to this event',
      });
    }

    // Check if user was registered (optional but recommended)
    const isRegistered = event.registeredUsers.includes(userId);
    
    event.attendees.push(userId);
    event.status = 'Ongoing'; // If someone checks in, the event is likely ongoing
    await event.save();

    const user = await User.findById(userId);
    
    // Update daily activity log
    const today = new Date().toISOString().split('T')[0];
    const logIndex = user.activityLog.findIndex(log => log.date === today);
    
    if (logIndex > -1) {
      user.activityLog[logIndex].count += 1;
    } else {
      user.activityLog.push({ date: today, count: 1 });
    }

    // Update streak logic
    if (user.lastActivityDate) {
      const lastDate = new Date(user.lastActivityDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1; // Reset streak if missed a day
      }
    } else {
      user.streak = 1;
    }
    user.lastActivityDate = today;

    // Award 20 points for check-in
    user.eventsAttended.addToSet(event._id);
    user.points += 20;
    
    await user.save();

    // Check for "Early Bird" badge (First 10 attendees)
    let badgeEarned = null;
    if (event.attendees.length <= 10 && !user.badges.includes('Early Bird')) {
      user.badges.push('Early Bird');
      await user.save();
      badgeEarned = 'Early Bird';
    }

    await createNotification(
      userId,
      'Check-in Success',
      `You've checked in to ${event.title}! +20 points earned.`,
      'Check-in Success',
      '/dashboard'
    );

    if (badgeEarned) {
      await createNotification(
        userId,
        'New Badge Earned!',
        `Congratulations! You've earned the ${badgeEarned} badge for being an early attendee.`,
        'Achievement',
        '/dashboard'
      );
    }

    return res.status(200).json({

      success: true,
      message: `Check-in successful! +20 points earned.${badgeEarned ? ` You've earned the ${badgeEarned} badge!` : ''}`,
      data: {
        event,
        points: user.points,
        badgeEarned,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error during check-in',
    });
  }
};

// Create a new event (Organizer only)
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
      capacity,
      points,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      organizer,
      category,
      capacity,
      points: points || 10,
      createdBy: req.user.id,
    });

    // Award points to organizer for hosting an event
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { points: 50 },
      $addToSet: { badges: 'Event Organizer' }
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully! +50 points earned.',
      data: {
        event,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating event',
    });
  }
};
