const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/aiController');
const { protect } = require('../middleware/auth'); // Assuming you have auth middleware

// @route   POST /api/ai/ask
// @desc    Ask the AI Mentor for advice (RAG-enabled)
// @access  Private
router.post('/ask', protect, askAI);

module.exports = router;
