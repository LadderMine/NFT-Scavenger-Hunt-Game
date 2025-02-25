import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-black/20 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold mb-2">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/faq"
                className="text-gray-300 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold mb-2">Community</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://Linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Powered By Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold mb-2">Powered By</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://starknet.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                StarkNet <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                Next.js <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://cairo-lang.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
              >
                Cairo <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} NFT Scavenger Hunt. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
