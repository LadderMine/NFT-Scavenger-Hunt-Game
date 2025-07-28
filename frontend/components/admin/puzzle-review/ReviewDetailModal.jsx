import { useState } from 'react';
import { Star, User, Calendar, Tag, MessageSquare, Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Textarea } from '../../ui/textarea';
import { cn } from '../../../lib/utils';

const ReviewDetailModal = ({ review, open, onClose, onApprove, onReject, loading }) => {
  const [reason, setReason] = useState('');
  const [actionType, setActionType] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-5 w-5',
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            )}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
        {config.text}
      </span>
    );
  };

  const handleAction = async (type) => {
    setActionType(type);
    if (type === 'approve') {
      await onApprove(review.id, reason);
    } else if (type === 'reject') {
      await onReject(review.id, reason);
    }
    setReason('');
    setActionType(null);
    onClose();
  };

  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Review Details</span>
          </DialogTitle>
          <DialogDescription>
            Review information and moderation options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Review Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Puzzle Review
              </h3>
              <p className="text-sm text-gray-500">
                Puzzle ID: {review.puzzleId}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(review.status)}
            </div>
          </div>

          {/* Rating */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Rating</h4>
            {renderStars(review.rating)}
          </div>

          {/* User Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">User Information</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {review.isAnonymous ? 'Anonymous User' : review.username || 'Unknown User'}
                </span>
              </div>
              {review.userId && (
                <div className="text-xs text-gray-500">
                  User ID: {review.userId}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  Submitted: {formatDate(review.createdAt)}
                </span>
              </div>
              {review.updatedAt && review.updatedAt !== review.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    Updated: {formatDate(review.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Review Text */}
          {review.reviewText && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Review Text</h4>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {review.reviewText}
              </p>
            </div>
          )}

          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {review.metadata && Object.keys(review.metadata).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Information</h4>
              <div className="space-y-2 text-sm">
                {review.metadata.difficulty && (
                  <div>
                    <span className="font-medium text-gray-700">Difficulty:</span>{' '}
                    <span className="text-gray-900">{review.metadata.difficulty}</span>
                  </div>
                )}
                {review.metadata.completionTime && (
                  <div>
                    <span className="font-medium text-gray-700">Completion Time:</span>{' '}
                    <span className="text-gray-900">{review.metadata.completionTime} minutes</span>
                  </div>
                )}
                {review.metadata.deviceInfo && (
                  <div>
                    <span className="font-medium text-gray-700">Device:</span>{' '}
                    <span className="text-gray-900">{review.metadata.deviceInfo}</span>
                  </div>
                )}
                {review.metadata.ipAddress && (
                  <div>
                    <span className="font-medium text-gray-700">IP Address:</span>{' '}
                    <span className="text-gray-900">{review.metadata.ipAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Moderation Info */}
          {review.moderationInfo && Object.keys(review.moderationInfo).length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Moderation Information</h4>
              <div className="space-y-2 text-sm">
                {review.moderationInfo.moderatedBy && (
                  <div>
                    <span className="font-medium text-yellow-700">Moderated by:</span>{' '}
                    <span className="text-yellow-800">{review.moderationInfo.moderatedBy}</span>
                  </div>
                )}
                {review.moderationInfo.moderatedAt && (
                  <div>
                    <span className="font-medium text-yellow-700">Moderated at:</span>{' '}
                    <span className="text-yellow-800">{formatDate(review.moderationInfo.moderatedAt)}</span>
                  </div>
                )}
                {review.moderationInfo.moderationReason && (
                  <div>
                    <span className="font-medium text-yellow-700">Reason:</span>{' '}
                    <span className="text-yellow-800">{review.moderationInfo.moderationReason}</span>
                  </div>
                )}
                {review.moderationInfo.flaggedReasons && review.moderationInfo.flaggedReasons.length > 0 && (
                  <div>
                    <span className="font-medium text-yellow-700">Flagged reasons:</span>{' '}
                    <span className="text-yellow-800">{review.moderationInfo.flaggedReasons.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Moderation Actions */}
          {review.status === 'PENDING' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-4">Moderation Actions</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moderation Reason (Optional)
                  </label>
                  <Textarea
                    placeholder="Enter a reason for your decision..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => handleAction('approve')}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {loading && actionType === 'approve' ? 'Approving...' : 'Approve Review'}
                  </Button>
                  <Button
                    onClick={() => handleAction('reject')}
                    disabled={loading}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {loading && actionType === 'reject' ? 'Rejecting...' : 'Reject Review'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetailModal; 