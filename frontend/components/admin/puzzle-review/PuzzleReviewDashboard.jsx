'use client';

import { useState } from 'react';
import { usePuzzleReviews } from '../../../hooks/usePuzzleReviews';
import ReviewStats from './ReviewStats';
import ReviewFilters from './ReviewFilters';
import ReviewTable from './ReviewTable';
import BulkActions from './BulkActions';
import ReviewDetailModal from './ReviewDetailModal';
import { Alert, AlertDescription } from '../../ui/alert';

const PuzzleReviewDashboard = () => {
  const {
    reviews,
    loading,
    error,
    pagination,
    filters,
    stats,
    statsLoading,
    updateFilters,
    updatePagination,
    approveReview,
    rejectReview,
    bulkApproveReviews,
    bulkRejectReviews,
  } = usePuzzleReviews();

  const [selectedReviews, setSelectedReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Handle review selection
  const handleReviewSelection = (reviewId, isSelected) => {
    if (isSelected) {
      setSelectedReviews(prev => [...prev, reviewId]);
    } else {
      setSelectedReviews(prev => prev.filter(id => id !== reviewId));
    }
  };

  // Handle select all
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedReviews(reviews.map(review => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  // Handle individual review actions
  const handleApproveReview = async (reviewId, reason = '') => {
    setActionLoading(true);
    try {
      const result = await approveReview(reviewId, reason);
      setNotification({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to approve review',
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRejectReview = async (reviewId, reason = '') => {
    setActionLoading(true);
    try {
      const result = await rejectReview(reviewId, reason);
      setNotification({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to reject review',
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Handle bulk actions
  const handleBulkApprove = async (reason = '') => {
    if (selectedReviews.length === 0) return;
    
    setActionLoading(true);
    try {
      const result = await bulkApproveReviews(selectedReviews, reason);
      setNotification({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
      setSelectedReviews([]);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to approve reviews',
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleBulkReject = async (reason = '') => {
    if (selectedReviews.length === 0) return;
    
    setActionLoading(true);
    try {
      const result = await bulkRejectReviews(selectedReviews, reason);
      setNotification({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
      setSelectedReviews([]);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to reject reviews',
      });
    } finally {
      setActionLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Handle review detail view
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <Alert className={notification.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <AlertDescription className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Section */}
      <ReviewStats stats={stats} loading={statsLoading} />

      {/* Filters Section */}
      <ReviewFilters 
        filters={filters}
        onFiltersChange={updateFilters}
        disabled={loading}
      />

      {/* Bulk Actions */}
      {selectedReviews.length > 0 && (
        <BulkActions
          selectedCount={selectedReviews.length}
          onApprove={handleBulkApprove}
          onReject={handleBulkReject}
          loading={actionLoading}
        />
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Reviews Table */}
      <ReviewTable
        reviews={reviews}
        loading={loading}
        pagination={pagination}
        selectedReviews={selectedReviews}
        onSelectionChange={handleReviewSelection}
        onSelectAll={handleSelectAll}
        onApprove={handleApproveReview}
        onReject={handleRejectReview}
        onViewDetail={handleViewReview}
        onPaginationChange={updatePagination}
        actionLoading={actionLoading}
      />

      {/* Review Detail Modal */}
      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReview(null);
          }}
          onApprove={handleApproveReview}
          onReject={handleRejectReview}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default PuzzleReviewDashboard; 