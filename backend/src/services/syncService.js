const axios = require('axios');
const User = require('../models/User');

/**
 * Syncs GitHub commit activity for a specific user
 * @param {Object} user - Mongoose User document
 */
const syncGitHubActivity = async (user) => {
  if (!user.githubUsername) return;

  try {
    const response = await axios.get(`https://api.github.com/users/${user.githubUsername}/events/public`);
    const pushEvents = response.data.filter(event => event.type === 'PushEvent');
    
    // Logic to calculate points for new commits since last sync
    // For simplicity, we award points based on the count of recent push events
    const pointsToAdd = pushEvents.length * 5;
    
    if (pointsToAdd > 0) {
      user.points += pointsToAdd;
      // Log this activity
      user.activityLog.push({
        date: new Date().toISOString().split('T')[0],
        count: pushEvents.length,
        type: 'GitHub Commits'
      });
      await user.save();
    }
  } catch (error) {
    console.error(`Failed to sync GitHub for ${user.name}:`, error.message);
  }
};

/**
 * Prunes old data to keep the database lean
 */
const pruneOldData = async () => {
  console.log('Running weekly data pruning...');
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Example: Clear old activity logs but keep the summary count
  // In a real app, you might move this to an 'Archive' collection
  const users = await User.find({});
  for (const user of users) {
    user.activityLog = user.activityLog.filter(log => new Date(log.date) > thirtyDaysAgo);
    await user.save();
  }
};

/**
 * Runs the full weekend sync for all users
 */
const performWeekendSync = async () => {
  console.log('Starting Weekend Sync...');
  const users = await User.find({ githubUsername: { $exists: true, $ne: '' } });
  
  for (const user of users) {
    await syncGitHubActivity(user);
  }
  
  await pruneOldData();
  console.log('Weekend Sync completed.');
};

module.exports = {
  performWeekendSync,
  syncGitHubActivity
};
