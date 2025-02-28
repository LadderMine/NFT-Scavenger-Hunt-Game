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

        {/* Policy Content */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardContent className="p-6 space-y-8 text-gray-300">
            <section id="introduction">
              <h2 className="text-2xl text-white font-semibold mb-4">
                1. Introduction
              </h2>
              <p>
                Welcome to NFT Scavenger Hunt. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when
                you use our game and related services. Please read this privacy
                policy carefully. If you do not agree with the terms of this
                privacy policy, please do not access the application.
              </p>
            </section>

            <section id="information-collection">
              <h2 className="text-2xl text-white font-semibold mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <h3 className="text-xl text-white">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Wallet addresses</li>
                  <li>Email address (if provided)</li>
                  <li>Username and profile information</li>
                  <li>Game progress and achievement data</li>
                </ul>

                <h3 className="text-xl text-white">Technical Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information</li>
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                </ul>
              </div>
            </section>

            <section id="use-of-information">
              <h2 className="text-2xl text-white font-semibold mb-4">
                3. How We Use Your Information
              </h2>
              <p>We use the collected information for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Providing and maintaining the game service</li>
                <li>Processing NFT rewards and transactions</li>
                <li>Verifying puzzle completion and achievements</li>
                <li>Communicating with you about updates and changes</li>
                <li>Improving game features and user experience</li>
                <li>Preventing fraud and ensuring security</li>
              </ul>
            </section>

            <section id="data-sharing">
              <h2 className="text-2xl text-white font-semibold mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p>
                We share your information with third parties only in the ways
                described in this privacy policy, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>StarkNet blockchain for NFT transactions</li>
                <li>Service providers who assist in game operations</li>
                <li>Legal requirements and law enforcement</li>
                <li>Protection of rights and safety</li>
              </ul>
            </section>

            <section id="data-security">
              <h2 className="text-2xl text-white font-semibold mb-4">
                5. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational security
                measures to protect your information. However, please note that
                no method of transmission over the internet or electronic
                storage is 100% secure.
              </p>
            </section>

            <section id="user-rights">
              <h2 className="text-2xl text-white font-semibold mb-4">
                6. Your Rights and Choices
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section id="cookies">
              <h2 className="text-2xl text-white font-semibold mb-4">
                7. Cookies and Tracking
              </h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our game and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            <section id="changes">
              <h2 className="text-2xl text-white font-semibold mb-4">
                8. Changes to This Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &#39;Last Updated&#39; date.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl text-white font-semibold mb-4">
                9. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Contact Page
                </Link>
              </div>
            </section>
          </CardContent>
        </Card>
        

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
