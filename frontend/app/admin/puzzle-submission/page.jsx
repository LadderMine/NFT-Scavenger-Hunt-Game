import React, { useState } from "react";

const difficulties = ["Easy", "Medium", "Hard", "Expert"];

export default function AdminPuzzleSubmission() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    answer: "",
    difficulty: difficulties[0],
    nftMetadata: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit form to backend
    alert("Puzzle submitted!");
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent opacity-20 pointer-events-none" />
      <div className="backdrop-blur-lg bg-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/20 max-w-xl w-full text-center z-10">
        <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Submit New Puzzle
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block font-semibold mb-1 text-white">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-white/20 bg-transparent text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-white">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-white/20 bg-transparent text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-white">
              Answer
            </label>
            <input
              type="text"
              name="answer"
              value={form.answer}
              onChange={handleChange}
              className="w-full border border-white/20 bg-transparent text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-white">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full border border-white/20 bg-transparent text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {difficulties.map((level) => (
                <option
                  key={level}
                  value={level}
                  className="bg-black text-white"
                >
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-white">
              NFT Metadata
            </label>
            <textarea
              name="nftMetadata"
              value={form.nftMetadata}
              onChange={handleChange}
              className="w-full border border-white/20 bg-transparent text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Paste NFT metadata JSON here"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transform transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            Submit Puzzle
          </button>
        </form>
      </div>
    </main>
  );
}
