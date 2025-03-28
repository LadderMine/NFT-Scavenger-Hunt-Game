"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, Search, Filter, ArrowRight } from "lucide-react"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const blogPosts = [
    {
      id: 1,
      title: "Understanding StarkNet: A Beginner's Guide",
      excerpt:
        "Learn the basics of StarkNet and how it's revolutionizing blockchain scalability through zero-knowledge proofs.",
      date: "Mar 15, 2023",
      author: "Alex Johnson",
      readTime: "5 min read",
      category: "Education",
      image: "/placeholder.svg?height=200&width=350",
      featured: true,
      slug: "understanding-starknet-beginners-guide",
    },
    {
      id: 2,
      title: "Top 10 NFT Scavenger Hunt Strategies",
      excerpt:
        "Discover the best strategies to excel in NFT scavenger hunts and maximize your chances of finding rare digital treasures.",
      date: "Mar 10, 2023",
      author: "Samantha Lee",
      readTime: "8 min read",
      category: "Strategies",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
      slug: "top-10-nft-scavenger-hunt-strategies",
    },
    {
      id: 3,
      title: "The Evolution of Blockchain Gaming",
      excerpt:
        "From CryptoKitties to complex ecosystems: How blockchain gaming has evolved and where it's headed next.",
      date: "Mar 5, 2023",
      author: "Michael Chen",
      readTime: "10 min read",
      category: "Gaming",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
      slug: "evolution-of-blockchain-gaming",
    },
    {
      id: 4,
      title: "Cryptographic Puzzles: History and Modern Applications",
      excerpt:
        "Explore the fascinating history of cryptographic puzzles and how they're being used in modern blockchain applications.",
      date: "Feb 28, 2023",
      author: "Emma Wilson",
      readTime: "7 min read",
      category: "Education",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
      slug: "cryptographic-puzzles-history-modern-applications",
    },
    {
      id: 5,
      title: "Interview: Meet the Winners of Our Last Challenge",
      excerpt:
        "We sat down with the top three winners of our recent StarkNet Challenge to learn about their experience and strategies.",
      date: "Feb 20, 2023",
      author: "David Park",
      readTime: "6 min read",
      category: "Community",
      image: "/placeholder.svg?height=200&width=350",
      featured: true,
      slug: "interview-winners-last-challenge",
    },
    {
      id: 6,
      title: "The Psychology of Puzzle Solving",
      excerpt:
        "Understanding the cognitive processes behind puzzle solving and how to improve your problem-solving skills.",
      date: "Feb 15, 2023",
      author: "Dr. Sarah Miller",
      readTime: "9 min read",
      category: "Education",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
      slug: "psychology-of-puzzle-solving",
    },
    {
      id: 7,
      title: "NFTs Beyond Art: Utility in Gaming and Education",
      excerpt:
        "Exploring the practical applications of NFTs beyond digital art, with a focus on gaming and educational use cases.",
      date: "Feb 10, 2023",
      author: "James Wilson",
      readTime: "7 min read",
      category: "NFTs",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
      slug: "nfts-beyond-art-utility-gaming-education",
    },
    {
      id: 8,
      title: "Building Community Through Blockchain Challenges",
      excerpt:
        "How collaborative puzzle-solving and competitions are creating strong, engaged communities in the blockchain space.",
      date: "Feb 5, 2023",
      author: "Lisa Chen",
      readTime: "5 min read",
      category: "Community",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
      slug: "building-community-through-blockchain-challenges",
    },
  ]

  // Get unique categories
  const categories = ["all", ...new Set(blogPosts.map((post) => post.category.toLowerCase()))]

  // Apply filters
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || post.category.toLowerCase() === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Featured posts
  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Blockchain Insights
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Explore articles, guides, and stories about blockchain technology, NFTs, and our scavenger hunt challenges.
          </p>
        </div>

        {/* Featured posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="block">
                  <Card className="overflow-hidden backdrop-blur-lg border border-purple-500/30 bg-white/10 h-full transition-all duration-300 hover:transform hover:scale-105">
                    <div className="relative">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-0 right-0 m-4">
                        <Badge className="bg-purple-500 text-white">Featured</Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <Badge variant="outline" className="mb-2 border-white/20 text-white">
                        {post.category}
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-3">{post.title}</h3>
                      <p className="text-gray-300 mb-4">{post.excerpt}</p>

                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <div className="flex items-center mr-4">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center mr-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {post.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>

                      <Button className="text-white bg-transparent hover:bg-white/10 p-0 flex items-center">
                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and filters */}
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category} className="bg-gray-800">
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* All blog posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts
            .filter((post) => !post.featured)
            .map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="block">
                <Card className="overflow-hidden backdrop-blur-lg border border-white/20 bg-white/10 h-full transition-all duration-300 hover:transform hover:scale-105">
                  <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-48 object-cover" />

                  <div className="p-6">
                    <Badge variant="outline" className="mb-2 border-white/20 text-white">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{post.excerpt}</p>

                    <div className="flex flex-wrap items-center text-xs text-gray-400 mb-4">
                      <div className="flex items-center mr-3 mb-2">
                        <User className="h-3 w-3 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center mr-3 mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>

                    <Button className="text-white bg-transparent hover:bg-white/10 p-0 flex items-center text-sm">
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
        </div>

        {filteredPosts.filter((post) => !post.featured).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No articles match your search criteria.</p>
            <Button
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest articles, challenges, and blockchain insights. We send a weekly digest of our
            best content.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

