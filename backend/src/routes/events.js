const express = require('express');
const { protect } = require('../middleware/auth');
const {
  listEvents,
  getEvent,
  registerForEvent,
  toggleSaveForEvent,
  getSavedEvents,
  checkIn,
  createEvent,
  cancelRegistration,
} = require('../controllers/eventController');




const router = express.Router();

router.get('/', listEvents);
router.post('/', protect, createEvent);

router.get('/wishlist', protect, getSavedEvents);
router.post('/:id/save', protect, toggleSaveForEvent);
router.get('/:id', getEvent);
router.post('/check-in', protect, checkIn);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);




module.exports = router;
