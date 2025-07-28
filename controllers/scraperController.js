const axios = require('axios');
const cheerio = require('cheerio');
const Data = require('../models/Data');

const scrapeData = async (req, res) => {
    try {
      // Get URL from request body instead of hardcoding
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: 'URL is required' });
  
      const response = await axios.get(url); // Use dynamic URL
      const html = response.data;
      const $ = cheerio.load(html);
  
      const dataList = [];
  
      // Update selector to match your actual target website
      $('your-actual-selector').each((i, el) => {
        const title = $(el).find('h2').text().trim();
        const link = $(el).find('a').attr('href');
        const date = new Date();
  
        dataList.push({ title, link, date });
      });
  
      // Add error handling for empty results
      if (dataList.length === 0) {
        return res.status(404).json({ message: 'No data found with current selectors' });
      }
  
      await Data.insertMany(dataList);
      res.status(200).json({ 
        message: 'Data scraped and saved successfully',
        count: dataList.length,
        data: dataList 
      });
    } catch (error) {
      console.error('Scraping error:', error);
      res.status(500).json({ 
        error: 'Scraping failed',
        details: error.message 
      });
    }
  };
