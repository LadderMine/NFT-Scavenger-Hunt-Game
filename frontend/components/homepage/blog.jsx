'use client';
import { useState } from 'react';
import BlogCard from './components/BlogCard';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';

const allPosts = [
  {
    id: 1,
    title: 'Introducing OnlyDust Learn',
    date: '2025-07-10',
    summary: 'We just launched our new educational platform for web3 devs.',
  },
  {
    id: 2,
    title: 'Protocol Update: Gas Cost Reduction',
    date: '2025-07-05',
    summary: 'Our latest upgrade improves efficiency and lowers costs.',
  },
  {
    id: 3,
    title: 'New Projects Added to Bounties',
    date: '2025-06-28',
    summary: 'Explore new open-source projects added to the ecosystem.',
  },
  {
    id: 4,
    title: 'Web3 Developer Grants Now Live',
    date: '2025-06-22',
    summary: 'We’ve opened grant applications for blockchain devs!',
  },
  {
    id: 5,
    title: 'Event Recap: ETHGlobal Paris',
    date: '2025-06-15',
    summary: 'Highlights from our community booth and workshop sessions.',
  },
  {
    id: 6,
    title: 'How to Contribute to Web3 Projects',
    date: '2025-06-01',
    summary: 'A guide to getting started with meaningful contributions.',
  },
];

const POSTS_PER_PAGE = 5;

export default function BlogPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filteredPosts = allPosts.filter(
    post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.summary.toLowerCase().includes(query.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const visiblePosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">
        Platform Updates & Blogs
      </h1>

      <SearchBar value={query} onChange={e => setQuery(e.target.value)} />

      <div className="mt-6 space-y-6">
        {visiblePosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
