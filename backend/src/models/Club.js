const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a club name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Club name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['Technical', 'Cultural', 'Sports', 'Social', 'Professional', 'Other'],
      default: 'Other',
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    points: {
      type: Number,
      default: 0, // This will be a cached sum or updated on member point changes
    },
    image: {
      type: String,
      default: 'default-club.jpg',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Club', clubSchema);
