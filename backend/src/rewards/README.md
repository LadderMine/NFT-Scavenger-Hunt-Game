# RewardModule

A standalone module for handling reward distribution to users who complete specific challenges in the NFT Scavenger Hunt Game.

## Features

- ✅ **Reward Management**: Create, update, and manage rewards with metadata
- ✅ **Claim Tracking**: Prevent duplicate claims and track user reward history
- ✅ **Challenge Association**: Link rewards to specific challenges
- ✅ **Claim Limits**: Set maximum claim limits for rewards
- ✅ **Statistics**: Get detailed statistics for rewards
- ✅ **Soft Delete**: Safely deactivate rewards without losing data

## Database Schema

### Reward Entity

```typescript
{
  id: string; // Unique identifier
  name: string; // Reward name
  description: string; // Reward description
  type: RewardType; // NFT, TOKEN, BADGE, POINTS
  metadata: Record<string, any>; // Flexible metadata storage
  challengeId: string; // Associated challenge
  isActive: boolean; // Whether reward is available
  maxClaims: number | null; // Maximum claims allowed
  currentClaims: number; // Current claim count
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last update timestamp
}
```

### RewardClaim Entity

```typescript
{
  id: string; // Unique identifier
  userId: string; // User who claimed
  rewardId: string; // Associated reward
  challengeId: string; // Associated challenge
  claimDate: Date; // When claimed
  transactionHash: string; // Blockchain transaction (optional)
  status: string; // Claim status
}
```

## API Endpoints

### Create Reward

```http
POST /rewards
Content-Type: application/json

{
  "name": "StarkNet Beginner Badge",
  "description": "Awarded for completing Easy level challenges",
  "type": "badge",
  "challengeId": "challenge-easy-001",
  "metadata": {
    "imageUrl": "https://example.com/badge.png",
    "rarity": "common"
  },
  "isActive": true,
  "maxClaims": 1000
}
```

### Get All Rewards

```http
GET /rewards
```

### Get Reward by ID

```http
GET /rewards/:id
```

### Get Reward by Challenge ID

```http
GET /rewards/challenge/:challengeId
```

### Claim Reward ⭐

```http
POST /rewards/claim
Content-Type: application/json

{
  "userId": "user-123",
  "challengeId": "challenge-easy-001"
}
```

**Response (201 Created):**

```json
{
  "id": "claim-001",
  "userId": "user-123",
  "rewardId": "reward-001",
  "challengeId": "challenge-easy-001",
  "claimDate": "2024-01-15T10:30:00Z",
  "transactionHash": null,
  "status": "claimed"
}
```

**Error Response (409 Conflict):**

```json
{
  "message": "Reward already claimed",
  "error": "Conflict",
  "statusCode": 409
}
```

### Get User Claims

```http
GET /rewards/user/:userId/claims
```

### Get Claim by ID

```http
GET /rewards/claims/:id
```

### Get Reward Statistics

```http
GET /rewards/:id/stats
```

**Response:**

```json
{
  "reward": {
    /* reward object */
  },
  "totalClaims": 25,
  "availableClaims": 75,
  "isAvailable": true
}
```

### Delete Reward

```http
DELETE /rewards/:id
```

## Usage Examples

### 1. Setting up a new reward for a challenge

```typescript
// Create a new NFT reward
const newReward = await rewardsService.createReward({
  name: 'StarkNet Master NFT',
  description: 'Exclusive NFT for completing Master level',
  type: RewardType.NFT,
  challengeId: 'challenge-master-001',
  metadata: {
    imageUrl: 'https://example.com/master-nft.png',
    rarity: 'legendary',
    contractAddress: '0x123...',
  },
  maxClaims: 100,
});
```

### 2. Claiming a reward

```typescript
// User completes a challenge and claims reward
const claim = await rewardsService.claimReward({
  userId: 'user-456',
  challengeId: 'challenge-easy-001',
});

// Check if claim was successful
if (claim) {
  console.log(`Reward claimed successfully! Claim ID: ${claim.id}`);
}
```

### 3. Checking if user already claimed

```typescript
// Check if user has already claimed this reward
const hasClaimed = await rewardsService.hasUserClaimedReward(
  'user-456',
  'challenge-easy-001',
);

if (hasClaimed) {
  console.log('User has already claimed this reward');
} else {
  console.log('User can claim this reward');
}
```

### 4. Getting user's reward history

```typescript
// Get all claims for a user
const userClaims = await rewardsService.getUserClaims('user-456');

console.log(`User has claimed ${userClaims.length} rewards:`);
userClaims.forEach((claim) => {
  console.log(`- ${claim.reward.name} (${claim.claimDate})`);
});
```

## Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid input data or reward limit reached
- **404 Not Found**: Reward or claim not found
- **409 Conflict**: Reward already claimed by user
- **500 Internal Server Error**: Database or system errors

## Testing

### Unit Tests

```bash
npm run test rewards.service.spec.ts
npm run test rewards.controller.spec.ts
```

### E2E Tests

```bash
npm run test:e2e rewards.e2e-spec.ts
```

## Database Migrations

The module uses TypeORM with automatic schema synchronization. For production, consider creating proper migrations:

```bash
# Generate migration
npm run typeorm:generate-migration -- -n CreateRewardsTables

# Run migrations
npm run typeorm:run-migrations
```

## Security Considerations

1. **Input Validation**: All inputs are validated using class-validator
2. **Duplicate Prevention**: Unique constraints prevent duplicate claims
3. **Soft Delete**: Rewards are deactivated rather than deleted
4. **Transaction Safety**: Database operations are atomic
5. **Rate Limiting**: Consider implementing rate limiting for claim endpoints

## Integration with Frontend

```typescript
// Frontend example using axios
const claimReward = async (userId: string, challengeId: string) => {
  try {
    const response = await axios.post('/rewards/claim', {
      userId,
      challengeId,
    });

    if (response.status === 201) {
      // Reward claimed successfully
      return response.data;
    }
  } catch (error) {
    if (error.response?.status === 409) {
      // Reward already claimed
      console.log('You have already claimed this reward');
    } else {
      // Other error
      console.error('Failed to claim reward:', error.message);
    }
  }
};
```

## Future Enhancements

- [ ] **Batch Claims**: Allow claiming multiple rewards at once
- [ ] **Claim Expiration**: Add expiration dates for claims
- [ ] **Reward Tiers**: Implement reward tiers and progression
- [ ] **Analytics**: Add detailed analytics and reporting
- [ ] **Webhooks**: Notify external systems of successful claims
- [ ] **Caching**: Implement Redis caching for frequently accessed data
