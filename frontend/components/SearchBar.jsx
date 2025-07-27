export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search blog posts..."
      value={value}
      onChange={onChange}
      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
  );
}
