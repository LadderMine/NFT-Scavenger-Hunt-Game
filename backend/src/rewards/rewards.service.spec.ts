import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardsService } from './rewards.service';
import { Reward, RewardType } from './entities/reward.entity';
import { RewardClaim } from './entities/reward-claim.entity';
import { CreateRewardDto } from './dto/create-reward.dto';
import { ClaimRewardDto } from './dto/claim-reward.dto';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('RewardsService', () => {
  let service: RewardsService;
  let rewardRepository: Repository<Reward>;
  let rewardClaimRepository: Repository<RewardClaim>;

  const mockRewardRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  };

  const mockRewardClaimRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: getRepositoryToken(Reward),
          useValue: mockRewardRepository,
        },
        {
          provide: getRepositoryToken(RewardClaim),
          useValue: mockRewardClaimRepository,
        },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    rewardRepository = module.get<Repository<Reward>>(getRepositoryToken(Reward));
    rewardClaimRepository = module.get<Repository<RewardClaim>>(getRepositoryToken(RewardClaim));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReward', () => {
    it('should create a new reward', async () => {
      const createRewardDto: CreateRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-001',
        metadata: { imageUrl: 'test.jpg' },
        isActive: true,
        maxClaims: 100,
      };

      const expectedReward = {
        id: 'reward-001',
        ...createRewardDto,
        currentClaims: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRewardRepository.create.mockReturnValue(expectedReward);
      mockRewardRepository.save.mockResolvedValue(expectedReward);

      const result = await service.createReward(createRewardDto);

      expect(mockRewardRepository.create).toHaveBeenCalledWith({
        ...createRewardDto,
        currentClaims: 0,
      });
      expect(mockRewardRepository.save).toHaveBeenCalledWith(expectedReward);
      expect(result).toEqual(expectedReward);
    });
  });

  describe('getAllRewards', () => {
    it('should return all active rewards', async () => {
      const expectedRewards = [
        { id: 'reward-001', name: 'Reward 1', isActive: true },
        { id: 'reward-002', name: 'Reward 2', isActive: true },
      ];

      mockRewardRepository.find.mockResolvedValue(expectedRewards);

      const result = await service.getAllRewards();

      expect(mockRewardRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        relations: ['claims'],
      });
      expect(result).toEqual(expectedRewards);
    });
  });

  describe('getRewardById', () => {
    it('should return a reward by ID', async () => {
      const expectedReward = { id: 'reward-001', name: 'Test Reward' };

      mockRewardRepository.findOne.mockResolvedValue(expectedReward);

      const result = await service.getRewardById('reward-001');

      expect(mockRewardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'reward-001' },
        relations: ['claims'],
      });
      expect(result).toEqual(expectedReward);
    });

    it('should throw NotFoundException when reward not found', async () => {
      mockRewardRepository.findOne.mockResolvedValue(null);

      await expect(service.getRewardById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRewardByChallengeId', () => {
    it('should return a reward by challenge ID', async () => {
      const expectedReward = { id: 'reward-001', challengeId: 'challenge-001' };

      mockRewardRepository.findOne.mockResolvedValue(expectedReward);

      const result = await service.getRewardByChallengeId('challenge-001');

      expect(mockRewardRepository.findOne).toHaveBeenCalledWith({
        where: { challengeId: 'challenge-001', isActive: true },
        relations: ['claims'],
      });
      expect(result).toEqual(expectedReward);
    });

    it('should throw NotFoundException when no active reward found for challenge', async () => {
      mockRewardRepository.findOne.mockResolvedValue(null);

      await expect(service.getRewardByChallengeId('challenge-001')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('hasUserClaimedReward', () => {
    it('should return true if user has claimed reward', async () => {
      const existingClaim = { id: 'claim-001', userId: 'user-001', challengeId: 'challenge-001' };

      mockRewardClaimRepository.findOne.mockResolvedValue(existingClaim);

      const result = await service.hasUserClaimedReward('user-001', 'challenge-001');

      expect(mockRewardClaimRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-001', challengeId: 'challenge-001' },
      });
      expect(result).toBe(true);
    });

    it('should return false if user has not claimed reward', async () => {
      mockRewardClaimRepository.findOne.mockResolvedValue(null);

      const result = await service.hasUserClaimedReward('user-001', 'challenge-001');

      expect(result).toBe(false);
    });
  });

  describe('claimReward', () => {
    const claimRewardDto: ClaimRewardDto = {
      userId: 'user-001',
      challengeId: 'challenge-001',
    };

    const mockReward = {
      id: 'reward-001',
      challengeId: 'challenge-001',
      currentClaims: 5,
      maxClaims: 100,
    };

    it('should successfully claim a reward', async () => {
      const expectedClaim = {
        id: 'claim-001',
        userId: 'user-001',
        rewardId: 'reward-001',
        challengeId: 'challenge-001',
        status: 'claimed',
        claimDate: new Date(),
      };

      mockRewardClaimRepository.findOne.mockResolvedValue(null); // No existing claim
      mockRewardRepository.findOne.mockResolvedValue(mockReward); // Reward exists
      mockRewardClaimRepository.create.mockReturnValue(expectedClaim);
      mockRewardClaimRepository.save.mockResolvedValue(expectedClaim);
      mockRewardRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.claimReward(claimRewardDto);

      expect(mockRewardClaimRepository.create).toHaveBeenCalledWith({
        userId: 'user-001',
        rewardId: 'reward-001',
        challengeId: 'challenge-001',
        status: 'claimed',
      });
      expect(mockRewardRepository.update).toHaveBeenCalledWith('reward-001', {
        currentClaims: 6,
      });
      expect(result).toEqual(expectedClaim);
    });

    it('should throw ConflictException when reward already claimed', async () => {
      const existingClaim = { id: 'claim-001' };

      mockRewardClaimRepository.findOne.mockResolvedValue(existingClaim);

      await expect(service.claimReward(claimRewardDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRewardClaimRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-001', challengeId: 'challenge-001' },
      });
    });

    it('should throw BadRequestException when reward limit reached', async () => {
      const limitedReward = { ...mockReward, currentClaims: 100, maxClaims: 100 };

      mockRewardClaimRepository.findOne.mockResolvedValue(null);
      mockRewardRepository.findOne.mockResolvedValue(limitedReward);

      await expect(service.claimReward(claimRewardDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUserClaims', () => {
    it('should return all claims for a user', async () => {
      const expectedClaims = [
        { id: 'claim-001', userId: 'user-001' },
        { id: 'claim-002', userId: 'user-001' },
      ];

      mockRewardClaimRepository.find.mockResolvedValue(expectedClaims);

      const result = await service.getUserClaims('user-001');

      expect(mockRewardClaimRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-001' },
        relations: ['reward'],
        order: { claimDate: 'DESC' },
      });
      expect(result).toEqual(expectedClaims);
    });
  });

  describe('getClaimById', () => {
    it('should return a claim by ID', async () => {
      const expectedClaim = { id: 'claim-001', userId: 'user-001' };

      mockRewardClaimRepository.findOne.mockResolvedValue(expectedClaim);

      const result = await service.getClaimById('claim-001');

      expect(mockRewardClaimRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'claim-001' },
        relations: ['reward'],
      });
      expect(result).toEqual(expectedClaim);
    });

    it('should throw NotFoundException when claim not found', async () => {
      mockRewardClaimRepository.findOne.mockResolvedValue(null);

      await expect(service.getClaimById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRewardStats', () => {
    it('should return reward statistics', async () => {
      const mockReward = { id: 'reward-001', maxClaims: 100 };
      const totalClaims = 25;

      mockRewardRepository.findOne.mockResolvedValue(mockReward);
      mockRewardClaimRepository.count.mockResolvedValue(totalClaims);

      const result = await service.getRewardStats('reward-001');

      expect(mockRewardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'reward-001' },
        relations: ['claims'],
      });
      expect(mockRewardClaimRepository.count).toHaveBeenCalledWith({
        where: { rewardId: 'reward-001' },
      });
      expect(result).toEqual({
        reward: mockReward,
        totalClaims,
        availableClaims: 75,
        isAvailable: true,
      });
    });
  });

  describe('deleteReward', () => {
    it('should soft delete a reward when no claims exist', async () => {
      const mockReward = { id: 'reward-001' };

      mockRewardRepository.findOne.mockResolvedValue(mockReward);
      mockRewardClaimRepository.count.mockResolvedValue(0);
      mockRewardRepository.update.mockResolvedValue({ affected: 1 });

      await service.deleteReward('reward-001');

      expect(mockRewardRepository.update).toHaveBeenCalledWith('reward-001', {
        isActive: false,
      });
    });

    it('should throw BadRequestException when reward has existing claims', async () => {
      const mockReward = { id: 'reward-001' };

      mockRewardRepository.findOne.mockResolvedValue(mockReward);
      mockRewardClaimRepository.count.mockResolvedValue(5);

      await expect(service.deleteReward('reward-001')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
}); 