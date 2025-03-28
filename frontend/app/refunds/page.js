"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, AlertCircle, CheckCircle, XCircle, Clock, DollarSign, FileText } from "lucide-react"

export default function RefundsPage() {
  const [activeTab, setActiveTab] = useState("policy")

  // Mock refund requests data
  const refundRequests = [
    {
      id: "REF001",
      date: "2023-05-15",
      amount: 19.99,
      status: "approved",
      reason: "Accidental purchase",
      item: "Premium Puzzle Pack"
    },
    {
      id: "REF002",
      date: "2023-06-02",
      amount: 9.99,
      status: "pending",
      reason: "Technical issues",
      item: "Monthly Subscription"
    },
    {
      id: "REF003",
      date: "2023-06-10",
      amount: 4.99,
      status: "rejected",
      reason: "Outside refund window",
      item: "Special NFT Access"
    }
  ]

  const statusColors = {
    approved: "bg-green-500",
    pending: "bg-yellow-500",
    rejected: "bg-red-500",
  }

  const statusIcons = {
    approved: <CheckCircle className="h-5 w-5 text-green-500" />,
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-500" />,
  }

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
            Refunds & Cancellations
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Learn about our refund policy and manage your refund requests.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 rounded-xl p-1 mb-8">
            <TabsTrigger
              value="policy"
              className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Refund Policy
            </TabsTrigger>
            <TabsTrigger
              value="request"
              className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Request Refund
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Request History
            </TabsTrigger>
          </TabsList>

          {/* Refund Policy Tab */}
          <TabsContent value="policy">
            <Card className="backdrop-blur-lg bg-white/10 border border-white/20 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Our Refund Policy</h2>

                <div className="space-y-6">
                  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" /> Eligibility Criteria
                    </h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-xs text-purple-300">1</span>
                        </div>
                        <span>Refund requests must be submitted within 14 days of purchase.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-xs text-purple-300">2</span>
                        </div>
                        <span>Subscription cancellations are processed at the end of the current billing cycle.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-xs text-purple-300">3</span>
                        </div>
                        <span>
                          NFT purchases are generally non-refundable once the NFT has been minted to your wallet.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-xs text-purple-300">4</span>
                        </div>
                        <span>Technical issues that prevent access to purchased content are eligible for refunds.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <HelpCircle className="h-5 w-5 text-blue-500 mr-2" /> Refund Process
                    </h3>
                    <ol className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-xs text-blue-300">1</span>
                        </div>
                        <span>Submit a refund request through the "Request Refund" tab.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-xs text-blue-300">2</span>
                        </div>
                        <span>Our team will review your request within 2-3 business days.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-xs text-blue-300">3</span>
                        </div>
                        <span>If approved, refunds will be processed to the original payment method.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                          <span className="text-xs text-blue-300">4</span>
                        </div>
                        <span>Refunds typically take 5-10 business days to appear in your account.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Special Circumstances</h3>
                    <p className="text-gray-300 mb-4">
                      We understand that special circumstances may arise. If you have a unique situation that doesn't
                      fit within our standard policy, please contact our support team directly.
                    </p>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Request Refund Tab */}
          <TabsContent value="request">
            <Card className="backdrop-blur-lg bg-white/10 border border-white/20 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Request a Refund</h2>

                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="sm:w-1/3">
                      <label className="text-gray-300">Purchase Type</label>
                    </div>
                    <div className="sm:w-2/3">
                      <select className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="" className="bg-gray-800">
                          Select purchase type
                        </option>
                        <option value="subscription" className="bg-gray-800">
                          Subscription
                        </option>
                        <option value="nft" className="bg-gray-800">
                          NFT Purchase
                        </option>
                        <option value="puzzle" className="bg-gray-800">
                          Puzzle Pack
                        </option>
                        <option value="other" className="bg-gray-800">
                          Other
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="sm:w-1/3">
                      <label className="text-gray-300">Purchase Date</label>
                    </div>
                    <div className="sm:w-2/3">
                      <input
                        type="date"
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="sm:w-1/3">
                      <label className="text-gray-300">Order/Transaction ID</label>
                    </div>
                    <div className="sm:w-2/3">
                      <input
                        type="text"
                        placeholder="Enter your order or transaction ID"
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="sm:w-1/3">
                      <label className="text-gray-300">Refund Amount</label>
                    </div>
                    <div className="sm:w-2/3">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="sm:w-1/3">
                      <label className="text-gray-300">Reason for Refund</label>
                    </div>
                    <div className="sm:w-2/3">
                      <select className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4">
                        <option value="" className="bg-gray-800">
                          Select a reason
                        </option>
                        <option value="accidental" className="bg-gray-800">
                          Accidental Purchase
                        </option>
                        <option value="technical" className="bg-gray-800">
                          Technical Issues
                        </option>
                        <option value="expectations" className="bg-gray-800">
                          Did Not Meet Expectations
                        </option>
                        <option value="duplicate" className="bg-gray-800">
                          Duplicate Purchase
                        </option>
                        <option value="other" className="bg-gray-800">
                          Other
                        </option>
                      </select>

                      <textarea
                        rows="4"
                        placeholder="Please provide additional details about your refund request..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="sm:w-1/3">
                      <label className="text-gray-300">Supporting Documents</label>
                    </div>
                    <div className="sm:w-2/3">
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                        <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-300 mb-2">Drag and drop files here, or click to browse</p>
                        <p className="text-gray-400 text-sm">Accepted file types: PDF, JPG, PNG (Max 5MB)</p>
                        <Button variant="outline" className="mt-4 border-white/20 text-white hover:bg-white/10">
                          Upload Files
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    Submit Request
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Request History Tab */}
          <TabsContent value="history">
            <Card className="backdrop-blur-lg bg-white/10 border border-white/20 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Refund Request History</h2>

                {refundRequests.length > 0 ? (
                  <div className="space-y-6">
                    {refundRequests.map((request) => (
                      <div
                        key={request.id}
                        className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div className="flex items-center mb-2 sm:mb-0">
                            {statusIcons[request.status]}
                            <h3 className="text-xl font-bold text-white ml-2">Request #{request.id}</h3>
                          </div>
                          <Badge className={`${statusColors[request.status]} text-white`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-sm">Date Requested</p>
                            <p className="text-white">{request.date}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Item</p>
                            <p className="text-white">{request.item}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Amount</p>
                            <p className="text-white">${request.amount.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-400 text-sm">Reason</p>
                          <p className="text-white">{request.reason}</p>
                        </div>

                        <div className="flex justify-end">
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Refund Requests</h3>
                    <p className="text-gray-300 mb-6">You haven't submitted any refund requests yet.</p>
                    <Button
                      onClick={() => setActiveTab("request")}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Request a Refund
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">Still have questions about refunds?</p>
          <Button className="bg-white/10 hover:bg-white/20 text-white">Contact Support</Button>
        </div>
      </div>
    </main>
  )
}

