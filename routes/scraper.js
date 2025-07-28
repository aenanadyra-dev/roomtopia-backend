const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});

// Apply rate limiting to this route
router.use(limiter);

// Headers to mimic browser behavior
const SCRAPING_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 RoomtopiaAcademicProject/1.0',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.ibilik.my/',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
};

/**
 * @route GET /scrape
 * @desc Scrape room listings from iBilik.my in Shah Alam
 * @access Public
 */
router.get('/scrape', async (req, res) => {
  try {
    // Target URL for Shah Alam student rooms
    const baseUrl = 'https://www.ibilik.my/rooms/shah_alam';
    const maxPages = 3; // Limit to 3 pages to be polite
    const allListings = [];

    // Loop through pages (with delays between requests)
    for (let page = 1; page <= maxPages; page++) {
      const url = page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
      
      console.log(`Scraping page ${page}: ${url}`);
      
      try {
        // Add delay to be polite (3-5 seconds between requests)
        await new Promise(resolve => setTimeout(resolve, 3500));
        
        const response = await axios.get(url, { 
          headers: SCRAPING_HEADERS,
          timeout: 10000 // 10 second timeout
        });
        
        const $ = cheerio.load(response.data);

        // Extract listings from current page
        $('.space-list-item, .listing-item').each((index, element) => {
          const title = $(element).find('.space-title, .listing-title').text().trim();
          const priceText = $(element).find('.price, .listing-price').text().trim();
          const location = $(element).find('.location, .listing-location').text().trim();
          const image = $(element).find('img').attr('src') || $(element).find('img').attr('data-src');
          const relativeUrl = $(element).find('a').attr('href');
          const description = $(element).find('.description, .listing-desc').text().trim();

          // Clean and format data
          const numericPrice = priceText.replace(/[^\d]/g, '');
          const fullUrl = relativeUrl ? `https://www.ibilik.my${relativeUrl}` : null;
          const fullImageUrl = image ? (image.startsWith('http') ? image : `https://www.ibilik.my${image}`) : null;

          if (title && priceText) {
            allListings.push({
              title,
              price: numericPrice || '0',
              formattedPrice: priceText,
              location: location.replace(/\s+/g, ' ').trim(),
              image: fullImageUrl,
              url: fullUrl,
              description: description.replace(/\s+/g, ' ').trim(),
              source: 'iBilik.my',
              scrapedAt: new Date().toISOString()
            });
          }
        });

        // Check if there are more pages
        const nextPageExists = $('.pagination .active + li').length > 0;
        if (!nextPageExists) break;

      } catch (pageError) {
        console.error(`Error scraping page ${page}:`, pageError.message);
        continue; // Skip to next page if current page fails
      }
    }

    // Respond with the scraped data
    res.set("Content-Type", "application/json");
    res.status(200).json({
      success: true,
      count: allListings.length,
      data: allListings,
      note: "Data scraped from iBilik.my for academic purposes only"
    });

  } catch (err) {
    console.error('Scraping failed:', err);
    res.status(500).json({ 
      success: false,
      error: err.message,
      note: "iBilik.my may have updated their website structure. Please check selectors."
    });
  }
});

module.exports = router;