"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Wallet,
  AlertCircle,
  Check,
  Shield,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { connect, disconnect } from "get-starknet";

export default function ConnectWallet() {
  const [connectingStatus, setConnectingStatus] = useState("idle"); // idle, connecting, success, error
  const [activeWallet, setActiveWallet] = useState(null);
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const walletOptions = [
    {
      id: "argentx",
      name: "Argent X",
      description: "StarkNet's most popular wallet",
      icon: "https://www.argent.xyz/favicon.ico",
    },
    {
      id: "braavos",
      name: "Braavos",
      description: "Self-custodial StarkNet wallet",
      icon: "https://braavos.app/favicon.ico", // This would be replaced with local image in production
    },
    {
      id: "metamask",
      name: "MetaMask",
      description: "Via StarkNet bridge",
      icon: "https://metamask.io/favicon.ico", // This would be replaced with local image in production
    },
  ];

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // In a real implementation, use StarkNet.js to check existing connection
        const starknet = await connect();
        if (starknet && starknet.isConnected) {
          setAccount(starknet.account);
          setConnectingStatus("success");
        }

        // For now, check localStorage for demo purposes
        const savedWallet = localStorage.getItem("connectedWallet");
        const savedAccount = localStorage.getItem("walletAccount");

        if (savedWallet && savedAccount) {
          setActiveWallet(savedWallet);
          setAccount(JSON.parse(savedAccount));
          setConnectingStatus("success");
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletConnection();
  }, []);

  const handleConnectWallet = async (walletId) => {
    setActiveWallet(walletId);
    setConnectingStatus("connecting");
    setErrorMessage("");

    try {
      // In a real implementation, use specific wallet connection logic
      // For example with StarkNet.js:
      // const starknet = await connect({ modalMode: "alwaysAsk" });
      // if(!starknet.isConnected) throw new Error("Connection rejected");
      // setAccount(starknet.account);

      // Simulate API call with axios
      const response = await axios.post(
        "/api/connect-wallet",
        {
          walletType: walletId,
          network: "mainnet", // or 'testnet'
        },
        {
          // Set a reasonable timeout
          timeout: 10000,
        }
      );

      // Simulate successful connection
      if (response.status === 200) {
        // For demo purposes, create a mock account
        const mockAccount = {
          address: `0x${Array(62)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("")}`,
          chainId: "SN_MAIN",
          balance: {
            eth: (Math.random() * 10).toFixed(4),
            tokens: [],
          },
        };

        setAccount(mockAccount);
        setConnectingStatus("success");

        // Save to localStorage for persistence
        localStorage.setItem("connectedWallet", walletId);
        localStorage.setItem("walletAccount", JSON.stringify(mockAccount));

        toast({
          title: "Wallet Connected",
          description: "Your wallet has been connected successfully",
          variant: "success",
        });

        // Redirect after a brief delay
        setTimeout(() => {
          window.location.href = "/game";
        }, 1500);
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setConnectingStatus("error");
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to connect wallet"
      );

      toast({
        title: "Connection Failed",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      // In a real implementation:
      // await disconnect();

      // Simulate API call with axios
      await axios.post("/api/disconnect-wallet");

      setConnectingStatus("idle");
      setActiveWallet(null);
      setAccount(null);

      // Clear localStorage
      localStorage.removeItem("connectedWallet");
      localStorage.removeItem("walletAccount");

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background blur */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6">
        {/* Glass card container */}
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
          {/* Grid effect */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent opacity-20 rounded-2xl"
            style={{
              backgroundSize: "4px 4px",
              backgroundImage:
                "linear-gradient(to right, rgb(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(139, 92, 246, 0.1) 1px, transparent 1px)",
            }}
          />

          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-purple-300 hover:text-white hover:bg-white/10 p-2"
                >
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div className="bg-white/10 px-3 py-1 rounded-full">
                <span className="text-xs text-purple-200">
                  StarkNet Ecosystem
                </span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {connectingStatus === "success"
                  ? "Wallet Connected"
                  : "Connect Your Wallet"}
              </h1>
              <p className="text-gray-300">
                {connectingStatus === "success"
                  ? "Your wallet is ready for the treasure hunt"
                  : "Link a supported wallet to begin your treasure hunt"}
              </p>
            </div>

            {connectingStatus === "success" && account ? (
              <div className="space-y-4">
                <Card className="bg-white/5 border border-white/10">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center p-2">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                        <Wallet size={24} className="text-white" />
                      </div>

                      <h3 className="font-bold text-white text-lg">
                        {walletOptions.find((w) => w.id === activeWallet)
                          ?.name || "Connected Wallet"}
                      </h3>

                      <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mt-2 mb-4">
                        <span className="text-sm text-purple-200 font-mono">
                          {formatAddress(account.address)}
                        </span>
                        <button
                          className="text-purple-300 hover:text-purple-200"
                          onClick={() => {
                            navigator.clipboard.writeText(account.address);
                            toast({
                              title: "Address Copied",
                              description: "Wallet address copied to clipboard",
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              width="14"
                              height="14"
                              x="8"
                              y="8"
                              rx="2"
                              ry="2"
                            />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 w-full">
                        <div className="bg-white/5 p-3 rounded-lg">
                          <p className="text-xs text-gray-400">Network</p>
                          <p className="text-white font-medium">
                            {account.chainId === "SN_MAIN"
                              ? "MainNet"
                              : "TestNet"}
                          </p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                          <p className="text-xs text-gray-400">Balance</p>
                          <p className="text-white font-medium">
                            {account.balance.eth} ETH
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3 w-full">
                        <Button
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          onClick={() => (window.location.href = "/game")}
                        >
                          Start Game
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-white/20 text-white hover:bg-white/10"
                          onClick={handleDisconnect}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {walletOptions.map((wallet) => (
                    <Card
                      key={wallet.id}
                      className={`bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer ${
                        activeWallet === wallet.id
                          ? "ring-2 ring-purple-500 bg-white/10"
                          : ""
                      }`}
                      onClick={() => handleConnectWallet(wallet.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-white">
                              {wallet.name}
                            </h3>
                            <p className="text-sm text-gray-300">
                              {wallet.description}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <Wallet size={20} className="text-purple-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {connectingStatus === "connecting" && (
                  <div className="mt-6 text-center">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-purple-300">Connecting to wallet...</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Please confirm the connection in your wallet extension
                    </p>
                  </div>
                )}

                {connectingStatus === "error" && (
                  <div className="mt-6 text-center">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                      <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <p className="text-red-400">Connection failed</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {errorMessage || "Please try again"}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-white/20 text-white hover:bg-white/10"
                      onClick={() => setConnectingStatus("idle")}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Help section */}
            <div className="mt-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full border border-white/10 text-purple-300 hover:bg-white/5 hover:text-purple-200"
                  >
                    <Shield size={16} className="mr-2" />
                    New to StarkNet wallets?
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 border border-purple-900/50 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-purple-300">
                      Getting Started with StarkNet Wallets
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                      First time using StarkNet? Here's how to get set up.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h4 className="font-bold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center mr-2 text-xs">
                          1
                        </span>
                        Install a StarkNet Wallet
                      </h4>
                      <p className="text-sm text-gray-300 mb-2">
                        We recommend Argent X or Braavos for the best
                        experience.
                      </p>
                      <div className="flex gap-2">
                        <a
                          href="https://www.argent.xyz/argent-x/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-purple-800 hover:bg-purple-700 px-3 py-1 rounded-full flex items-center"
                        >
                          Argent X
                          <ExternalLink size={12} className="ml-1" />
                        </a>
                        <a
                          href="https://braavos.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-purple-800 hover:bg-purple-700 px-3 py-1 rounded-full flex items-center"
                        >
                          Braavos
                          <ExternalLink size={12} className="ml-1" />
                        </a>
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg">
                      <h4 className="font-bold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center mr-2 text-xs">
                          2
                        </span>
                        Create or Import a Wallet
                      </h4>
                      <p className="text-sm text-gray-300">
                        Follow the wallet's instructions to set up your account
                        and secure your recovery phrase.
                      </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg">
                      <h4 className="font-bold mb-2 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center mr-2 text-xs">
                          3
                        </span>
                        Fund Your Wallet
                      </h4>
                      <p className="text-sm text-gray-300">
                        Add ETH to your StarkNet wallet through a bridge or
                        exchange that supports StarkNet.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                      Got it!
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                By connecting your wallet, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
