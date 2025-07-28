import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

class PuzzleReviewService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Get all puzzle reviews with filtering and pagination
  async getPuzzleReviews(filters = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });

    const response = await this.api.get(`/puzzle-reviews?${params.toString()}`);
    return response.data;
  }

  // Get a specific review by ID
  async getReviewById(reviewId) {
    const response = await this.api.get(`/puzzle-reviews/${reviewId}`);
    return response.data;
  }

  // Update review status (approve/reject)
  async updateReviewStatus(reviewId, status, moderationReason = '') {
    const response = await this.api.put(`/puzzle-reviews/${reviewId}`, {
      status,
      moderationReason,
      moderatedAt: new Date().toISOString(),
    });
    return response.data;
  }

  // Get review statistics
  async getReviewStats() {
    const response = await this.api.get('/puzzle-reviews/stats/overview');
    return response.data;
  }

  // Get puzzle review summary
  async getPuzzleReviewSummary(puzzleId) {
    const response = await this.api.get(`/puzzle-reviews/puzzle/${puzzleId}/summary`);
    return response.data;
  }

  // Report a review
  async reportReview(reviewId, reason) {
    const response = await this.api.post(`/puzzle-reviews/${reviewId}/report`, {
      reason,
    });
    return response.data;
  }

  // Bulk update review statuses
  async bulkUpdateReviewStatuses(reviewIds, status, moderationReason = '') {
    const response = await this.api.post('/puzzle-reviews/bulk-update', {
      reviewIds,
      status,
      moderationReason,
      moderatedAt: new Date().toISOString(),
    });
    return response.data;
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