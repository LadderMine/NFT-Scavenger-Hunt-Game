// Mock data for puzzle reviews
const mockReviews = [
  {
    id: '1',
    puzzleId: 'puzzle-001',
    userId: 'user-123',
    username: 'JohnDoe',
    rating: 5,
    reviewText: 'This puzzle was absolutely fantastic! The clues were well-crafted and the difficulty was just right. I particularly enjoyed the creative use of QR codes and the way the story unfolded throughout the hunt.',
    reviewType: 'DETAILED',
    status: 'PENDING',
    isAnonymous: false,
    tags: ['engaging', 'creative', 'well-designed'],
    helpfulCount: 3,
    reportCount: 0,
    metadata: {
      difficulty: 'INTERMEDIATE',
      completionTime: 25,
      deviceInfo: 'iPhone 14',
      ipAddress: '192.168.1.100'
    },
    moderationInfo: null,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    puzzleId: 'puzzle-002',
    userId: 'user-456',
    username: 'JaneSmith',
    rating: 4,
    reviewText: 'Great puzzle design! The hints were helpful without giving too much away. Would definitely recommend to others.',
    reviewType: 'TEXT_REVIEW',
    status: 'APPROVED',
    isAnonymous: false,
    tags: ['recommended', 'hints'],
    helpfulCount: 7,
    reportCount: 0,
    metadata: {
      difficulty: 'BEGINNER',
      completionTime: 15,
      deviceInfo: 'Samsung Galaxy S21',
      ipAddress: '192.168.1.101'
    },
    moderationInfo: {
      moderatedBy: 'admin@example.com',
      moderatedAt: '2024-01-16T09:15:00Z',
      moderationReason: 'Approved - appropriate content'
    },
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    puzzleId: 'puzzle-003',
    userId: null,
    username: 'Anonymous',
    rating: 2,
    reviewText: 'This puzzle was too difficult and the instructions were unclear. Not enjoyable at all.',
    reviewType: 'TEXT_REVIEW',
    status: 'REJECTED',
    isAnonymous: true,
    tags: ['difficult', 'unclear'],
    helpfulCount: 1,
    reportCount: 2,
    metadata: {
      difficulty: 'EXPERT',
      completionTime: 45,
      deviceInfo: 'Desktop Chrome',
      ipAddress: '192.168.1.102'
    },
    moderationInfo: {
      moderatedBy: 'admin@example.com',
      moderatedAt: '2024-01-17T11:30:00Z',
      moderationReason: 'Rejected - inappropriate language'
    },
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-17T11:30:00Z'
  },
  {
    id: '4',
    puzzleId: 'puzzle-001',
    userId: 'user-789',
    username: 'PuzzleMaster',
    rating: 5,
    reviewText: 'Excellent puzzle! The blockchain integration was seamless and educational. Loved learning about smart contracts while solving.',
    reviewType: 'DETAILED',
    status: 'PENDING',
    isAnonymous: false,
    tags: ['blockchain', 'educational', 'smart-contracts'],
    helpfulCount: 5,
    reportCount: 0,
    metadata: {
      difficulty: 'ADVANCED',
      completionTime: 35,
      deviceInfo: 'MacBook Pro',
      ipAddress: '192.168.1.103'
    },
    moderationInfo: null,
    createdAt: '2024-01-18T08:15:00Z',
    updatedAt: '2024-01-18T08:15:00Z'
  },
  {
    id: '5',
    puzzleId: 'puzzle-004',
    userId: 'user-101',
    username: 'CryptoEnthusiast',
    rating: 3,
    reviewText: 'Decent puzzle but could use more hints for beginners.',
    reviewType: 'RATING_ONLY',
    status: 'PENDING',
    isAnonymous: false,
    tags: ['beginner-friendly'],
    helpfulCount: 2,
    reportCount: 0,
    metadata: {
      difficulty: 'BEGINNER',
      completionTime: 20,
      deviceInfo: 'iPad Pro',
      ipAddress: '192.168.1.104'
    },
    moderationInfo: null,
    createdAt: '2024-01-19T12:00:00Z',
    updatedAt: '2024-01-19T12:00:00Z'
  }
];

// Mock statistics
const mockStats = {
  totalCount: 5,
  pendingCount: 3,
  approvedCount: 1,
  rejectedCount: 1,
  averageRating: 3.8,
  ratingDistribution: {
    1: 0,
    2: 1,
    3: 1,
    4: 1,
    5: 2
  }
};

class PuzzleReviewService {
  constructor() {
    this.reviews = [...mockReviews];
    this.stats = { ...mockStats };
  }

