const express = require('express');
const router = express.Router();

// Mock review data for now (replace with real database later)
let reviews = [
  {
    id: 1,
    userName: 'Sarah Ahmad',
    userEmail: 'sarah@student.uitm.edu.my',
    property: 'Seksyen 7 Apartment',
    rating: 5,
    comment: 'Amazing place! The landlord is very responsive and the location is perfect for UiTM students.',
    date: '2025-01-15',
    status: 'approved',
    reportCount: 0
  },
  {
    id: 2,
    userName: 'Ahmad Rahman', 
    userEmail: 'ahmad@student.uitm.edu.my',
    property: 'Ken Rimba Condo',
    rating: 2,
    comment: 'This place is terrible! The landlord is a scammer and the room is dirty. Avoid at all costs!',
    date: '2025-01-14',
    status: 'flagged',
    reportCount: 3
  },
  {
    id: 3,
    userName: 'Nurul Aina',
    userEmail: 'nurul@student.uitm.edu.my',
    property: 'Seksyen 2 House',
    rating: 4,
    comment: 'Good location and decent facilities. Roommates are friendly and the rent is affordable.',
    date: '2025-01-13',
    status: 'pending',
    reportCount: 0
  },
  {
    id: 4,
    userName: 'David Lim',
    userEmail: 'david@student.uitm.edu.my',
    property: 'i-City Residence',
    rating: 1,
    comment: 'Worst experience ever! The owner is racist and discriminates against non-Malay tenants.',
    date: '2025-01-12',
    status: 'flagged',
    reportCount: 5
  }
];

// Get all reviews
router.get('/', (req, res) => {
  try {
    console.log('📋 Fetching all reviews...');
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reviews' 
    });
  }
});

// Get review by ID
router.get('/:id', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch review' 
    });
  }
});

// Delete review
router.delete('/:id', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }
    
    const deletedReview = reviews.splice(reviewIndex, 1)[0];
    console.log(`🗑️ Deleted review: ${deletedReview.id} by ${deletedReview.userName}`);
    
    res.json({ 
      success: true,
      message: 'Review deleted successfully',
      data: deletedReview
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete review' 
    });
  }
});

// Approve review
router.put('/:id/approve', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }
    
    review.status = 'approved';
    console.log(`✅ Approved review: ${review.id} by ${review.userName}`);
    
    res.json({ 
      success: true,
      message: 'Review approved successfully', 
      data: review 
    });
  } catch (error) {
    console.error('Error approving review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to approve review' 
    });
  }
});

// Flag review
router.put('/:id/flag', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find(r => r.id === reviewId);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }
    
    review.status = 'flagged';
    review.reportCount += 1;
    console.log(`🚩 Flagged review: ${review.id} by ${review.userName}`);
    
    res.json({ 
      success: true,
      message: 'Review flagged successfully', 
      data: review 
    });
  } catch (error) {
    console.error('Error flagging review:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to flag review' 
    });
  }
});

// Get reviews by status
router.get('/status/:status', (req, res) => {
  try {
    const status = req.params.status;
    const filteredReviews = reviews.filter(r => r.status === status);
    
    res.json({
      success: true,
      count: filteredReviews.length,
      data: filteredReviews
    });
  } catch (error) {
    console.error('Error fetching reviews by status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch reviews by status' 
    });
  }
});

module.exports = router;
