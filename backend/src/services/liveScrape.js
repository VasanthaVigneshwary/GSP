const fs = require('fs');
const path = require('path');
const { scrapeKnowafest, scrapeUnstop } = require('./aiScraperService');

const runLiveSync = async () => {
  console.log('🚀 Starting LIVE Multi-Source Scrape (Knowafest + Unstop)...');
  try {
    const kEvents = await scrapeKnowafest('Tamil_Nadu');
    const uEvents = await scrapeUnstop();
    const allEvents = [...kEvents, ...uEvents];
    
    const cachePath = path.join(__dirname, '../../../ai/data/live_knowafest.json');
    
    // Ensure directory exists
    const dir = path.dirname(cachePath);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(cachePath, JSON.stringify(allEvents, null, 2));
    console.log(`✅ Success! Saved ${allEvents.length} live events from multiple sources.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Live Scrape Failed:', error.message);
    process.exit(1);
  }
};

runLiveSync();
