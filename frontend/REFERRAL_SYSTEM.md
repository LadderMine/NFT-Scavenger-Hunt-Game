# Referral System Implementation

## Overview

The referral system encourages users to invite friends to join the NFT Scavenger Hunt game. Users can share their referral links, track invited friends, and earn rewards for successful referrals.

## Features

### 1. Invite Friends Page (`/invite-friends`)
- **Referral Link**: Users can copy and share their unique referral link
- **Statistics Dashboard**: Shows total invites, active users, rewards earned, and XP gained
- **Invited Users List**: Displays all users invited with their status and rewards
- **Milestone Tracking**: Progress towards next reward tier
- **Reward Tiers**: Clear progression system with different NFT rewards

### 2. Referral Landing Page (`/ref/[referralId]`)
- **Welcome Message**: Personalized invitation from the referrer
- **Referrer Profile**: Shows referrer's stats and achievements
- **Special Bonuses**: Highlights exclusive rewards for referred users
- **Game Preview**: Overview of what awaits new users
- **Call-to-Action**: Direct path to registration with referral bonuses

### 3. Components

#### `ReferralStats`
- Displays referral statistics in a clean card layout
- Shows total invites, active users, rewards earned, and XP gained
- Color-coded icons for different metrics

#### `ReferralLink`
- Handles referral link display and copying
- Native sharing functionality with fallback to copy
- Reward information display

#### `ReferralCard`
- Individual user card showing invited friend details
- Status badges (Active, Pending, Inactive)
- Reward information for successful referrals

#### `ReferralNotification`
- Toast notification for earned referral rewards
- Auto-dismissing with manual close option
- Different icons for different reward types

### 4. Custom Hook (`useReferral`)
- **State Management**: Handles referral data and loading states
- **API Integration**: Fetches and updates referral information
- **Utility Functions**: 
  - `generateReferralLink()`: Creates unique referral URLs
  - `trackReferral()`: Records new referrals
  - `getRewardTier()`: Determines reward tier based on invite count
  - `getProgressToNextMilestone()`: Calculates progress to next milestone
  - `shareReferral()`: Native sharing with fallback
  - `copyReferralLink()`: Clipboard functionality

## API Routes

### `GET /api/referrals/[userId]`
- Fetches referral statistics and invited users list
- Returns mock data (to be connected to backend)

### `POST /api/referrals/track`
- Tracks new referrals when users sign up
- Awards bonuses to both referrer and new user
- Updates referral statistics

## Reward System

### Referrer Rewards
- **5 invites**: Rare NFT
- **10 invites**: Epic NFT  
- **25 invites**: Legendary NFT
- **50 invites**: Mythic NFT
- **Per referral**: 50 XP bonus

### Referred User Bonuses
- **Welcome NFT**: Free NFT for joining through referral
- **50 XP Bonus**: Extra experience points to start
- **Exclusive Badge**: Special referral status badge

## Navigation Integration

The "Invite Friends" link has been added to the main navigation bar, making it easily accessible from any page in the application.

## Usage

### For Users
1. Navigate to `/invite-friends`
2. Copy or share your referral link
3. Track invited friends and earned rewards
4. Progress towards milestone rewards

### For Referred Users
1. Click on a referral link (`/ref/[referralId]`)
2. View special bonuses and game preview
3. Register with referral bonuses applied
4. Start playing with extra rewards

## Technical Implementation

### State Management
- Uses Zustand for global state management
- Custom `useReferral` hook for referral-specific logic
- Local storage for referral tracking

### UI/UX
- Consistent with app's design system
- Glass morphism effects and gradient themes
- Responsive design for all screen sizes
- Smooth animations and transitions

### Future Enhancements
- Backend integration for real data
- Social media sharing integration
- Advanced analytics and tracking
- Gamification elements (leaderboards, challenges)
- Email/SMS invitation system

## File Structure

```
frontend/
├── app/
│   ├── invite-friends/
│   │   └── page.js
│   ├── ref/[referralId]/
│   │   └── page.js
│   └── api/referrals/
│       ├── [userId]/route.js
│       └── track/route.js
├── components/
│   ├── ReferralStats.jsx
│   ├── ReferralLink.jsx
│   ├── ReferralCard.jsx
│   └── ReferralNotification.jsx
├── hooks/
│   └── useReferral.js
└── REFERRAL_SYSTEM.md
```

This implementation provides a complete referral system that encourages user growth while rewarding both referrers and new users with exclusive bonuses and NFTs. 