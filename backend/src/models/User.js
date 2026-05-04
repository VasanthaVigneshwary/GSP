const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    department: {
      type: String,
      enum: [
        'Computer Science',
        'Engineering',
        'Business',
        'Arts & Sciences',
        'Education',
        'Health & Medicine',
        'Law',
        'Other',
      ],
      default: 'Other',
    },
    year: {
      type: String,
      enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Other'],
      default: 'Other',
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: String,
        enum: [
          'Early Bird',
          'Social Butterfly',
          'Event Organizer',
          'Streak Master',
          'Category Completionist',
          'Campus Legend',
          'Social Connector',
          'Perfect Attendee',
          'Team Player',
          'Well-Rounded',
        ],
      },
    ],
    eventsAttended: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    eventsRegistered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    eventsSaved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    committedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      default: null,
    },

    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    githubUsername: {
      type: String,
      default: '',
    },
    certificates: [
      {
        title: String,
        issuer: String,
        date: Date,
        imageUrl: String,
        link: String,
      }
    ],
    interests: [
      {
        type: String,
        enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'],
      },
    ],
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['Public', 'Friends-Only', 'Private'],
        default: 'Public',
      },
      showPoints: {
        type: Boolean,
        default: true,
      },
      showBadges: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {

      type: Boolean,
      default: true,
    },
    activityLog: [
      {
        date: {
          type: String, // Format: YYYY-MM-DD
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      }
    ],
    streak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
