"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ConnectedWallets = () => {
  // Sample wallet data - in a real implementation, this would come from your state management
  const [wallets, setWallets] = useState([
    {
      id: "wallet1",
      name: "Primary Wallet",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      network: "StarkNet Mainnet",
      status: "connected",
      balance: 0.42,
      nftsCollected: 3,
    },
    {
      id: "wallet2",
      name: "Secondary Wallet",
      address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      network: "StarkNet Testnet",
      status: "connected",
      balance: 1.25,
      nftsCollected: 1,
    },
  ]);

  const [connecting, setConnecting] = useState(false);

  // Function to disconnect a wallet (in a real app, this would include blockchain interactions)
  const disconnectWallet = (id) => {
    setWallets(wallets.filter((wallet) => wallet.id !== id));
  };

  // Function to simulate connecting a new wallet
  const connectNewWallet = () => {
    setConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setConnecting(false);
      // Add new mock wallet
      setWallets([
        ...wallets,
        {
          id: `wallet${wallets.length + 1}`,
          name: `Wallet ${wallets.length + 1}`,
          address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
          network: "StarkNet Mainnet",
          status: "connected",
          balance: 0.05,
          nftsCollected: 0,
        },
      ]);
    }, 1500);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background blur - keeping consistent with homepage */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center p-6 sm:p-24">
        {/* Back button */}
        <div className="self-start mb-6">
          <Button
            asChild
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Glass card container */}
        <div className="backdrop-blur-lg bg-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full">
          {/* Grid effect */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent opacity-20"
            style={{
              backgroundSize: "4px 4px",
              backgroundImage:
                "linear-gradient(to right, rgb(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(139, 92, 246, 0.1) 1px, transparent 1px)",
            }}
          />

          <h1 className="text-3xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Connected Wallets
          </h1>

          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-xl mx-auto text-center">
            Manage your connected wallets to track progress, collect NFTs, and
            compete in the global leaderboard.
          </p>

          {/* Wallets list */}
          <div className="space-y-6">
            {wallets.map((wallet) => (
              <Card
                key={wallet.id}
                className="bg-white/5 border-white/20 text-white shadow-lg hover:bg-white/10 transition-all"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {wallet.name}
                      {wallet.status === "connected" && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Check size={12} /> Connected
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-400 truncate max-w-xs sm:max-w-md">
                      {wallet.address}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    onClick={() => disconnectWallet(wallet.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <p className="text-sm text-gray-400">Network</p>
                      <p className="font-medium">{wallet.network}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <p className="text-sm text-gray-400">Balance</p>
                      <p className="font-medium">{wallet.balance} ETH</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                      <p className="text-sm text-gray-400">NFTs Collected</p>
                      <p className="font-medium">{wallet.nftsCollected} / 10</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-400 border-purple-400/50 hover:bg-purple-400/20"
                    asChild
                  >
                    <Link
                      href={`/wallet/${wallet.id}`}
                      className="flex items-center gap-2"
                    >
                      View Details
                      <ExternalLink size={16} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Connect new wallet button */}
            <Button
              onClick={connectNewWallet}
              disabled={connecting}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg transform transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
            >
              {connecting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Connect New Wallet
                </>
              )}
            </Button>
          </div>

          {/* Information box */}
          <div className="mt-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex gap-3">
            <AlertTriangle className="text-yellow-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-400 mb-1">Important</h3>
              <p className="text-sm text-gray-300">
                Only connect wallets on the StarkNet network. Your connected
                wallets are used to track your progress in the NFT Scavenger
                Hunt and store your collected NFTs. Never share your private
                keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConnectedWallets;
