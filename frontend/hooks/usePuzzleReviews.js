import { useState, useEffect, useCallback } from 'react';
import puzzleReviewService from '../services/puzzleReviewService';

export const usePuzzleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: 'PENDING',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  // Fetch reviews with current filters and pagination
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await puzzleReviewService.getPuzzleReviews({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      if (response.success) {
        setReviews(response.data.reviews);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: response.data.totalPages,
        }));
      } else {
        setError(response.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching reviews');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Update filters and reset to first page
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Update pagination
  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  // Approve a review
  const approveReview = useCallback(async (reviewId, moderationReason = '') => {
    try {
      const response = await puzzleReviewService.updateReviewStatus(
        reviewId,
        'APPROVED',
        moderationReason
      );
      
      if (response.success) {
        // Update the review in the local state
        setReviews(prev => 
          prev.map(review => 
            review.id === reviewId 
              ? { ...review, status: 'APPROVED', moderationInfo: response.data.moderationInfo }
              : review
          )
        );
        return { success: true, message: 'Review approved successfully' };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  // Reject a review
  const rejectReview = useCallback(async (reviewId, moderationReason = '') => {
    try {
      const response = await puzzleReviewService.updateReviewStatus(
        reviewId,
        'REJECTED',
        moderationReason
      );
      
      if (response.success) {
        // Update the review in the local state
        setReviews(prev => 
          prev.map(review => 
            review.id === reviewId 
              ? { ...review, status: 'REJECTED', moderationInfo: response.data.moderationInfo }
              : review
          )
        );
        return { success: true, message: 'Review rejected successfully' };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  // Bulk approve reviews
  const bulkApproveReviews = useCallback(async (reviewIds, moderationReason = '') => {
    try {
      const response = await puzzleReviewService.bulkUpdateReviewStatuses(
        reviewIds,
        'APPROVED',
        moderationReason
      );
      
      if (response.success) {
        // Refresh the reviews list
        await fetchReviews();
        return { success: true, message: `${reviewIds.length} reviews approved successfully` };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchReviews]);

  // Bulk reject reviews
  const bulkRejectReviews = useCallback(async (reviewIds, moderationReason = '') => {
    try {
      const response = await puzzleReviewService.bulkUpdateReviewStatuses(
        reviewIds,
        'REJECTED',
        moderationReason
      );
      
      if (response.success) {
        // Refresh the reviews list
        await fetchReviews();
        return { success: true, message: `${reviewIds.length} reviews rejected successfully` };
      } else {
        return { success: false, message: response.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchReviews]);

  // Get review statistics
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await puzzleReviewService.getReviewStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch reviews on mount and when filters/pagination change
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    // State
    reviews,
    loading,
    error,
    pagination,
    filters,
    stats,
    statsLoading,
    
    // Actions
    fetchReviews,
    updateFilters,
    updatePagination,
    approveReview,
    rejectReview,
    bulkApproveReviews,
    bulkRejectReviews,
    fetchStats,
  };
}; 