  // Simulate API delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all puzzle reviews with filtering and pagination
  async getPuzzleReviews(filters = {}) {
    await this.delay();
    
    let filteredReviews = [...this.reviews];
    
    // Apply filters
    if (filters.status) {
      filteredReviews = filteredReviews.filter(review => review.status === filters.status);
    }
    
    if (filters.rating) {
      filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filters.rating));
    }
    
    if (filters.minRating) {
      filteredReviews = filteredReviews.filter(review => review.rating >= parseInt(filters.minRating));
    }
    
    if (filters.maxRating) {
      filteredReviews = filteredReviews.filter(review => review.rating <= parseInt(filters.maxRating));
    }
    
    if (filters.reviewType) {
      filteredReviews = filteredReviews.filter(review => review.reviewType === filters.reviewType);
    }
    
    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'DESC';
    
    filteredReviews.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    return {
      success: true,
      message: 'Reviews retrieved successfully',
      data: {
        reviews: paginatedReviews,
        total: filteredReviews.length,
        page: page,
        totalPages: Math.ceil(filteredReviews.length / limit)
      }
    };
  }

  // Get a specific review by ID
  async getReviewById(reviewId) {
    await this.delay();
    const review = this.reviews.find(r => r.id === reviewId);
    
    if (!review) {
      throw new Error('Review not found');
    }
    
    return {
      success: true,
      message: 'Review retrieved successfully',
      data: review
    };
  }

  // Update review status (approve/reject)
  async updateReviewStatus(reviewId, status, moderationReason = '') {
    await this.delay();
    
    const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }
    
    const review = this.reviews[reviewIndex];
    review.status = status;
    review.moderationInfo = {
      moderatedBy: 'admin@example.com',
      moderatedAt: new Date().toISOString(),
      moderationReason: moderationReason
    };
    review.updatedAt = new Date().toISOString();
    
    // Update stats
    this.updateStats();
    
    return {
      success: true,
      message: `Review ${status.toLowerCase()} successfully`,
      data: review
    };
  }

  // Get review statistics
  async getReviewStats() {
    await this.delay();
    return {
      success: true,
      message: 'Review statistics retrieved successfully',
      data: this.stats
    };
  }

  // Get puzzle review summary
  async getPuzzleReviewSummary(puzzleId) {
    await this.delay();
    const puzzleReviews = this.reviews.filter(r => r.puzzleId === puzzleId);
    
    const summary = {
      puzzleId,
      totalReviews: puzzleReviews.length,
      averageRating: puzzleReviews.reduce((sum, r) => sum + r.rating, 0) / puzzleReviews.length,
      ratingDistribution: puzzleReviews.reduce((acc, r) => {
        acc[r.rating] = (acc[r.rating] || 0) + 1;
        return acc;
      }, {}),
      statusDistribution: puzzleReviews.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {})
    };
    
    return {
      success: true,
      message: 'Puzzle review summary retrieved successfully',
      data: summary
    };
  }

  // Report a review
  async reportReview(reviewId, reason) {
    await this.delay();
    
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    
    review.reportCount += 1;
    review.updatedAt = new Date().toISOString();
    
    return {
      success: true,
      message: 'Review reported successfully',
      data: review
    };
  }

  // Bulk update review statuses
  async bulkUpdateReviewStatuses(reviewIds, status, moderationReason = '') {
    await this.delay();
    
    const updatedReviews = [];
    for (const reviewId of reviewIds) {
      const result = await this.updateReviewStatus(reviewId, status, moderationReason);
      updatedReviews.push(result.data);
    }
    
    return {
      success: true,
      message: `${reviewIds.length} reviews ${status.toLowerCase()} successfully`,
      data: updatedReviews
    };
  }

  // Helper method to update statistics
  updateStats() {
    const total = this.reviews.length;
    const pending = this.reviews.filter(r => r.status === 'PENDING').length;
    const approved = this.reviews.filter(r => r.status === 'APPROVED').length;
    const rejected = this.reviews.filter(r => r.status === 'REJECTED').length;
    
    this.stats = {
      ...this.stats,
      totalCount: total,
      pendingCount: pending,
      approvedCount: approved,
      rejectedCount: rejected
    };
  }

  // Get reviews by status
  async getReviewsByStatus(status, page = 1, limit = 20) {
    return this.getPuzzleReviews({
      status,
      page,
      limit,
    });
  }

  // Get pending reviews
  async getPendingReviews(page = 1, limit = 20) {
    return this.getReviewsByStatus('PENDING', page, limit);
  }

  // Get approved reviews
  async getApprovedReviews(page = 1, limit = 20) {
    return this.getReviewsByStatus('APPROVED', page, limit);
  }

  // Get rejected reviews
  async getRejectedReviews(page = 1, limit = 20) {
    return this.getReviewsByStatus('REJECTED', page, limit);
  }
}

export default new PuzzleReviewService(); 