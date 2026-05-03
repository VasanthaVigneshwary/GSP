const fs = require('fs');
const path = require('path');

const FEDERATED_DATA_PATH = path.join(__dirname, '../../../../ai/data/federated_buffer.json');

/**
 * Aggregates a learning contribution from a student's device
 * @param {Object} contribution - Distilled training pair from the device
 */
const aggregateContribution = async (contribution) => {
  try {
    let data = [];
    if (fs.existsSync(FEDERATED_DATA_PATH)) {
      const fileContent = fs.readFileSync(FEDERATED_DATA_PATH, 'utf8');
      data = JSON.parse(fileContent);
    }

    // Standardize the training pair
    const trainingPair = {
      prompt: contribution.prompt,
      output: contribution.output,
      timestamp: new Date().toISOString(),
      source: 'federated_node'
    };

    data.push(trainingPair);

    // Keep the buffer at a manageable size (e.g., 1000 latest contributions)
    if (data.length > 1000) data = data.slice(-1000);

    fs.writeFileSync(FEDERATED_DATA_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to aggregate federated contribution:', error.message);
    return false;
  }
};

/**
 * Clears the buffer after the model has been successfully retrained
 */
const clearBuffer = () => {
  if (fs.existsSync(FEDERATED_DATA_PATH)) {
    fs.writeFileSync(FEDERATED_DATA_PATH, '[]');
  }
};

module.exports = {
  aggregateContribution,
  clearBuffer
};
