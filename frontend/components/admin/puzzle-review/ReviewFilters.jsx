import { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

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
            <select
              value={filters.status || 'PENDING'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={filters.rating || ''}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="createdAt">Date Created</option>
              <option value="rating">Rating</option>
              <option value="helpfulCount">Helpful Votes</option>
            </select>
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
                <select
                  value={filters.minRating || ''}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Any</option>
                  <option value="1">1+ stars</option>
                  <option value="2">2+ stars</option>
                  <option value="3">3+ stars</option>
                  <option value="4">4+ stars</option>
                  <option value="5">5 stars only</option>
                </select>
              </div>

              {/* Max Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Rating
                </label>
                <select
                  value={filters.maxRating || ''}
                  onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Any</option>
                  <option value="1">1 star max</option>
                  <option value="2">2 stars max</option>
                  <option value="3">3 stars max</option>
                  <option value="4">4 stars max</option>
                  <option value="5">5 stars max</option>
                </select>
              </div>

              {/* Review Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Type
                </label>
                <select
                  value={filters.reviewType || ''}
                  onChange={(e) => handleFilterChange('reviewType', e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">All types</option>
                  <option value="RATING_ONLY">Rating only</option>
                  <option value="TEXT_REVIEW">Text review</option>
                  <option value="DETAILED">Detailed review</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <select
                  value={filters.sortOrder || 'DESC'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  disabled={disabled}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="DESC">Newest first</option>
                  <option value="ASC">Oldest first</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewFilters; 