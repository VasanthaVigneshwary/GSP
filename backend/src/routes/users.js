const express = require('express');
const { protect } = require('../middleware/auth');
const { getLeaderboard, getUserStats, toggleFriend, getActivityFeed } = require('../controllers/userController');

const router = express.Router();

router.get('/leaderboard', protect, getLeaderboard);
router.get('/stats', protect, getUserStats);
router.get('/activity', protect, getActivityFeed);
router.post('/friend/:id', protect, toggleFriend);


module.exports = router;
