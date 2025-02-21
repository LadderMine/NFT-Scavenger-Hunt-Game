import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Star,
  Users,
  Twitter,
  Linkedin,
  Facebook,
  ArrowLeft,
  ArrowRight,
  Quote,
} from "lucide-react";

const SocialButton = ({ platform, icon: Icon, href, members }) => (
  <Button
    asChild
    variant="outline"
    className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
  >
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2 p-4"
    >
      <Icon className="w-6 h-6 text-white" />
      <span className="text-sm font-medium text-white">{platform}</span>
      <span className="text-xs text-gray-400">{members} members</span>
    </a>
  </Button>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="relative group">
    {/* Gradient border effect */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg opacity-50 blur group-hover:opacity-75 transition duration-300" />

    <div className="relative p-6 bg-black/40 backdrop-blur-sm rounded-lg">
      {/* Quote icon */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-purple-500/20" />

      {/* Content */}
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-11 h-11 rounded-full border-2 border-black"
            />
          </div>
        </div>

        {/* Text content */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-white">{testimonial.name}</h3>
            <span className="text-sm text-gray-400">@{testimonial.handle}</span>
          </div>
          <p className="text-gray-300 mb-3">{testimonial.content}</p>

          {/* Platform indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {testimonial.platform === "Twitter" ? (
              <Twitter className="w-4 h-4" />
            ) : (
              <Facebook className="w-4 h-4" />
            )}
            <span>{testimonial.platform}</span>
            <span>•</span>
            <span>{testimonial.date}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "Alex Thompson",
      handle: "cryptoalex",
      avatar: "/nftTestimonial.jpg",
      content:
        "Absolutely loving the NFT Scavenger Hunt! The puzzles are challenging but rewarding, and the NFT rewards are genuinely unique. Best web3 gaming experience I've had! 🎮✨",
      platform: "Twitter",
      date: "2 days ago",
    },
    {
      name: "Sarah Chen",
      handle: "blockchain_sarah",
      avatar: "/nftTestimonial.jpg",
      content:
        "Finally, a game that makes learning about blockchain fun! The community is super helpful, and the daily challenges keep me coming back. Already earned 3 rare NFTs! 🏆",
      platform: "Facebook",
      date: "1 week ago",
    },
    {
      name: "Mike Rivers",
      handle: "stark_hunter",
      avatar: "/nftTestimonial.jpg",
      content:
        "The attention to detail in each puzzle is amazing. Love how it combines education with gameplay. The leaderboard competition is intense! Can't wait for the next update. 🚀",
      platform: "Twitter",
      date: "3 days ago",
    },
    {
      name: "Emma Wright",
      handle: "nft_emma",
      avatar: "/nftTestimonial.jpg",
      content:
        "Been here since beta and the growth is incredible. The new StarkNet challenges are mind-bending in the best way possible. To be honest gys, this is how web3 gaming should be! 💫",
      platform: "Facebook",
      date: "5 days ago",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.ceil(testimonials.length / 2) - 1 : prev - 1
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-24 px-6">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          Community Buzz
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Join thousands of players already exploring the StarkNet universe
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm text-center">
          <div className="text-2xl font-bold text-white mb-1">25K+</div>
          <div className="text-sm text-gray-400">Active Players</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm text-center">
          <div className="text-2xl font-bold text-white mb-1">150K+</div>
          <div className="text-sm text-gray-400">Facebook Members</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm text-center">
          <div className="text-2xl font-bold text-white mb-1">80K+</div>
          <div className="text-sm text-gray-400">Twitter Followers</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg backdrop-blur-sm text-center">
          <div className="text-2xl font-bold text-white mb-1">45K+</div>
          <div className="text-sm text-gray-400">Linkedin Members</div>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="relative mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials
            .slice(currentSlide * 2, currentSlide * 2 + 2)
            .map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center mt-6 gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-center text-white mb-6">
          Join Our Community
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <SocialButton
            platform="Facebook"
            icon={Facebook}
            href="https://Facebook.gg/nfthunt"
            members="150K+"
          />
          <SocialButton
            platform="Twitter"
            icon={Twitter}
            href="https://twitter.com/nfthunt"
            members="80K+"
          />
          <SocialButton
            platform="Linkedin"
            icon={Linkedin}
            href="https://t.me/nfthunt"
            members="45K+"
          />
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
