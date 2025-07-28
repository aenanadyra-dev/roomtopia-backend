const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Create a new listing
router.post('/', async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Get a single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        error: 'Listing not found' 
      });
    }
    res.json({
      success: true,
      data: listing
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Update a listing
router.put('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        error: 'Listing not found' 
      });
    }
    res.json({
      success: true,
      data: listing
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Delete a listing
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        error: 'Listing not found' 
      });
    }
    res.json({ 
      success: true,
      message: 'Listing deleted successfully' 
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

module.exports = router;