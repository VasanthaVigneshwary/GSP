const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const { protect } = require('../middleware/auth');

router.get('/daily', protect, missionController.getDailyMissions);
router.post('/complete/:id', protect, missionController.completeMission);

module.exports = router;
