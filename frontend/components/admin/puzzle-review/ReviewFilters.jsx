import { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

const ReviewFilters = ({ filters, onFiltersChange, disabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'PENDING',
      rating: '',
      minRating: '',
      maxRating: '',
      reviewType: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'status' && value === 'PENDING') return false;
    if (key === 'sortBy' && value === 'createdAt') return false;
    if (key === 'sortOrder' && value === 'DESC') return false;
    return value !== '' && value !== null && value !== undefined;
  });

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                disabled={disabled}
              >
                Clear Filters
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={disabled}
            >
              {isExpanded ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={filters.status || 'PENDING'}
              onValueChange={(value) => handleFilterChange('status', value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <Select
              value={filters.rating || ''}
              onValueChange={(value) => handleFilterChange('rating', value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="All ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All ratings</SelectItem>
                <SelectItem value="5">5 stars</SelectItem>
                <SelectItem value="4">4 stars</SelectItem>
                <SelectItem value="3">3 stars</SelectItem>
                <SelectItem value="2">2 stars</SelectItem>
                <SelectItem value="1">1 star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <Select
              value={filters.sortBy || 'createdAt'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="helpfulCount">Helpful Votes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Min Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <Select
                  value={filters.minRating || ''}
                  onValueChange={(value) => handleFilterChange('minRating', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+ stars</SelectItem>
                    <SelectItem value="2">2+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="5">5 stars only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Rating
                </label>
                <Select
                  value={filters.maxRating || ''}
                  onValueChange={(value) => handleFilterChange('maxRating', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1 star max</SelectItem>
                    <SelectItem value="2">2 stars max</SelectItem>
                    <SelectItem value="3">3 stars max</SelectItem>
                    <SelectItem value="4">4 stars max</SelectItem>
                    <SelectItem value="5">5 stars max</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Review Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Type
                </label>
                <Select
                  value={filters.reviewType || ''}
                  onValueChange={(value) => handleFilterChange('reviewType', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="RATING_ONLY">Rating only</SelectItem>
                    <SelectItem value="TEXT_REVIEW">Text review</SelectItem>
                    <SelectItem value="DETAILED">Detailed review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <Select
                  value={filters.sortOrder || 'DESC'}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DESC">Newest first</SelectItem>
                    <SelectItem value="ASC">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewFilters; 