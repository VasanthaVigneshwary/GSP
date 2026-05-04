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
          description: `Organized by ${college} in ${city}, Tamil Nadu. Event Type: ${type}`,
          date: new Date(date),
          location: `${college}, ${city}`,
          category: title.toLowerCase().includes('hackathon') ? 'Hackathon' : (type.includes('Cultural') ? 'Cultural' : 'Technical'),
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
 * Scrapes upcoming hackathons from Unstop
 * Target: https://unstop.com/hackathons?oppstatus=open
 */
const scrapeUnstop = async () => {
  try {
    const url = 'https://unstop.com/hackathons?oppstatus=open';
    // Note: Unstop uses dynamic loading, but often the first batch is in the HTML
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    
    const events = [];
    
    // Unstop uses 'a.item' or similar for their competition cards
    $('.opp-card, a.item').each((index, element) => {
      const title = $(element).find('h3, .title').text().trim();
      const organizer = $(element).find('p, .organizer').first().text().trim();
      const link = $(element).attr('href');
      const detailsLink = link.startsWith('http') ? link : 'https://unstop.com' + link;
      
      // Points for Unstop are higher (National Level)
      const points = 50;

      if (title && detailsLink) {
        events.push({
          title,
          description: `National Level Hackathon organized by ${organizer}. High-value competition.`,
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week if date parse fails
          location: organizer,
          category: 'Hackathon',
          points,
          externalLink: detailsLink,
          isExternal: true,
          source: 'Unstop'
        });
      }
    });

    console.log(`Scraper: Found ${events.length} events from Unstop.`);
    return events;
  } catch (error) {
    console.error('Unstop Scraper Error:', error.message);
    return [];
  }
};

/**
 * Syncs scraped events to the GSP database
 */
const syncScrapedEvents = async () => {
  const knowafestEvents = await scrapeKnowafest();
  const unstopEvents = await scrapeUnstop();
  
  const allEvents = [...knowafestEvents, ...unstopEvents];
  let addedCount = 0;

  for (const eventData of allEvents) {
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
  scrapeUnstop,
  syncScrapedEvents
};
