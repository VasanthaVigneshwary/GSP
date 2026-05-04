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

    // 3. New: Hybrid Transformer Inference
    // We call the Python bridge to let the Transformer rank the results
    let personalizedAdvice = "";
    try {
        const { execSync } = require('child_process');
        const pythonPath = 'python'; // or 'python3'
        const scriptPath = path.resolve(__dirname, '../../../ai/core/hybrid_inference.py');
        
        const hybridOutput = execSync(`${pythonPath} ${scriptPath} "${question}" "${userId}"`).toString();
        const hybridResult = JSON.parse(hybridOutput);
        personalizedAdvice = hybridResult.personalized_recommendation;
    } catch (err) {
        console.warn('Hybrid Inference Offline, falling back to standard RAG.', err.message);
    }

    // 4. Construct the response
    let response = "";
    if (eventContext) {
        response = personalizedAdvice || `Based on your profile, I recommend: ${eventContext.split('\n')[1].replace('- ', '')}. This matches your track!`;
    } else {
        response = "I'm analyzing your profile with my Transformer core. For now, keep building your XP in the 'Hackathon' section!";
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

/**
 * Generates a personalized 3-step career roadmap
 */
exports.getCareerRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    // 1. Get RAG context for their interests
    const interestQuery = user.interests?.join(' ') || user.department || 'technology';
    const liveEvents = await aiRagService.getContext(interestQuery);

    // 2. Transformer Logic (Simulated for roadmap)
    const roadmap = {
      role: `Future ${user.department || 'Tech'} Leader`,
      steps: [
        {
          title: "Foundation: Build XP",
          description: `Focus on technical events like ${user.department} workshops. Goal: Reach 1000 XP.`,
          status: user.points >= 1000 ? 'Completed' : 'In Progress'
        },
        {
          title: "Specialization: Hackathon Era",
          description: "Participate in at least 2 national-level hackathons (Unstop) to build a portfolio.",
          status: 'Upcoming'
        },
        {
          title: "Leadership: Guild Master",
          description: "Lead a Guild or Club to demonstrate management and teamwork skills.",
          status: 'Upcoming'
        }
      ]
    };

    return res.status(200).json({
      success: true,
      data: {
        roadmap,
        hasLiveContext: !!liveEvents
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to generate roadmap.'
    });
  }
};
