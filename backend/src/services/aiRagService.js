const fs = require('fs');
const path = require('path');

/**
 * AI RAG Service: Retrieval-Augmented Generation
 * This service allows the AI to "query" the live event cache to provide
 * evidence-based recommendations to students.
 */
class AIRagService {
  constructor() {
    this.knowledgePath = path.resolve(__dirname, '../../../ai/data/live_knowafest.json');
  }

  /**
   * Retrieves relevant context from the live event cache
   * @param {string} query - The student's question or interest
   * @returns {string} - A string of relevant event data to be used as context
   */
  async getContext(query) {
    try {
      if (!fs.existsSync(this.knowledgePath)) return '';

      const rawData = fs.readFileSync(this.knowledgePath, 'utf8');
      const events = JSON.parse(rawData);
      
      const lowerQuery = query.toLowerCase();
      
      // Simple Semantic Search (Keyword Density + Category Matching)
      const relevantEvents = events.filter(event => {
        const text = `${event.title} ${event.description} ${event.category} ${event.location}`.toLowerCase();
        return lowerQuery.split(' ').some(word => word.length > 3 && text.includes(word));
      }).slice(0, 5); // Take top 5 relevant events

      if (relevantEvents.length === 0) return '';

      // Format as context for the AI
      return `RELEVANT LIVE OPPORTUNITIES:
${relevantEvents.map(e => `- ${e.title} (${e.category}) at ${e.location}. Points: ${e.points} XP. Link: ${e.externalLink}`).join('\n')}`;
      
    } catch (error) {
      console.error('RAG Retrieval Error:', error.message);
      return '';
    }
  }
}

module.exports = new AIRagService();
