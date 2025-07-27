export default function BlogCard({ post }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md space-y-2">
      <h2 className="text-xl font-semibold text-emerald-600">{post.title}</h2>
      <p className="text-sm text-gray-500">
        {new Date(post.date).toDateString()}
      </p>
      <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
    </div>
  );
}
