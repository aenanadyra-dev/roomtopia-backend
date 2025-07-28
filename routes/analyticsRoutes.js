// SERVER SIDE: routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const PropertyListing = require('../models/PropertyListing');
const RoommateRequest = require('../models/RoommateRequest');

// Track user behavior - ENHANCED WITH BETTER ERROR HANDLING
router.post('/track', async (req, res) => {
  try {
    console.log('📊 Analytics tracking request:', req.body);
    
    const { type, data } = req.body;
    
    // ✅ VALIDATE REQUIRED FIELDS
    if (!type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Analytics type is required' 
      });
    }
    
    // ✅ CREATE ANALYTICS ENTRY WITH ENHANCED DATA
    const analyticsData = new Analytics({
      type: type,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress
      },
      userId: data?.userEmail || 'anonymous',
      timestamp: new Date()
    });
    
    await analyticsData.save();
    
    console.log('✅ Analytics saved successfully:', type);
    res.status(200).json({ 
      success: true, 
      message: 'Analytics tracked successfully',
      type: type 
    });
    
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to save analytics data'
    });
  }
});

// Get popular property locations
router.get('/popular-locations', async (req, res) => {
  try {
    console.log('✅ Popular locations endpoint hit');

    const locations = await Analytics.aggregate([
      { $match: { type: 'property_search' } },
      { $group: { _id: '$data.location', count: { $sum: 1 } } },
      { $sort : { count: -1 } },
      { $limit: 10 }
    ]);

    const formatted = locations.map(item => ({
      location : item._id || 'Unknown',
      searches : item.count
    }));

    res.json(formatted);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get roommate search trends
router.get('/roommate-trends', async (req, res) => {
  try {
    console.log('✅ Roommate trends endpoint hit');
    const trends = await Analytics.aggregate([
      { $match: { type: 'roommate_search' } },
      { $group: { _id: '$data.roommateGender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const formattedData = trends.map(item => ({
      gender: item._id || 'Not specified',
      searches: item.count
    }));
    
    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get live activity counts
router.get('/live-activity', async (req, res) => {
  try {
    console.log('✅ Live activity endpoint hit');
    
    const activeProperties = await PropertyListing.countDocuments({ 
      status: { $in: ['active', 'available'] } 
    });
    
    const activeRoommates = await RoommateRequest.countDocuments({ 
      status: { $in: ['active', 'looking'] } 
    });
    
    const totalBookmarks = await Analytics.countDocuments({ 
      type: 'property_view' 
    });
    
    res.json({
      properties: activeProperties,
      roommates: activeRoommates,
      bookmarks: totalBookmarks
    });
  } catch (error) {
    console.error('❌ Live activity error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get price range distribution
router.get('/price-ranges', async (req, res) => {
  try {
    console.log('✅ Price ranges endpoint hit');
    
    const priceRanges = await PropertyListing.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [100, 400, 700, 1000, 1500, 2000, 10000],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' }
          }
        }
      }
    ]);
    
    const formattedData = priceRanges.map((range, index) => {
      const ranges = ['100-400', '400-700', '700-1000', '1000-1500', '1500-2000', '2000+'];
      return {
        range: `RM ${ranges[index] || 'Other'}`,
        count: range.count,
        percentage: 0
      };
    });
    
    res.json(formattedData);
  } catch (error) {
    console.error('❌ Price ranges error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ FIXED: Get roommate gender distribution (WHO POSTED REQUESTS)
router.get('/roommate-preferences', async (req, res) => {
  try {
    console.log('✅ Roommate-preferences endpoint hit');

    // First, let's see ALL roommate requests to debug
    const allRequests = await RoommateRequest.find({}).select('name gender status');
    console.log('🔍 ALL roommate requests in database:', allRequests);

    // ✅ GET GENDER DISTRIBUTION OF STUDENTS WHO POSTED ROOMMATE REQUESTS
    const genderPrefs = await RoommateRequest.aggregate([
      {
        $match: {
          gender: { $in: ['Male', 'Female'] }
          // Remove status filter to get ALL roommate requests
        }
      },
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('🔍 Raw roommate gender distribution:', genderPrefs);

    // ✅ FORMAT FOR FRONTEND WITH REAL COUNTS
    const formatted = genderPrefs.map(item => ({
      name: item._id,
      count: item.count,
      value: 0
    }));

    // ✅ CALCULATE PERCENTAGES
    const total = formatted.reduce((sum, item) => sum + item.count, 0);
    formatted.forEach(item => {
      item.value = total > 0 ? Math.round((item.count / total) * 100) : 0;
    });

    console.log('✅ Formatted roommate gender distribution:', formatted);
    res.json(formatted);

  } catch (err) {
    console.error('❌ Roommate-preferences error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ CACHE FOR CONSISTENT DATA - CLEARED FOR FRESH DATA
let cachedDashboardData = null; // ✅ RESET CACHE
let lastCacheTime = 0;
const CACHE_DURATION = 10000; // 10 seconds cache

// ✅ DASHBOARD ROUTE - REAL USER BEHAVIOR WITH CACHING
router.get('/dashboard', async (req, res) => {
  try {
    console.log('📊 Dashboard analytics requested');

    // Check if we have valid cached data
    const now = Date.now();
    if (cachedDashboardData && (now - lastCacheTime) < CACHE_DURATION) {
      console.log('✅ Returning cached dashboard data');
      return res.json({ success: true, data: cachedDashboardData });
    }

    // 1. REAL TOTAL SEARCHES (INCLUDING BOOKMARKS AS ENGAGEMENT)
    const totalSearches = await Analytics.countDocuments({
      type: { $in: ['property_search', 'roommate_search', 'location_search', 'property_bookmark'] }
    });
    console.log('🔍 DEBUG: Total searches count:', totalSearches);

    // 2. REAL TOP LOCATION - COMBINE SEARCHES AND BOOKMARKS FOR ACCURATE POPULARITY
    // This includes: location searches, property searches with location, and property bookmarks
    // This gives a comprehensive view of which locations users are most interested in
    const locationSearches = await Analytics.aggregate([
      {
        $addFields: {
          // ✅ NORMALIZE LOCATION FIELD - handle different field names
          normalizedLocation: {
            $cond: {
              if: { $eq: ['$type', 'location_search'] },
              then: '$data.searchTerm', // location_search uses searchTerm
              else: '$data.location'    // property_search and property_bookmark use location
            }
          }
        }
      },
      {
        $match: {
          type: { $in: ['location_search', 'property_search', 'property_bookmark'] },
          normalizedLocation: {
            $exists: true,
            $ne: null,
            $ne: '',
            $ne: 'Any',
            $ne: 'Unknown',
            $ne: 'any',
            $ne: 'ALL',
            $ne: 'all',
            $type: 'string'
          }
        }
      },
      { $group: { _id: '$normalizedLocation', count: { $sum: 1 } } },
      {
        $match: {
          '_id': {
            $ne: null,
            $ne: '',
            $ne: 'Any',
            $ne: 'any',
            $ne: 'ALL',
            $ne: 'all',
            $type: 'string'
          }
        }
      },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 8 }
    ]);
    
    // 3. REAL ROOMMATE GENDER DISTRIBUTION (WHO POSTED REQUESTS)
    const roommatePrefs = await RoommateRequest.aggregate([
      {
        $match: {
          gender: { $in: ['Male', 'Female'] }
          // Remove status filter to get ALL roommate requests
        }
      },
      { $group: { _id: '$gender', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // 4. REAL DREAM HOMES
    const dreamHomesCount = await Analytics.countDocuments({ 
      type: 'property_bookmark' 
    });
    
    // 5. REAL PRICE SEARCH BEHAVIOR
    const priceSearches = await Analytics.aggregate([
      { $match: { type: 'property_search', 'data.minPrice': { $exists: true } } },
      { $group: { 
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ['$data.maxPrice', 600] }, then: '400-600' },
                { case: { $lte: ['$data.maxPrice', 800] }, then: '600-800' },
                { case: { $lte: ['$data.maxPrice', 1000] }, then: '800-1000' },
                { case: { $lte: ['$data.maxPrice', 1200] }, then: '1000-1200' }
              ],
              default: '1200+'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get current live counts
    const [activeProperties, activeRoommates] = await Promise.all([
      PropertyListing.countDocuments(),
      RoommateRequest.countDocuments()
    ]);

    console.log('🔍 DEBUG: Location searches result:', locationSearches);
    console.log('🔍 DEBUG: Total searches for percentage:', totalSearches);

    // ✅ FILTER AND CALCULATE REAL LOCATION TOTAL
    const filteredLocationSearches = locationSearches.filter(item =>
      item._id &&
      item._id.trim() !== '' &&
      item._id !== 'Any' &&
      item._id !== 'any' &&
      item._id !== 'ALL' &&
      item._id !== 'all'
    );

    const locationTotalSearches = filteredLocationSearches.reduce((sum, item) => sum + item.count, 0);
    console.log('🔍 DEBUG: Filtered location total searches:', locationTotalSearches);

    const dashboardData = {
      totalSearches: locationTotalSearches || 0, // ✅ USE FILTERED LOCATION TOTAL
      trendingLocation: {
        name: filteredLocationSearches[0]?._id || "No searches yet",
        searches: filteredLocationSearches[0]?.count || 0,
        percentage: locationTotalSearches > 0 ? Math.round((filteredLocationSearches[0]?.count || 0) / locationTotalSearches * 100) : 0,
        trend: filteredLocationSearches[0]?.count > 0 ? `+${filteredLocationSearches[0]?.count} searches` : "No activity"
      },
      activeUsers: {
        properties: activeProperties || 0,
        roommates: activeRoommates || 0,
        bookmarks: dreamHomesCount || 0
      },
      locationData: filteredLocationSearches.map(item => ({
        name: item._id,
        searches: item.count
      })),
      roommatePreferences: roommatePrefs.map((item) => {
        const total = roommatePrefs.reduce((sum, pref) => sum + pref.count, 0);
        return {
          name: item._id,
          count: item.count,
          value: total > 0 ? Math.round((item.count / total) * 100) : 0
        };
      }),
      priceRanges: priceSearches.map(item => ({
        range: `RM ${item._id}`,
        count: item.count,
        percentage: totalSearches > 0 ? Math.round((item.count / totalSearches) * 100) : 0
      }))
    };

    // ✅ CACHE THE RESULT FOR CONSISTENCY
    cachedDashboardData = dashboardData;
    lastCacheTime = now;

    console.log('✅ REAL Dashboard data cached:', dashboardData);
    console.log('🔍 DEBUG: Final response totalSearches:', dashboardData.totalSearches);
    console.log('🔍 DEBUG: Final response locationData length:', dashboardData.locationData.length);
    res.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;