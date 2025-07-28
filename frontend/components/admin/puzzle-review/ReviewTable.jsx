import { useState } from 'react';
import { Check, X, Eye, Star, Calendar, User, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { cn } from '../../../lib/utils';

const ReviewTable = ({
  reviews,
  loading,
  pagination,
  selectedReviews,
  onSelectionChange,
  onSelectAll,
  onApprove,
  onReject,
  onViewDetail,
  onPaginationChange,
  actionLoading,
}) => {
  const [expandedReview, setExpandedReview] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'Pending',
      },
      APPROVED: {
        className: 'bg-green-100 text-green-800 border-green-200',
        text: 'Approved',
      },
      REJECTED: {
        className: 'bg-red-100 text-red-800 border-red-200',
        text: 'Rejected',
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            )}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  const handlePageChange = (newPage) => {
    onPaginationChange({ page: newPage });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Reviews ({pagination.total})
          </h3>
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedReviews.length === reviews.length && reviews.length > 0}
                    onChange={(e) => onSelectAll(e.target.checked)}
                  />
                </TableHead>
                <TableHead>Review</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="text-gray-500">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No reviews found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedReviews.includes(review.id)}
                        onChange={(e) => onSelectionChange(review.id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Puzzle ID: {review.puzzleId}
                            </p>
                            {review.reviewText && (
                              <div className="mt-1">
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {review.reviewText}
                                </p>
                                {review.reviewText.length > 100 && (
                                  <button
                                    onClick={() => setExpandedReview(
                                      expandedReview === review.id ? null : review.id
                                    )}
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                                  >
                                    {expandedReview === review.id ? 'Show less' : 'Show more'}
                                  </button>
                                )}
                                {expandedReview === review.id && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    {review.reviewText}
                                  </p>
                                )}
                              </div>
                            )}
                            {review.tags && review.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {review.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {review.isAnonymous ? 'Anonymous' : review.username || 'Unknown'}
                          </p>
                          {review.userId && (
                            <p className="text-xs text-gray-500">
                              ID: {review.userId.slice(0, 8)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderStars(review.rating)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(review.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewDetail(review)}
                          disabled={actionLoading}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {review.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => onApprove(review.id)}
                              disabled={actionLoading}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => onReject(review.id)}
                              disabled={actionLoading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewTable; 