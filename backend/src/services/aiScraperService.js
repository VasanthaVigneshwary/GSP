const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event'); // Assuming you have an Event model

/**
 * Scrapes upcoming events from Knowafest for a specific state
 * Target: https://www.knowafest.com/explore/state/Tamil_Nadu
 */
const scrapeKnowafest = async (state = 'Tamil_Nadu') => {
  try {
    const url = `https://www.knowafest.com/explore/state/${state}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const events = [];
    
    // Select all rows in the events table
    $('table.table tr').each((index, element) => {
      // Skip the header row
      if (index === 0) return;
      
      const cols = $(element).find('td');
      if (cols.length >= 4) {
        const date = $(cols[0]).text().trim();
        const title = $(cols[1]).find('a').text().trim().replace(' View More', '');
        const detailsLink = 'https://www.knowafest.com' + $(cols[1]).find('a').attr('href');
        const type = $(cols[2]).text().trim();
        const college = $(cols[3]).text().trim();
        const city = $(cols[4]).text().trim();

        // Map type to XP
        let points = 20;
        if (type.includes('Conference')) points = 30;
        if (type.includes('Symposium')) points = 25;
        if (type.includes('Workshop')) points = 20;

        events.push({
          title,
          description: `Organized by ${college} in ${city}. Event Type: ${type}`,
          date: new Date(date),
          location: `${college}, ${city}`,
          category: type.includes('Cultural') ? 'Cultural' : 'Technical',
          points,
          externalLink: detailsLink,
          isExternal: true,
          source: 'Knowafest'
        });
      }
    });

    console.log(`Scraper: Found ${events.length} events from Knowafest.`);
    return events;
  } catch (error) {
    console.error('Knowafest Scraper Error:', error.message);
    return [];
  }
};

/**
 * Syncs scraped events to the GSP database
 */
const syncScrapedEvents = async () => {
  const scrapedEvents = await scrapeKnowafest();
  let addedCount = 0;

  for (const eventData of scrapedEvents) {
    // Check if event already exists (Deduplication)
    const existing = await Event.findOne({ title: eventData.title, location: eventData.location });
    if (!existing) {
      const newEvent = new Event(eventData);
      await newEvent.save();
      addedCount++;
    }
  }

  return addedCount;
};

module.exports = {
  scrapeKnowafest,
  syncScrapedEvents
};
