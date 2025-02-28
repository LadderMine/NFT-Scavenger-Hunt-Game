"use client";
import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import terms from "@/lib/data";

export default function TermsAndConditions() {
  const lastUpdated = "February 26, 2025";
  const allValues = useMemo(() => terms.map((t) => t.value), []);
  const [openItems, setOpenItems] = useState([]);
  const expandAll = openItems.length === terms.length;

  const toggleExpandAll = useCallback(() => {
    setOpenItems(expandAll ? [] : allValues);
  }, [expandAll, allValues]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background blur */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full backdrop-blur-md bg-black/50 border-b border-white/10 p-4">
          <div className="container mx-auto flex items-center">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-purple-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Game
              </Button>
            </Link>
          </div>
        </header>

        {/* Terms & Conditions Card */}
        <section className="container mx-auto px-4 py-8 flex-grow">
          <div className="relative backdrop-blur-lg bg-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20 max-w-4xl mx-auto">
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent opacity-20 rounded-2xl"
              style={{
                backgroundSize: "4px 4px",
                backgroundImage:
                  "linear-gradient(to right, rgb(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(139, 92, 246, 0.1) 1px, transparent 1px)",
              }}
            />

            <div className="relative">
              {/* Title & Last Updated */}
              <header className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FileText size={24} className="text-purple-400 mr-3" />
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Terms &amp; Conditions
                  </h1>
                </div>
                <span className="text-sm text-gray-400">
                  Last Updated: {lastUpdated}
                </span>
              </header>

              {/* Introductory Text */}
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-gray-300">
                  Please read these Terms and Conditions carefully before
                  participating in the NFT Scavenger Hunt game. By accessing or
                  using our platform, you agree to be bound by these terms.
                </p>
              </div>

              {/* Expand/Collapse All */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Contents</h2>
                <Button
                  variant="ghost"
                  className="text-purple-300 hover:text-white hover:bg-white/10 text-sm"
                  onClick={toggleExpandAll}
                >
                  {expandAll ? (
                    <>
                      <ChevronUp size={16} className="mr-1" /> Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" /> Expand All
                    </>
                  )}
                </Button>
              </div>

              {/* Accordion Component */}
              <Accordion
                type="multiple"
                className="space-y-4"
                value={openItems}
                onValueChange={setOpenItems}
              >
                {terms.map((term) => (
                  <AccordionItem
                    key={term.value}
                    value={term.value}
                    className="border border-white/10 rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                      {term.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                      {term.content.map((text, index) =>
                        Array.isArray(text) ? (
                          <ul
                            key={index}
                            className="list-disc pl-5 space-y-1 mb-2"
                          >
                            {text.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        ) : (
                          <p key={index} className="mb-2">
                            {text}
                          </p>
                        )
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Contact Info */}
              <div className="mt-8 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                <h3 className="font-bold text-white mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-300 mb-2">
                  If you have any questions or concerns, please contact us at:
                </p>
                <p className="text-purple-300">support@nftscavengerhunt.com</p>
              </div>

              {/* Back to Home Button */}
              <div className="mt-8 flex justify-center">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full backdrop-blur-md bg-black/50 border-t border-white/10 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-400 text-sm">
            <p>&copy; 2025 NFT Scavenger Hunt. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
