"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  User,
  Clock,
  Heart,
  MessageSquare,
  Bookmark,
  ArrowLeft,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
} from "lucide-react"

export default function BlogPostPage({ params }) {
  const { slug } = params

  // In a real application, you would fetch the blog post data based on the slug
  // For this example, we'll use mock data
  const post = {
    title: "Understanding StarkNet: A Beginner's Guide",
    excerpt:
      "Learn the basics of StarkNet and how it's revolutionizing blockchain scalability through zero-knowledge proofs.",
    content: `
      <p>StarkNet is a permissionless decentralized ZK-Rollup operating as an L2 network over Ethereum. It enables dApps to achieve unlimited scale for their computation, without compromising Ethereum's composability and security.</p>
      
      <h2>What Makes StarkNet Special?</h2>
      
      <p>StarkNet achieves scale by generating STARK proofs off-chain and verifying them on-chain, on Ethereum. This approach allows it to move the computational load away from the Ethereum network while still maintaining security.</p>
      
      <p>Key features of StarkNet include:</p>
      
      <ul>
        <li>High throughput and low gas costs</li>
        <li>Strong security inherited from Ethereum</li>
        <li>Support for general computation</li>
        <li>A growing ecosystem of applications</li>
      </ul>
      
      <h2>How StarkNet Works</h2>
      
      <p>At a high level, StarkNet works by batching multiple transactions together, executing them off-chain, and then generating a cryptographic proof that these transactions were executed correctly. This proof is then verified on Ethereum.</p>
      
      <p>The process can be broken down into these steps:</p>
      
      <ol>
        <li>Users submit transactions to StarkNet</li>
        <li>Transactions are batched together</li>
        <li>A prover executes these transactions and generates a STARK proof</li>
        <li>The proof is submitted to Ethereum</li>
        <li>Ethereum verifies the proof, ensuring the transactions were executed correctly</li>
      </ol>
      
      <h2>Getting Started with StarkNet</h2>
      
      <p>If you're interested in developing on StarkNet, you'll need to understand Cairo, the programming language used to write StarkNet contracts. Cairo is designed specifically for creating provable programs and is optimized for the STARK proving system.</p>
      
      <p>Here's a simple example of a Cairo contract:</p>
      
      <pre><code>
%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.uint256 import Uint256

@storage_var
func balance(account: felt) -> (res: Uint256) {
}

@external
func get_balance{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    account: felt
) -> (res: Uint256) {
    let (res) = balance.read(account);
    return (res,);
}
      </code></pre>
      
      <p>This simple contract stores and retrieves balances for accounts. It's just a starting point, but it illustrates the basic structure of a Cairo contract.</p>
      
      <h2>The Future of StarkNet</h2>
      
      <p>StarkNet is still in active development, with new features and improvements being added regularly. The roadmap includes:</p>
      
      <ul>
        <li>Improved developer tools and documentation</li>
        <li>Enhanced performance and scalability</li>
        <li>Greater decentralization of the network</li>
        <li>Expanded ecosystem of applications</li>
      </ul>
      
      <p>As the Ethereum ecosystem continues to grow, layer 2 solutions like StarkNet will play an increasingly important role in addressing scalability challenges while maintaining security and decentralization.</p>
    `,
    date: "Mar 15, 2023",
    author: "Alex Johnson",
    authorImage: "/placeholder.svg?height=100&width=100",
    readTime: "5 min read",
    category: "Education",
    image: "/placeholder.svg?height=500&width=1000",
    tags: ["StarkNet", "Layer 2", "Scaling", "ZK-Rollups", "Ethereum"],
    relatedPosts: [
      {
        id: 2,
        title: "Top 10 NFT Scavenger Hunt Strategies",
        excerpt:
          "Discover the best strategies to excel in NFT scavenger hunts and maximize your chances of finding rare digital treasures.",
        slug: "top-10-nft-scavenger-hunt-strategies",
      },
      {
        id: 4,
        title: "Cryptographic Puzzles: History and Modern Applications",
        excerpt:
          "Explore the fascinating history of cryptographic puzzles and how they're being used in modern blockchain applications.",
        slug: "cryptographic-puzzles-history-modern-applications",
      },
      {
        id: 7,
        title: "NFTs Beyond Art: Utility in Gaming and Education",
        excerpt:
          "Exploring the practical applications of NFTs beyond digital art, with a focus on gaming and educational use cases.",
        slug: "nfts-beyond-art-utility-gaming-education",
      },
    ],
  }

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
            </Button>
          </Link>
        </div>

        {/* Article header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 border-white/20 text-white">
            {post.category}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {post.title}
          </h1>

          <div className="flex flex-wrap justify-center items-center text-sm text-gray-400 mb-6 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {post.readTime}
            </div>
          </div>

          <div className="flex justify-center space-x-2 mb-8">
            {post.tags.map((tag, index) => (
              <Badge key={index} className="bg-white/10 hover:bg-white/20 text-white">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured image */}
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-auto object-cover" />
        </div>

        {/* Article content */}
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 mb-8">
          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>

        {/* Article actions */}
        <div className="flex flex-wrap justify-between items-center mb-12 gap-4">
          <div className="flex space-x-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Heart className="mr-2 h-4 w-4" /> Like
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <MessageSquare className="mr-2 h-4 w-4" /> Comment
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Bookmark className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Author bio */}
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 mb-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={post.authorImage || "/placeholder.svg"}
              alt={post.author}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">About {post.author}</h3>
              <p className="text-gray-300 mb-4">
                Alex is a blockchain researcher and educator specializing in layer 2 scaling solutions. With over 5
                years of experience in the crypto space, he's passionate about making complex blockchain concepts
                accessible to everyone.
              </p>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View All Articles
              </Button>
            </div>
          </div>
        </div>

        {/* Related articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {post.relatedPosts.map((relatedPost) => (
              <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="block">
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl overflow-hidden h-full transition-all duration-300 hover:transform hover:scale-105">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{relatedPost.title}</h3>
                    <p className="text-gray-300 text-sm">{relatedPost.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Enjoyed this article?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get weekly updates on blockchain technology, NFTs, and our scavenger hunt
            challenges.
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

