"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-lg">
            Last Updated: February 21, 2025
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl text-white font-semibold mb-4">Contents</h2>
            <nav className="space-y-2 text-gray-300">
              <a
                href="#introduction"
                className="block hover:text-purple-400 transition-colors"
              >
                1. Introduction
              </a>
              <a
                href="#information-collection"
                className="block hover:text-purple-400 transition-colors"
              >
                2. Information We Collect
              </a>
              <a
                href="#use-of-information"
                className="block hover:text-purple-400 transition-colors"
              >
                3. How We Use Your Information
              </a>
              <a
                href="#data-sharing"
                className="block hover:text-purple-400 transition-colors"
              >
                4. Data Sharing and Disclosure
              </a>
              <a
                href="#data-security"
                className="block hover:text-purple-400 transition-colors"
              >
                5. Data Security
              </a>
              <a
                href="#user-rights"
                className="block hover:text-purple-400 transition-colors"
              >
                6. Your Rights and Choices
              </a>
              <a
                href="#cookies"
                className="block hover:text-purple-400 transition-colors"
              >
                7. Cookies and Tracking
              </a>
              <a
                href="#changes"
                className="block hover:text-purple-400 transition-colors"
              >
                8. Changes to This Policy
              </a>
              <a
                href="#contact"
                className="block hover:text-purple-400 transition-colors"
              >
                9. Contact Us
              </a>
            </nav>
          </CardContent>
        </Card>

        {/* fourth issue continuation */}
        {/* privacy card */}


        {/* Policy Content */}
        

        {/* Scroll to Top Button */}
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-purple-500 hover:bg-purple-600 rounded-full p-3"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
