const fs = require('fs');
const path = require('path');
const { scrapeKnowafest } = require('./aiScraperService');

const runLiveSync = async () => {
  console.log('🚀 Starting LIVE Knowafest Scrape...');
  try {
    const events = await scrapeKnowafest('Tamil_Nadu');
    const cachePath = path.join(__dirname, '../../../../ai/data/live_knowafest.json');
    
    // Ensure directory exists
    const dir = path.dirname(cachePath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(cachePath, JSON.stringify(events, null, 2));
    console.log(`✅ Success! Saved ${events.length} live events to ai/data/live_knowafest.json`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Live Scrape Failed:', error.message);
    process.exit(1);
  }
};

runLiveSync();
