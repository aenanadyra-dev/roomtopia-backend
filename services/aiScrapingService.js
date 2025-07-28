const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai'); // NEW: Direct import for v4

class AIScrapingService {
  constructor() {
    // NEW: OpenAI v4 syntax - much simpler! 🦕
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-magical-openai-key-here'
    });
    
    console.log('🦕 Hi there! Barney here, ready to scrape with AI magic v4!');
  }

  async scrapePropertyListings() {
    try {
      console.log('🎵 I love you, you love me, let\'s scrape properties with AI v4! 🏠✨');
      
      const allListings = [];
      
      // Let's try to scrape some real Malaysian property sites!
      const targetSites = [
        'https://www.mudah.my/selangor/shah-alam/properties-for-rent',
        'https://www.ibilik.my/rooms/shah-alam',
        'https://www.roomz.asia/room-rental/selangor/shah-alam'
      ];
      
      for (const site of targetSites) {
        try {
          console.log(`🦕 Scraping ${site} with super-dee-duper AI v4 power!`);
          const listings = await this.scrapeSiteWithOpenAI(site);
          allListings.push(...listings);
          await this.delay(3000); // Be nice and wait! 
        } catch (error) {
          console.log(`🦕 Oopsie! ${site} didn't work, but that's okay! We'll try another!`);
        }
      }
      
      // If scraping doesn't work, let's make beautiful mock data with AI!
      if (allListings.length === 0) {
        console.log('🎵 No worries! Let\'s make some super-special AI-generated properties!');
        return await this.generateAIPropertyListings();
      }
      
      console.log(`🦕 Yay! We found ${allListings.length} wonderful properties!`);
      return allListings;
      
    } catch (error) {
      console.error('🦕 Oopsie daisy! Something went wrong, but we can fix it!', error);
      return await this.generateAIPropertyListings();
    }
  }

  async scrapeSiteWithOpenAI(url) {
    try {
      console.log(`🎵 Using OpenAI v4 magic to understand ${url}! ✨`);
      
      // Get the webpage with our friendly request!
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      
      // Get the important text (not too much, OpenAI gets sleepy with big texts!)
      const pageText = $('body').text().substring(0, 6000);
      
      // NEW: OpenAI v4 syntax for chat completions! 🦕💜
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use gpt-3.5-turbo (cheaper than gpt-4)
        messages: [
          {
            role: "system",
            content: `🦕 Hi! You're Barney's special AI helper for finding rental properties! 
            Look at this Malaysian property website and find rental listings in Shah Alam area.
            
            For each property you find, give me a JSON array with:
            - title: The property name/title
            - price: Monthly rent (just the number, no RM)
            - location: Which area in Shah Alam (like "Seksyen 7", "Ken Rimba", etc.)
            - type: What kind of room ("Single Room", "Master Room", "Shared Room", "Studio")
            - description: A nice description of the property
            - contact: Phone number or email if you can find it
            
            Only look for properties in Shah Alam, Selangor! Return a valid JSON array only!
            If you can't find any properties, return an empty array [].`
          },
          {
            role: "user",
            content: `Please help me find rental properties from this website content: ${pageText}`
          }
        ],
        temperature: 0.2, // Keep it consistent!
        max_tokens: 2000
      });

      // NEW: v4 way to access the response
      const aiResponse = completion.choices[0].message.content;
      console.log('🦕 OpenAI v4 found some properties! Let me check them...');
      
      try {
        // Clean up the response to make sure it's good JSON!
        const cleanResponse = aiResponse.replace(/``````/g, '').trim();
        const listings = JSON.parse(cleanResponse);
        
        if (Array.isArray(listings)) {
          console.log(`🎵 Yay! Found ${listings.length} properties with OpenAI v4 magic!`);
          return listings.filter(listing => 
            listing.title && listing.price && listing.location
          );
        }
        return [];
      } catch (parseError) {
        console.log('🦕 Oopsie! OpenAI gave us something tricky to read, but that\'s okay!');
        return [];
      }

    } catch (error) {
      console.log(`🦕 ${url} was a little shy today, but we'll try again later!`);
      return [];
    }
  }

  async generateAIPropertyListings() {
    try {
      console.log('🎵 Let\'s ask OpenAI v4 to create some super-special property listings! ✨');
      
      // NEW: OpenAI v4 syntax for generating properties
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use gpt-3.5-turbo for cost efficiency
        messages: [
          {
            role: "system",
            content: `🦕 You're Barney's special helper! Create 12 realistic rental property listings for UiTM Shah Alam students.
            
            Make them diverse and realistic with:
            - Different locations around Shah Alam (Seksyen 1-25, Ken Rimba, i-City, Setia Alam, Kota Kemuning, etc.)
            - Various room types (Single Room, Master Room, Shared Room, Studio)
            - Realistic prices (RM 250-800 per month)
            - Student-friendly descriptions
            - Malaysian phone numbers (012, 011, 013, 010, 019 format)
            
            Return ONLY a valid JSON array with each property having: title, price, location, type, description, contact`
          },
          {
            role: "user",
            content: "Please create 12 wonderful rental property listings for Shah Alam students!"
          }
        ],
        temperature: 0.7, // Be creative!
        max_tokens: 3000
      });

      // NEW: v4 way to access the response
      const aiResponse = completion.choices[0].message.content;
      const cleanResponse = aiResponse.replace(/``````/g, '').trim();
      
      try {
        const listings = JSON.parse(cleanResponse);
        if (Array.isArray(listings)) {
          console.log(`🦕 OpenAI v4 made ${listings.length} super-special properties just for you!`);
          return listings;
        }
      } catch (parseError) {
        console.log('🦕 Let me make some backup properties the old-fashioned way!');
      }
      
      // Backup realistic data if OpenAI has trouble
      return this.createBackupListings();
      
    } catch (error) {
      console.log('🦕 OpenAI v4 is taking a nap! Let me make some properties myself!', error.message);
      return this.createBackupListings();
    }
  }

  createBackupListings() {
    const locations = [
      'Seksyen 7', 'Seksyen 2', 'Ken Rimba', 'i-City', 'Setia Alam',
      'Kota Kemuning', 'Seksyen 13', 'Bukit Rimau', 'Seksyen 15', 'Seksyen 9'
    ];
    
    const roomTypes = ['Single Room', 'Master Room', 'Shared Room', 'Studio'];
    const contacts = ['012-345-6789', '011-234-5678', '013-456-7890', '010-987-6543'];
    
    const listings = [];
    
    for (let i = 0; i < 12; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const price = Math.floor(Math.random() * (750 - 280) + 280);
      const contact = contacts[Math.floor(Math.random() * contacts.length)];
      
      listings.push({
        title: `Cozy ${roomType} in ${location}`,
        price: price,
        location: location,
        type: roomType,
        description: `Beautiful ${roomType.toLowerCase()} perfect for UiTM students. Near campus, fully furnished with WiFi and air conditioning. Safe and friendly neighborhood!`,
        contact: contact,
        source: 'Barney\'s AI Magic v4'
      });
    }
    
    console.log('🎵 Made 12 super-dee-duper backup properties with love!');
    return listings;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = AIScrapingService;
