import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    // In a real implementation, this would fetch data from your backend
    // For now, we'll return mock data
    const mockData = {
      stats: {
        totalInvites: 8,
        activeUsers: 5,
        totalRewards: 3,
        totalXPEarned: 250,
        nextMilestone: "10 invites for Legendary NFT"
      },
      invitedUsers: [
        {
          id: 1,
          username: "crypto_explorer",
          avatar: "/placeholder.svg",
          joinedDate: "2024-01-15",
          status: "active",
          rewardEarned: "Rare NFT",
          xpBonus: 50
        },
        {
          id: 2,
          username: "blockchain_master",
          avatar: "/placeholder.svg",
          joinedDate: "2024-01-20",
          status: "active",
          rewardEarned: "Epic NFT",
          xpBonus: 100
        },
        {
          id: 3,
          username: "puzzle_solver",
          avatar: "/placeholder.svg",
          joinedDate: "2024-01-25",
          status: "pending",
          rewardEarned: null,
          xpBonus: 0
        }
      ]
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
} 