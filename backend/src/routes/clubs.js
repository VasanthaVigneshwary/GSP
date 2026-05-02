const express = require('express');
const { protect } = require('../middleware/auth');
const { getClubs, createClub, joinClub, leaveClub } = require('../controllers/clubController');

const router = express.Router();

router.get('/', getClubs);
router.post('/', protect, createClub);
router.post('/leave', protect, leaveClub);
router.post('/:id/join', protect, joinClub);

module.exports = router;
