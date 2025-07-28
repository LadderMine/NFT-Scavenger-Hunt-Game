'use client';

import { Suspense } from 'react';
import PuzzleReviewDashboard from '../../../components/admin/puzzle-review/PuzzleReviewDashboard';
import AdminLayout from '../../../components/admin/AdminLayout';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

export default function AdminPuzzleReviewPage() {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Puzzle Review Management
            </h1>
            <p className="mt-2 text-gray-600">
              Review and moderate puzzle submissions from users
            </p>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <PuzzleReviewDashboard />
          </Suspense>
        </div>
      </div>
    </AdminLayout>
  );
} 