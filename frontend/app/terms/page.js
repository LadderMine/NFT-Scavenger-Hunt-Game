"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TermsAndConditions() {
  const [expandAll, setExpandAll] = useState(false);

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  const lastUpdated = "February 26, 2025";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background blur - same as homepage */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-start">
        {/* Header navigation */}
        <div className="w-full backdrop-blur-md bg-black/50 border-b border-white/10 p-4">
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
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-8 flex-grow">
          {/* Glass card container */}
          <div className="backdrop-blur-lg bg-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20 max-w-4xl mx-auto">
            {/* Grid effect - same as homepage */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent opacity-20 rounded-2xl"
              style={{
                backgroundSize: "4px 4px",
                backgroundImage:
                  "linear-gradient(to right, rgb(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(139, 92, 246, 0.1) 1px, transparent 1px)",
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FileText size={24} className="text-purple-400 mr-3" />
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Terms &amp; Conditions
                  </h1>
                </div>
                <div className="text-sm text-gray-400">
                  Last Updated: {lastUpdated}
                </div>
              </div>

              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-gray-300">
                  Please read these Terms and Conditions carefully before
                  participating in the NFT Scavenger Hunt game. By accessing or
                  using our platform, you agree to be bound by these terms.
                </p>
              </div>

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

              <Accordion
                type="multiple"
                className="space-y-4"
                defaultValue={
                  expandAll
                    ? [
                        "item-1",
                        "item-2",
                        "item-3",
                        "item-4",
                        "item-5",
                        "item-6",
                        "item-7",
                        "item-8",
                        "item-9",
                        "item-10",
                      ]
                    : []
                }
              >
                <AccordionItem
                  value="item-1"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    1. Acceptance of Terms
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      By accessing or using the NFT Scavenger Hunt game,
                      website, and services (collectively, the "Services"), you
                      agree to be bound by these Terms and Conditions. If you do
                      not agree to these terms, please do not use our Services.
                    </p>
                    <p>
                      We reserve the right to update or modify these Terms and
                      Conditions at any time without prior notice. Your
                      continued use of the Services following any changes
                      constitutes your acceptance of such changes.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    2. Eligibility
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      You must be at least 18 years old or have reached the age
                      of majority in your jurisdiction, whichever is greater, to
                      use our Services. By using our Services, you represent and
                      warrant that you meet these eligibility requirements.
                    </p>
                    <p>
                      The Services may not be available in all regions or
                      jurisdictions. It is your responsibility to ensure that
                      your use of the Services complies with all applicable laws
                      and regulations in your jurisdiction.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-3"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    3. NFTs and Digital Assets
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      Non-Fungible Tokens ("NFTs") earned through our Services
                      are digital assets stored on the StarkNet blockchain that
                      represent ownership or proof of achievement related to our
                      game.
                    </p>
                    <p className="mb-2">You understand and acknowledge that:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>
                        We do not guarantee the value, transferability, or
                        marketability of any NFTs earned through our Services.
                      </li>
                      <li>
                        Ownership of an NFT does not grant you ownership of the
                        underlying intellectual property associated with the
                        NFT.
                      </li>
                      <li>
                        The value of NFTs may fluctuate and there is no
                        guarantee of any return on investment.
                      </li>
                      <li>
                        Transactions on blockchain networks are irreversible and
                        we cannot assist in recovering lost or mistakenly
                        transferred assets.
                      </li>
                    </ul>
                    <p>
                      We reserve the right to modify, suspend, or discontinue
                      the issuance of NFTs at any time without prior notice.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-4"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    4. User Accounts and Wallet Security
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      To participate in the NFT Scavenger Hunt, you must connect
                      a compatible StarkNet wallet to our platform. You are
                      solely responsible for:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>
                        Maintaining the confidentiality of your wallet's private
                        keys and seed phrases.
                      </li>
                      <li>
                        All activities that occur in connection with your
                        wallet.
                      </li>
                      <li>
                        Implementing appropriate security measures to protect
                        your digital assets.
                      </li>
                      <li>
                        Any losses resulting from unauthorized access to your
                        wallet or account.
                      </li>
                    </ul>
                    <p>
                      We will never ask for your private keys or seed phrases.
                      Be vigilant about phishing attempts and unauthorized
                      third-party websites claiming to be affiliated with our
                      Services.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-5"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    5. Game Rules and Fair Play
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      Users of our Services are expected to engage in fair play.
                      The following behaviors are strictly prohibited:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>
                        Using automated scripts, bots, or third-party software
                        to solve puzzles or gain unfair advantages.
                      </li>
                      <li>
                        Exploiting bugs or technical vulnerabilities in our
                        Services.
                      </li>
                      <li>
                        Engaging in collusion, account sharing, or other
                        deceptive practices.
                      </li>
                      <li>
                        Selling, buying, or trading solutions to puzzles or
                        challenges.
                      </li>
                      <li>
                        Attempting to interfere with other users' ability to
                        participate in the game.
                      </li>
                    </ul>
                    <p className="mb-2">
                      We reserve the right to disqualify users, revoke NFT
                      rewards, and restrict access to our Services for users who
                      violate these fair play rules. Our decision regarding any
                      disputes is final.
                    </p>
                    <p>
                      We may modify game rules, puzzle difficulty, or reward
                      structures at any time to maintain game balance and user
                      experience.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-6"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    6. Intellectual Property
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      All content included in our Services, including but not
                      limited to text, graphics, logos, icons, images, audio
                      clips, digital downloads, data compilations, software, and
                      code, is the property of NFT Scavenger Hunt or its content
                      suppliers and is protected by international copyright
                      laws.
                    </p>
                    <p className="mb-2">
                      Ownership of an NFT earned through our Services grants
                      you:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>
                        A limited, non-exclusive, non-transferable, royalty-free
                        license to display the digital art associated with your
                        NFT for personal, non-commercial use.
                      </li>
                      <li>
                        The right to transfer the NFT to another wallet address
                        or sell it on compatible marketplaces.
                      </li>
                    </ul>
                    <p className="mb-2">
                      Ownership of an NFT does not grant you:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>
                        Ownership of the underlying intellectual property.
                      </li>
                      <li>
                        The right to create derivative works based on the NFT
                        content.
                      </li>
                      <li>
                        The right to use the NFT content for commercial purposes
                        without explicit permission.
                      </li>
                      <li>
                        Any rights to the puzzles, challenges, or other content
                        of the NFT Scavenger Hunt game.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-7"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    7. User-Generated Content
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      Our Services may allow users to create, upload, or share
                      content, including but not limited to user profiles,
                      comments, and solutions (collectively "User Content"). By
                      submitting User Content, you grant us a worldwide,
                      non-exclusive, royalty-free, transferable, and
                      sublicensable license to use, copy, modify, adapt,
                      publish, translate, and display such User Content in
                      connection with providing and promoting our Services.
                    </p>
                    <p className="mb-2">You represent and warrant that:</p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>
                        You own or have obtained all necessary rights and
                        permissions to submit the User Content.
                      </li>
                      <li>
                        The User Content does not infringe upon any third
                        party's intellectual property rights, privacy rights, or
                        other legal rights.
                      </li>
                      <li>
                        The User Content does not contain any defamatory,
                        obscene, offensive, or illegal material.
                      </li>
                    </ul>
                    <p>
                      We reserve the right to remove or refuse to display any
                      User Content that we determine, in our sole discretion,
                      violates these terms or may be offensive, illegal, or
                      violate the rights of any third party.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-8"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    8. Limitation of Liability
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      To the maximum extent permitted by applicable law, we
                      shall not be liable for:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>
                        Any indirect, incidental, special, consequential, or
                        punitive damages, including but not limited to loss of
                        profits, data, or use, arising out of or in connection
                        with your use of our Services.
                      </li>
                      <li>
                        Any damages resulting from security breaches, hacking,
                        theft, or other unauthorized access to your wallet or
                        account.
                      </li>
                      <li>
                        Fluctuations in the value of NFTs or other digital
                        assets.
                      </li>
                      <li>
                        Failure, malfunction, or unavailability of the StarkNet
                        blockchain or related infrastructure.
                      </li>
                      <li>
                        Temporary or permanent interruptions in the Services due
                        to maintenance, updates, or technical issues.
                      </li>
                    </ul>
                    <p className="mb-2">
                      Our total liability to you for any claims arising from
                      these Terms and Conditions shall not exceed the amount you
                      have paid to us, if any, for using our Services during the
                      three (3) months preceding the claim.
                    </p>
                    <p>
                      Some jurisdictions do not allow the exclusion or
                      limitation of certain damages, so some of the above
                      limitations may not apply to you.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-9"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    9. Dispute Resolution
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      Any disputes arising out of or relating to these Terms and
                      Conditions or your use of our Services shall be resolved
                      through binding arbitration in accordance with the rules
                      of the American Arbitration Association. The arbitration
                      shall be conducted in [Your City, State/Country], and the
                      language of the arbitration shall be English.
                    </p>
                    <p className="mb-2">
                      Before initiating arbitration, you agree to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-2">
                      <li>
                        Notify us in writing of your claim and attempt to
                        resolve the dispute informally.
                      </li>
                      <li>
                        Allow at least 30 days from the date of notification for
                        resolution.
                      </li>
                    </ul>
                    <p className="mb-2">
                      You may opt out of this arbitration provision by sending
                      written notice to [Your Contact Email] within 30 days of
                      your first use of our Services.
                    </p>
                    <p>
                      Nothing in this section shall prevent either party from
                      seeking injunctive or other equitable relief from the
                      courts for matters related to intellectual property
                      rights, data security, or unauthorized access.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-10"
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white">
                    10. Miscellaneous Provisions
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 bg-black/30 text-gray-300">
                    <p className="mb-2">
                      <strong>Governing Law:</strong> These Terms and Conditions
                      shall be governed by and construed in accordance with the
                      laws of [Your State/Country], without regard to its
                      conflict of law principles.
                    </p>
                    <p className="mb-2">
                      <strong>Severability:</strong> If any provision of these
                      Terms and Conditions is found to be unenforceable or
                      invalid, that provision shall be limited or eliminated to
                      the minimum extent necessary so that these Terms and
                      Conditions shall otherwise remain in full force and
                      effect.
                    </p>
                    <p className="mb-2">
                      <strong>Waiver:</strong> Our failure to enforce any right
                      or provision of these Terms and Conditions shall not be
                      considered a waiver of such right or provision. The waiver
                      of any such right or provision will be effective only if
                      in writing and signed by our authorized representative.
                    </p>
                    <p className="mb-2">
                      <strong>Assignment:</strong> You may not assign or
                      transfer these Terms and Conditions, or any rights or
                      obligations hereunder, without our prior written consent.
                      We may assign or transfer these Terms and Conditions, in
                      whole or in part, without restriction.
                    </p>
                    <p>
                      <strong>Entire Agreement:</strong> These Terms and
                      Conditions, together with our Privacy Policy, constitute
                      the entire agreement between you and us regarding your use
                      of our Services and supersede all prior or contemporaneous
                      communications and proposals, whether electronic, oral, or
                      written.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-8 p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                <h3 className="font-bold text-white mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-300 mb-2">
                  If you have any questions or concerns about these Terms and
                  Conditions, please contact us at:
                </p>
                <p className="text-purple-300">support@nftscavengerhunt.com</p>
              </div>

              <div className="mt-8 flex justify-center">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full backdrop-blur-md bg-black/50 border-t border-white/10 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-400 text-sm">
            <p>&copy; 2025 NFT Scavenger Hunt. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link
                href="/privacy"
                className="text-purple-400 hover:text-purple-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-purple-400 hover:text-purple-300"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
