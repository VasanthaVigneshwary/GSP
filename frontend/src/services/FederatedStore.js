/**
 * FederatedStore.js
 * Implements a "Pseudo-Federated Learning" layer on the student's device.
 * Stores local raw logs and compresses them for weekend server updates.
 */

const LOCAL_STORAGE_KEY = 'gsp_federated_memory';

export const FederatedStore = {
  /**
   * Save a raw interaction locally (doesn't send to server)
   */
  logInteraction: (type, details) => {
    const memory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const newInteraction = {
      timestamp: new Date().toISOString(),
      type,
      details,
      context: window.location.pathname // Where they were when it happened
    };
    
    memory.push(newInteraction);
    // Keep only last 100 items to save device space
    if (memory.length > 100) memory.shift();
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memory));
    console.log('Federated Node: Local interaction logged.');
  },

  /**
   * Generates a "Learning Contribution" for the weekend sync.
   * This compresses the week's data into a training format.
   */
  generateWeekendContribution: (userStats) => {
    const memory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    if (memory.length === 0) return null;

    // Distill the data into a Training Pair
    // Format: [Context/Profile] -> [Success Action]
    const contribution = {
      prompt: `Profile: ${userStats.department}, Level: ${Math.floor(userStats.points/100) + 1}`,
      output: `Student focused on ${memory[memory.length - 1].type} which lead to growth in ${userStats.interests?.[0] || 'general'} skills.`,
      interactionCount: memory.length,
      weekSummary: memory.map(m => m.type).join(', ')
    };

    return contribution;
  },

  /**
   * Clear local memory after a successful sync
   */
  clearMemory: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};
