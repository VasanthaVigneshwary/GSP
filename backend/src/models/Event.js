const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  organizer: {
    type: String,
    default: 'External Organizer'
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  capacity: {
    type: Number,
    default: 100
  },
  time: {
    type: String,
    default: 'Full Day'
  },
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  points: {
    type: Number,
    default: 10
  },
  qrCode: {
    type: String,
    unique: true
  },
  isExternal: {
    type: Boolean,
    default: false
  },
  externalLink: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: 'GSP'
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commitments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  waitlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for external events
  }
}, {
  timestamps: true
});

// Generate a random QR code data before saving
eventSchema.pre('save', function(next) {
  if (!this.qrCode) {
    this.qrCode = `GSP-EVT-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);