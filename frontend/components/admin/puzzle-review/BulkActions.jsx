import { useState } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Textarea } from '../../ui/textarea';

const BulkActions = ({ selectedCount, onApprove, onReject, loading }) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleApprove = async () => {
    await onApprove(reason);
    setReason('');
    setIsApproveDialogOpen(false);
  };

  const handleReject = async () => {
    await onReject(reason);
    setReason('');
    setIsRejectDialogOpen(false);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              {selectedCount} review{selectedCount !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-blue-700">
              Choose an action to perform on all selected reviews
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Bulk Approve */}
          <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve {selectedCount} Review{selectedCount !== 1 ? 's' : ''}</DialogTitle>
                <DialogDescription>
                  Are you sure you want to approve all selected reviews? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moderation Reason (Optional)
                  </label>
                  <Textarea
                    placeholder="Enter a reason for approval..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsApproveDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Approving...' : `Approve ${selectedCount} Review${selectedCount !== 1 ? 's' : ''}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Reject */}
          <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Reject All
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject {selectedCount} Review{selectedCount !== 1 ? 's' : ''}</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reject all selected reviews? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (Required)
                  </label>
                  <Textarea
                    placeholder="Enter a reason for rejection..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={loading || !reason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Rejecting...' : `Reject ${selectedCount} Review${selectedCount !== 1 ? 's' : ''}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BulkActions; 