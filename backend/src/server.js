const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const clubRoutes = require('./routes/clubs');
const User = require('./models/User');



const Event = require('./models/Event');

const cors = require('cors');

dotenv.config();

const app = express();

// Production CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://gsp-frontend.vercel.app', // placeholder - update after deploy
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health Check for Production
app.get('/health', (req, res) => res.status(200).json({ status: 'GSP Backend Online', time: new Date() }));

const seedDemoUser = async () => {
  const demoEmail = 'student@university.edu';
  const demoPassword = 'password123';

  try {
    let user = await User.findOne({ email: demoEmail });
    if (!user) {
      user = await User.create({
        name: 'Demo Student',
        email: demoEmail,
        password: demoPassword,
        department: 'Computer Science',
        year: 'Freshman',
        points: 0,
      });
      console.log('✓ Demo user seeded: student@university.edu / password123');
    }
    return user;
  } catch (error) {
    console.error(`✗ Error seeding demo user: ${error.message}`);
    return null;
  }
};

const seedDemoEvents = async (creatorId) => {
  try {
    const existingEvents = await Event.countDocuments();
    if (existingEvents > 0) {
      return;
    }

    const events = [
      {
        title: 'Startup Hackathon 2026',
        description: '24-hour startup buildathon with prizes for best pitch and MVP.',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '9:00 AM',
        location: 'Innovation Hub',
        organizer: 'Entrepreneurship Club',
        category: 'Technical',
        capacity: 200,
        points: 15,
        createdBy: creatorId,
      },
      {
        title: 'Career Fair 2026',
        description: 'Meet recruiters from top companies and prepare for interviews.',
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'Student Center',
        organizer: 'Career Services',
        category: 'Seminar',
        capacity: 500,
        points: 10,
        createdBy: creatorId,
      },
      {
        title: 'Book Club Meeting',
        description: 'Discuss this month’s featured book and connect with fellow readers.',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        time: '5:00 PM',
        location: 'Library 3rd Floor',
        organizer: 'Literature Society',
        category: 'Cultural',
        capacity: 50,
        points: 5,
        createdBy: creatorId,
      },
    ];

    await Event.insertMany(events);
    console.log('✓ Seeded demo events');
  } catch (error) {
    console.error(`✗ Error seeding demo events: ${error.message}`);
  }
};

const startServer = async () => {
  await connectDB();
  const demoUser = await seedDemoUser();
  if (demoUser) {
    await seedDemoEvents(demoUser._id);
  }

  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/clubs', clubRoutes);
  app.use('/api/ai', require('./routes/ai'));
  app.use('/api/missions', require('./routes/mission'));




  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('✗ Server failed to start:', err.message);
});
