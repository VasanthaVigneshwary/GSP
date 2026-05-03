const aiRagService = require('../services/aiRagService');
const User = require('../models/User');

/**
 * AI Career Mentor Controller
 * Handles RAG-based advising using live event context.
 */
exports.askAI = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Please provide a question.' });
    }

    // 1. Retrieve User Context (Profile, Interests)
    const user = await User.findById(userId).select('interests department points year');
    const userSummary = user 
      ? `Student is in ${user.year} ${user.department}. Interests: ${user.interests?.join(', ') || 'General Tech'}. XP Level: ${user.points}.`
      : 'User profile unavailable.';

    // 2. Retrieve Live Event Context (RAG)
    const eventContext = await aiRagService.getContext(question);

    // 3. Construct the "System Prompt" with Context
    const prompt = `
      You are the GSP AI Career Mentor. 
      ${userSummary}
      
      ${eventContext ? `Use these live opportunities to give specific advice:\n${eventContext}` : 'No specific live events found for this query.'}
      
      Respond as a helpful, encouraging mentor. If live events were provided, explain WHY they are good for the student.
    `;

    // 4. Simulate AI Generation (since we don't have an LLM API key connected yet)
    // In production, you would send 'prompt' and 'question' to OpenAI/Gemini.
    let response = "";
    if (eventContext) {
        response = `Based on your interests, I found some great live opportunities! ${eventContext.split('\n')[1].replace('- ', '')} looks perfect for you. Participating in these will earn you high XP and boost your ${user.department || 'tech'} career profile.`;
    } else {
        response = "I couldn't find specific live events for that right now, but I recommend checking the 'Hackathon' section. Keep building your XP!";
    }

    return res.status(200).json({
      success: true,
      data: {
        answer: response,
        contextUsed: !!eventContext
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'AI Assistant is currently offline.'
    });
  }
};
