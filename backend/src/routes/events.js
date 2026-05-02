const express = require('express');
const { protect } = require('../middleware/auth');
const {
  listEvents,
  getEvent,
  registerForEvent,
  toggleSaveForEvent,
  getSavedEvents,
} = require('../controllers/eventController');

const router = express.Router();

router.get('/', listEvents);
router.get('/wishlist', protect, getSavedEvents);
router.post('/:id/save', protect, toggleSaveForEvent);
router.get('/:id', getEvent);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;
