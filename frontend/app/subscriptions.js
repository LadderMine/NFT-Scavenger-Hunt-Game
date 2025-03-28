"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Check, CreditCard, Calendar, Clock, AlertCircle, ChevronRight } from "lucide-react";

export default function SubscriptionPage() {
  const [autoRenew, setAutoRenew] = useState(true);

  // Mock subscription data
  const subscriptionData = {
    plan: "Treasure Hunter",
    status: "active",
    price: 9.99,
    billingCycle: "monthly",
    nextBillingDate: "July 15, 2023",
    startDate: "January 15, 2023",
    paymentMethod: {
      type: "Credit Card",
      last4: "4242",
      expiryDate: "05/25"
    },
    features: [
      "Access to 20+ advanced puzzles",
      "5 exclusive NFT rewards",
      "Priority leaderboard placement",
      "Early access to new challenges",
      "Exclusive Discord channel access"
    ],
    usage: {
      puzzlesAccessed: 12,
      puzzlesTotal: 20,
      nftsEarned: 3,
      nftsTotal: 5
    }
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Your Subscription
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Manage your subscription plan, billing information, and usage details.
          </p>
        </div>

        {/* Subscription Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="backdrop-blur-lg bg-white/10 border border-white/20 overflow-hidden col-span-2">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{subscriptionData.plan} Plan</h2>
                  <p className="text-gray-300">${subscriptionData.price}/{subscriptionData.billingCycle}</p>
                </div>
                <Badge className="bg-green-500 text-white mt-2 sm:mt-0">Active</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-purple-400 mr-2" />
                    <h3 className="text-white font-medium">Billing Cycle</h3>
                  </div>
                  <p className="text-gray-300">
                    {subscriptionData.billingCycle.charAt(0).toUpperCase() + subscriptionData.billingCycle.slice(1)}
                  </p>
                </div>

                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-purple-400 mr-2" />
                    <h3 className="text-white font-medium">Next Billing Date</h3>
                  </div>
                  <p className="text-gray-300">{subscriptionData.nextBillingDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <h3 className="text-white font-medium mr-2">Auto-Renew</h3>
                  <AlertCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </div>
                <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
              </div>
            </div>
          </Card>

          <Card className="backdrop-blur-lg bg-white/10 border border-white/20 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Plan Features</h2>
              <ul className="space-y-3 mb-6">
                {subscriptionData.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                Upgrade Plan <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
