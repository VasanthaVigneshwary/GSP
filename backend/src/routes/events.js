const express = require('express');
const { protect } = require('../middleware/auth');
const { listEvents, getEvent, registerForEvent } = require('../controllers/eventController');

const router = express.Router();

router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/:id/register', protect, registerForEvent);

module.exports = router;
