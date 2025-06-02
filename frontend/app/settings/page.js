"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Wallet, Globe, LogOut, Save, Trash2, Eye, EyeOff, Check, X, Download } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showPassword, setShowPassword] = useState(false)

  // Mock user data
  const userData = {
    name: "CryptoMaster",
    email: "user@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j...",
    country: "United States",
    joinDate: "Jan 15, 2023",
    twoFactorEnabled: true,
  }

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newChallenges: true,
    weeklyDigest: true,
    achievements: true,
    friendActivity: false,
    marketingEmails: false,
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showActivity: true,
    showNFTs: true,
    showLevel: true,
    allowFriendRequests: true,
    dataCollection: true,
  })

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    })
  }

  const handlePrivacyToggle = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting],
    })
  }

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Account Settings
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Manage your profile, notifications, privacy, and security settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-lg bg-white/10 border border-white/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <img
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{userData.name}</h3>
                    <p className="text-gray-300 text-sm">{userData.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "profile" ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-5 w-5 mr-3" /> Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "notifications" ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="h-5 w-5 mr-3" /> Notifications
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "privacy" ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
                    onClick={() => setActiveTab("privacy")}
                  >
                    <Shield className="h-5 w-5 mr-3" /> Privacy & Security
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "wallet" ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
                    onClick={() => setActiveTab("wallet")}
                  >
                    <Wallet className="h-5 w-5 mr-3" /> Wallet
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${activeTab === "preferences" ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
                    onClick={() => setActiveTab("preferences")}
                  >
                    <Globe className="h-5 w-5 mr-3" /> Preferences
                  </Button>
                </nav>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="h-5 w-5 mr-3" /> Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Card className="backdrop-blur-lg bg-white/10 border border-white/20 overflow-hidden">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Profile Picture</label>
                      </div>
                      <div className="sm:w-2/3 flex items-center gap-4">
                        <img
                          src={userData.avatar || "/placeholder.svg"}
                          alt={userData.name}
                          className="w-20 h-20 rounded-full"
                        />
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          Change Avatar
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Username</label>
                      </div>
                      <div className="sm:w-2/3">
                        <input
                          type="text"
                          value={userData.name}
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Email Address</label>
                      </div>
                      <div className="sm:w-2/3">
                        <input
                          type="email"
                          value={userData.email}
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Country</label>
                      </div>
                      <div className="sm:w-2/3">
                        <select
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          defaultValue={userData.country}
                        >
                          <option value="United States" className="bg-gray-800">
                            United States
                          </option>
                          <option value="Canada" className="bg-gray-800">
                            Canada
                          </option>
                          <option value="United Kingdom" className="bg-gray-800">
                            United Kingdom
                          </option>
                          <option value="Australia" className="bg-gray-800">
                            Australia
                          </option>
                          <option value="Germany" className="bg-gray-800">
                            Germany
                          </option>
                          <option value="France" className="bg-gray-800">
                            France
                          </option>
                          <option value="Japan" className="bg-gray-800">
                            Japan
                          </option>
                          <option value="Other" className="bg-gray-800">
                            Other
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Bio</label>
                      </div>
                      <div className="sm:w-2/3">
                        <textarea
                          rows="4"
                          placeholder="Tell us about yourself..."
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Password</label>
                      </div>
                      <div className="sm:w-2/3">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••••"
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto mt-1">
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Email Notifications</h3>
                        <p className="text-gray-400 text-sm">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Push Notifications</h3>
                        <p className="text-gray-400 text-sm">Receive notifications on your device</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={() => handleNotificationToggle("pushNotifications")}
                      />
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-medium mb-4">Notification Types</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">New Challenges</h4>
                            <p className="text-gray-400 text-sm">Get notified when new challenges are available</p>
                          </div>
                          <Switch
                            checked={notificationSettings.newChallenges}
                            onCheckedChange={() => handleNotificationToggle("newChallenges")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Weekly Digest</h4>
                            <p className="text-gray-400 text-sm">Receive a weekly summary of activities</p>
                          </div>
                          <Switch
                            checked={notificationSettings.weeklyDigest}
                            onCheckedChange={() => handleNotificationToggle("weeklyDigest")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Achievements</h4>
                            <p className="text-gray-400 text-sm">Get notified when you earn new badges or rewards</p>
                          </div>
                          <Switch
                            checked={notificationSettings.achievements}
                            onCheckedChange={() => handleNotificationToggle("achievements")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Friend Activity</h4>
                            <p className="text-gray-400 text-sm">Get notified about your friends' achievements</p>
                          </div>
                          <Switch
                            checked={notificationSettings.friendActivity}
                            onCheckedChange={() => handleNotificationToggle("friendActivity")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Marketing Emails</h4>
                            <p className="text-gray-400 text-sm">Receive promotional offers and updates</p>
                          </div>
                          <Switch
                            checked={notificationSettings.marketingEmails}
                            onCheckedChange={() => handleNotificationToggle("marketingEmails")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Privacy & Security Tab */}
              {activeTab === "privacy" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>

                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-6">
                      <h3 className="text-white font-medium mb-4">Privacy Settings</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Public Profile</h4>
                            <p className="text-gray-400 text-sm">Allow others to view your profile</p>
                          </div>
                          <Switch
                            checked={privacySettings.publicProfile}
                            onCheckedChange={() => handlePrivacyToggle("publicProfile")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Activity Visibility</h4>
                            <p className="text-gray-400 text-sm">Show your puzzle-solving activity to others</p>
                          </div>
                          <Switch
                            checked={privacySettings.showActivity}
                            onCheckedChange={() => handlePrivacyToggle("showActivity")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">NFT Collection Visibility</h4>
                            <p className="text-gray-400 text-sm">Allow others to see your NFT collection</p>
                          </div>
                          <Switch
                            checked={privacySettings.showNFTs}
                            onCheckedChange={() => handlePrivacyToggle("showNFTs")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Level & Rank Visibility</h4>
                            <p className="text-gray-400 text-sm">Show your level and rank on the leaderboard</p>
                          </div>
                          <Switch
                            checked={privacySettings.showLevel}
                            onCheckedChange={() => handlePrivacyToggle("showLevel")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Friend Requests</h4>
                            <p className="text-gray-400 text-sm">Allow other users to send you friend requests</p>
                          </div>
                          <Switch
                            checked={privacySettings.allowFriendRequests}
                            onCheckedChange={() => handlePrivacyToggle("allowFriendRequests")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-white/10 pb-6">
                      <h3 className="text-white font-medium mb-4">Security</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Two-Factor Authentication</h4>
                            <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                          </div>
                          <div className="flex items-center">
                            {userData.twoFactorEnabled ? (
                              <Badge className="mr-3 bg-green-500 text-white">
                                <Check className="h-3 w-3 mr-1" /> Enabled
                              </Badge>
                            ) : (
                              <Badge className="mr-3 bg-gray-500 text-white">
                                <X className="h-3 w-3 mr-1" /> Disabled
                              </Badge>
                            )}
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                              {userData.twoFactorEnabled ? "Manage" : "Enable"}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Session Management</h4>
                            <p className="text-gray-400 text-sm">Manage your active sessions and devices</p>
                          </div>
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            View Sessions
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Login History</h4>
                            <p className="text-gray-400 text-sm">View your recent login activity</p>
                          </div>
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            View History
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-4">Data & Privacy</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Data Collection</h4>
                            <p className="text-gray-400 text-sm">
                              Allow us to collect usage data to improve your experience
                            </p>
                          </div>
                          <Switch
                            checked={privacySettings.dataCollection}
                            onCheckedChange={() => handlePrivacyToggle("dataCollection")}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Download Your Data</h4>
                            <p className="text-gray-400 text-sm">Get a copy of your personal data</p>
                          </div>
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Download className="h-4 w-4 mr-2" /> Request Data
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-red-400">Delete Account</h4>
                            <p className="text-gray-400 text-sm">
                              Permanently delete your account and all associated data
                            </p>
                          </div>
                          <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Account
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
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Wallet Tab */}
              {activeTab === "wallet" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Wallet Settings</h2>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Connected Wallet</label>
                      </div>
                      <div className="sm:w-2/3">
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={userData.walletAddress}
                            readOnly
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <Button variant="outline" className="ml-2 border-white/20 text-white hover:bg-white/10">
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Wallet Type</label>
                      </div>
                      <div className="sm:w-2/3">
                        <input
                          type="text"
                          value="MetaMask"
                          readOnly
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Network</label>
                      </div>
                      <div className="sm:w-2/3">
                        <select
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          defaultValue="starknet-mainnet"
                        >
                          <option value="starknet-mainnet" className="bg-gray-800">
                            StarkNet Mainnet
                          </option>
                          <option value="starknet-testnet" className="bg-gray-800">
                            StarkNet Testnet
                          </option>
                          <option value="ethereum-mainnet" className="bg-gray-800">
                            Ethereum Mainnet
                          </option>
                          <option value="ethereum-goerli" className="bg-gray-800">
                            Ethereum Goerli
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-medium mb-4">Transaction Settings</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Auto-confirm Transactions</h4>
                            <p className="text-gray-400 text-sm">Automatically confirm low-value transactions</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Transaction Notifications</h4>
                            <p className="text-gray-400 text-sm">Receive notifications for wallet transactions</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-medium mb-4">Security</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Spending Limit</h4>
                            <p className="text-gray-400 text-sm">Set a daily spending limit for your wallet</p>
                          </div>
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Set Limit
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Whitelist Addresses</h4>
                            <p className="text-gray-400 text-sm">Manage trusted addresses for quick transactions</p>
                          </div>
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                      Disconnect Wallet
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Language</label>
                      </div>
                      <div className="sm:w-2/3">
                        <select
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          defaultValue="en"
                        >
                          <option value="en" className="bg-gray-800">
                            English
                          </option>
                          <option value="es" className="bg-gray-800">
                            Español
                          </option>
                          <option value="fr" className="bg-gray-800">
                            Français
                          </option>
                          <option value="de" className="bg-gray-800">
                            Deutsch
                          </option>
                          <option value="ja" className="bg-gray-800">
                            日本語
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="sm:w-1/3">
                        <label className="text-gray-300">Time Zone</label>
                      </div>
                      <div className="sm:w-2/3">
                        <select
                          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          defaultValue="UTC"
                        >
                          <option value="UTC" className="bg-gray-800">
                            UTC
                          </option>
                          <option value="EST" className="bg-gray-800">
                            Eastern Time (ET)
                          </option>
                          <option value="PST" className="bg-gray-800">
                            Pacific Time (PT)
                          </option>
                          <option value="GMT" className="bg-gray-800">
                            Greenwich Mean Time (GMT)
                          </option>
                          <option value="JST" className="bg-gray-800">
                            Japan Standard Time (JST)
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Dark Mode</h3>
                        <p className="text-gray-400 text-sm">Enable dark mode for the application</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-medium mb-4">Puzzle Preferences</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Difficulty Level</h4>
                            <p className="text-gray-400 text-sm">Set your preferred puzzle difficulty</p>
                          </div>
                          <select
                            className="bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            defaultValue="medium"
                          >
                            <option value="easy" className="bg-gray-800">
                              Easy
                            </option>
                            <option value="medium" className="bg-gray-800">
                              Medium
                            </option>
                            <option value="hard" className="bg-gray-800">
                              Hard
                            </option>
                            <option value="expert" className="bg-gray-800">
                              Expert
                            </option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Puzzle Categories</h4>
                            <p className="text-gray-400 text-sm">Select your preferred puzzle categories</p>
                          </div>
                          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Manage Categories
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Auto-start Next Puzzle</h4>
                            <p className="text-gray-400 text-sm">
                              Automatically start the next puzzle after completion
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-medium mb-4">Display Settings</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Show Leaderboard</h4>
                            <p className="text-gray-400 text-sm">Display the leaderboard on your dashboard</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Show Achievements</h4>
                            <p className="text-gray-400 text-sm">Display your achievements on your profile</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white">Show Friend Activity</h4>
                            <p className="text-gray-400 text-sm">Display your friends' recent activity</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

