import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail } from "lucide-react";
import Link from "next/link";

const FAQPage = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      questions: [
        {
          q: "What is NFT Scavenger Hunt?",
          a: "NFT Scavenger Hunt is an interactive game that combines educational puzzles with blockchain technology. Players solve riddles and challenges to earn unique NFT rewards while learning about the StarkNet ecosystem.",
        },
        {
          q: "How do I start playing?",
          a: "To begin, connect your wallet using the 'Connect Wallet' button on the homepage. Once connected, you can access the first puzzle. Each completed puzzle unlocks the next challenge in the sequence.",
        },
        {
          q: "Do I need any prior blockchain knowledge?",
          a: "No prior knowledge is required! Our puzzles are designed to teach you about blockchain technology as you play. We provide helpful resources and hints along the way.",
        },
      ],
    },
    {
      title: "Gameplay & Puzzles",
      questions: [
        {
          q: "How do the puzzles work?",
          a: "Each puzzle presents a unique challenge related to blockchain concepts. They may include riddles, code challenges, or interactive problems. Submit your answer to proceed to the next level.",
        },
        {
          q: "What happens if I get stuck?",
          a: "Don't worry! Each puzzle includes hint tokens that can be used to get clues. Our community Discord channel is also available for discussing puzzles with other players.",
        },
        {
          q: "Can I play at my own pace?",
          a: "Yes! Your progress is saved automatically, and you can return to continue your journey at any time. There's no time limit on completing the puzzles.",
        },
      ],
    },
    {
      title: "NFT Rewards",
      questions: [
        {
          q: "What kind of NFTs can I earn?",
          a: "Each completed puzzle rewards you with a unique NFT that represents your achievement. These NFTs are exclusive to the game and vary in rarity based on the difficulty of the puzzle.",
        },
        {
          q: "Where can I view my earned NFTs?",
          a: "Your earned NFTs appear in your profile gallery and can be viewed in any StarkNet-compatible wallet. Each NFT includes metadata about the puzzle you solved.",
        },
        {
          q: "Are the NFTs tradeable?",
          a: "Yes! All earned NFTs are fully tradeable on supported StarkNet marketplaces. Each NFT is a unique testament to your problem-solving abilities.",
        },
      ],
    },
    {
      title: "Technical Questions",
      questions: [
        {
          q: "Which wallets are supported?",
          a: "We support all major StarkNet-compatible wallets including ArgentX, Braavos, and others. Make sure your wallet is configured for StarkNet before playing.",
        },
        {
          q: "What if I encounter technical issues?",
          a: "First, ensure your wallet is properly connected and you have sufficient ETH for transaction fees. If issues persist, visit our support page or contact our technical support team.",
        },
        {
          q: "Are my progress and NFTs secure?",
          a: "Yes! All game progress and NFTs are secured on the StarkNet blockchain. Your achievements and rewards are permanently recorded and cannot be lost.",
        },
      ],
    },
  ];

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 text-lg">
            Find answers to common questions about NFT Scavenger Hunt
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, index) => (
            <Card
              key={index}
              className="backdrop-blur-lg bg-white/10 border-white/20"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-white">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="text-white">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`item-${index}-${faqIndex}`}
                    >
                      <AccordionTrigger className="text-left hover:text-purple-400">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Need Help Section */}
        
      </div>
    </main>
  );
};

export default FAQPage;
