import { useState, useEffect } from "react";
import axios from "axios";

export const useReferral = () => {
  const [referralStats, setReferralStats] = useState({
    totalInvites: 0,
    activeUsers: 0,
    totalRewards: 0,
    totalXPEarned: 0,
    nextMilestone: ""
  });

  const [invitedUsers, setInvitedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate referral link for current user
  const generateReferralLink = (userId) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nft-hunt.com";
    return `${baseUrl}/ref/${userId}`;
  };

  // Fetch referral data
  const fetchReferralData = async (userId) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/referrals/${userId}`, {
        withCredentials: true
      });

      setReferralStats(response.data.stats);
      setInvitedUsers(response.data.invitedUsers);
    } catch (err) {
      console.error("Failed to fetch referral data:", err);
      setError("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  // Track new referral
  const trackReferral = async (referrerId, newUserId) => {
    try {
      await axios.post("/api/referrals/track", {
        referrerId,
        newUserId
      }, {
        withCredentials: true
      });

      // Refresh referral data
      await fetchReferralData(referrerId);
    } catch (err) {
      console.error("Failed to track referral:", err);
    }
  };

  // Get reward tier info
  const getRewardTier = (totalInvites) => {
    if (totalInvites >= 50) return { tier: "Mythic", reward: "Mythic NFT", color: "pink" };
    if (totalInvites >= 25) return { tier: "Legendary", reward: "Legendary NFT", color: "yellow" };
    if (totalInvites >= 10) return { tier: "Epic", reward: "Epic NFT", color: "purple" };
    if (totalInvites >= 5) return { tier: "Rare", reward: "Rare NFT", color: "green" };
    return { tier: "Common", reward: "Common NFT", color: "gray" };
  };

  // Calculate progress to next milestone
  const getProgressToNextMilestone = (currentInvites) => {
    const milestones = [5, 10, 25, 50];
    const nextMilestone = milestones.find(m => m > currentInvites) || 50;
    const progress = (currentInvites / nextMilestone) * 100;
    
    return {
      current: currentInvites,
      next: nextMilestone,
      progress: Math.min(progress, 100),
      remaining: nextMilestone - currentInvites
    };
  };

  // Share referral link
  const shareReferral = async (referralLink) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join NFT Scavenger Hunt!",
          text: "I'm playing this amazing NFT scavenger hunt game. Join me and earn exclusive rewards!",
          url: referralLink
        });
        return true;
      } catch (err) {
        console.error("Error sharing:", err);
        return false;
      }
    }
    return false;
  };

  // Copy referral link to clipboard
  const copyReferralLink = async (referralLink) => {
    try {
      await navigator.clipboard.writeText(referralLink);
      return true;
    } catch (err) {
      console.error("Failed to copy:", err);
      return false;
    }
  };

  return {
    referralStats,
    invitedUsers,
    loading,
    error,
    generateReferralLink,
    fetchReferralData,
    trackReferral,
    getRewardTier,
    getProgressToNextMilestone,
    shareReferral,
    copyReferralLink
  };
}; 