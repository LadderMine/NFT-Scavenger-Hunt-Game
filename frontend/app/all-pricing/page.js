"use client"
import { Button } from "@/components/ui/card"
import { Check, CreditCard, Shield } from "lucide-react"

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Explorer",
      price: "Free",
      description: "Start your adventure with basic access",
      features: [
        "Access to 5 basic puzzles",
        "1 NFT reward upon completion",
        "Basic leaderboard access",
        "Community forum access",
      ],
      buttonText: "Start Free",
      popular: false,
    },
    {
      name: "Treasure Hunter",
      price: "$9.99",
      period: "monthly",
      description: "Unlock more puzzles and exclusive rewards",
      features: [
        "Access to 20+ advanced puzzles",
        "5 exclusive NFT rewards",
        "Priority leaderboard placement",
        "Early access to new challenges",
        "Exclusive Discord channel access",
      ],
      buttonText: "Subscribe Now",
      popular: true,
    },
    {
      name: "Legendary Explorer",
      price: "$99.99",
      period: "yearly",
      description: "Full access to all content and premium rewards",
      features: [
        "Unlimited access to all puzzles",
        "10 legendary NFT rewards",
        "Custom profile badge",
        "Private puzzle creation tools",
        "1-on-1 blockchain mentoring",
        "Ad-free experience",
      ],
      buttonText: "Go Legendary",
      popular: false,
    },
  ]

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Choose Your Adventure Path
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Select the plan that fits your treasure hunting ambitions. Upgrade anytime to unlock more puzzles and
            exclusive NFT rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`backdrop-blur-lg rounded-2xl shadow-xl border transition-all duration-300 hover:transform hover:scale-105 ${
                plan.popular ? "bg-white/15 border-purple-500/50 shadow-purple-500/20" : "bg-white/10 border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-1 px-4 rounded-t-xl font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  {plan.period && <span className="ml-2 text-gray-400">/{plan.period}</span>}
                </div>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-3 rounded-xl font-bold ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="mb-6 sm:mb-0 sm:mr-8">
              <Shield className="h-16 w-16 text-purple-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Secure Blockchain Payments</h3>
              <p className="text-gray-300 mb-4">
                All transactions are secured through StarkNet's layer-2 solution. Pay with crypto or traditional payment
                methods.
              </p>
              <div className="flex items-center space-x-4">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">We accept ETH, USDC, and major credit cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

