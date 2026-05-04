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
  commitToEvent,
  uncommitFromEvent,
  getCommittedEvents,
} = require('../controllers/eventController');




const router = express.Router();

router.get('/', listEvents);
router.post('/', protect, createEvent);

router.get('/wishlist', protect, getSavedEvents);
router.get('/commitments', protect, getCommittedEvents);
router.post('/:id/save', protect, toggleSaveForEvent);
router.get('/:id', getEvent);
router.post('/check-in', protect, checkIn);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);
router.post('/:id/commit', protect, commitToEvent);
router.delete('/:id/commit', protect, uncommitFromEvent);




module.exports = router;
