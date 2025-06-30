import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RewardsModule } from '../src/rewards/rewards.module';
import { Reward, RewardType } from '../src/rewards/entities/reward.entity';
import { RewardClaim } from '../src/rewards/entities/reward-claim.entity';
import { ValidationPipe } from '@nestjs/common';

describe('RewardsModule (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST') || 'localhost',
            port: configService.get('DB_PORT') || 5432,
            username: configService.get('DB_USERNAME') || 'test',
            password: configService.get('DB_PASSWORD') || 'test',
            database: configService.get('DB_DATABASE') || 'test_db',
            entities: [Reward, RewardClaim],
            synchronize: true,
            dropSchema: true,
          }),
        }),
        RewardsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    const rewardRepository = moduleFixture.get('RewardRepository');
    const claimRepository = moduleFixture.get('RewardClaimRepository');

    if (rewardRepository) {
      await rewardRepository.clear();
    }
    if (claimRepository) {
      await claimRepository.clear();
    }
  });

  describe('/rewards (POST)', () => {
    it('should create a new reward', () => {
      const createRewardDto = {
        name: 'StarkNet Beginner Badge',
        description: 'Awarded for completing the Easy level challenges',
        type: RewardType.BADGE,
        challengeId: 'challenge-easy-001',
        metadata: {
          imageUrl: 'https://example.com/badge.png',
          rarity: 'common',
        },
        isActive: true,
        maxClaims: 1000,
      };

      return request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe(createRewardDto.name);
          expect(res.body.type).toBe(createRewardDto.type);
          expect(res.body.challengeId).toBe(createRewardDto.challengeId);
          expect(res.body.currentClaims).toBe(0);
          expect(res.body.isActive).toBe(true);
        });
    });

    it('should validate required fields', () => {
      const invalidRewardDto = {
        name: '', // Empty name
        description: 'Test description',
        type: 'INVALID_TYPE', // Invalid type
      };

      return request(app.getHttpServer())
        .post('/rewards')
        .send(invalidRewardDto)
        .expect(400);
    });
  });

  describe('/rewards (GET)', () => {
    it('should return all active rewards', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-001',
        isActive: true,
      };

      await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      // Then get all rewards
      return request(app.getHttpServer())
        .get('/rewards')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0].isActive).toBe(true);
        });
    });
  });

  describe('/rewards/:id (GET)', () => {
    it('should return a reward by ID', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-002',
        isActive: true,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      const rewardId = createResponse.body.id;

      // Then get the reward by ID
      return request(app.getHttpServer())
        .get(`/rewards/${rewardId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(rewardId);
          expect(res.body.name).toBe(createRewardDto.name);
        });
    });

    it('should return 404 for non-existent reward', () => {
      return request(app.getHttpServer())
        .get('/rewards/non-existent-id')
        .expect(404);
    });
  });

  describe('/rewards/challenge/:challengeId (GET)', () => {
    it('should return a reward by challenge ID', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-003',
        isActive: true,
      };

      await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      // Then get the reward by challenge ID
      return request(app.getHttpServer())
        .get('/rewards/challenge/challenge-test-003')
        .expect(200)
        .expect((res) => {
          expect(res.body.challengeId).toBe('challenge-test-003');
          expect(res.body.name).toBe(createRewardDto.name);
        });
    });

    it('should return 404 for non-existent challenge', () => {
      return request(app.getHttpServer())
        .get('/rewards/challenge/non-existent-challenge')
        .expect(404);
    });
  });

  describe('/rewards/claim (POST)', () => {
    it('should successfully claim a reward', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-004',
        isActive: true,
        maxClaims: 100,
      };

      await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      // Then claim the reward
      const claimRewardDto = {
        userId: 'user-001',
        challengeId: 'challenge-test-004',
      };

      return request(app.getHttpServer())
        .post('/rewards/claim')
        .send(claimRewardDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.userId).toBe(claimRewardDto.userId);
          expect(res.body.challengeId).toBe(claimRewardDto.challengeId);
          expect(res.body.status).toBe('claimed');
          expect(res.body).toHaveProperty('claimDate');
        });
    });

    it('should prevent duplicate claims', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-005',
        isActive: true,
      };

      await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      const claimRewardDto = {
        userId: 'user-002',
        challengeId: 'challenge-test-005',
      };

      // First claim
      await request(app.getHttpServer())
        .post('/rewards/claim')
        .send(claimRewardDto)
        .expect(201);

      // Second claim should fail
      return request(app.getHttpServer())
        .post('/rewards/claim')
        .send(claimRewardDto)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toBe('Reward already claimed');
        });
    });

    it('should validate claim request data', () => {
      const invalidClaimDto = {
        userId: '', // Empty userId
        challengeId: 'challenge-test-006',
      };

      return request(app.getHttpServer())
        .post('/rewards/claim')
        .send(invalidClaimDto)
        .expect(400);
    });

    it('should return 404 when no active reward found for challenge', () => {
      const claimRewardDto = {
        userId: 'user-003',
        challengeId: 'non-existent-challenge',
      };

      return request(app.getHttpServer())
        .post('/rewards/claim')
        .send(claimRewardDto)
        .expect(404);
    });
  });

  describe('/rewards/user/:userId/claims (GET)', () => {
    it('should return all claims for a user', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-007',
        isActive: true,
      };

      await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      // Then claim the reward
      const claimRewardDto = {
        userId: 'user-004',
        challengeId: 'challenge-test-007',
      };

      await request(app.getHttpServer())
        .post('/rewards/claim')
        .send(claimRewardDto)
        .expect(201);

      // Then get user claims
      return request(app.getHttpServer())
        .get('/rewards/user/user-004/claims')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].userId).toBe('user-004');
        });
    });
  });

  describe('/rewards/:id/stats (GET)', () => {
    it('should return reward statistics', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-008',
        isActive: true,
        maxClaims: 100,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      const rewardId = createResponse.body.id;

      // Then get reward stats
      return request(app.getHttpServer())
        .get(`/rewards/${rewardId}/stats`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('reward');
          expect(res.body).toHaveProperty('totalClaims');
          expect(res.body).toHaveProperty('availableClaims');
          expect(res.body).toHaveProperty('isAvailable');
          expect(res.body.reward.id).toBe(rewardId);
          expect(res.body.totalClaims).toBe(0);
          expect(res.body.isAvailable).toBe(true);
        });
    });
  });

  describe('/rewards/:id (DELETE)', () => {
    it('should soft delete a reward', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-009',
        isActive: true,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      const rewardId = createResponse.body.id;

      // Then delete the reward
      return request(app.getHttpServer())
        .delete(`/rewards/${rewardId}`)
        .expect(204);
    });

    it('should not allow deletion of reward with existing claims', async () => {
      // First create a reward
      const createRewardDto = {
        name: 'Test Reward',
        description: 'Test Description',
        type: RewardType.BADGE,
        challengeId: 'challenge-test-010',
        isActive: true,
      };

      const createResponse = await request(app.getHttpServer())
        .post('/rewards')
        .send(createRewardDto)
        .expect(201);

      const rewardId = createResponse.body.id;

      // Then claim the reward
      const claimRewardDto = {
        userId: 'user-005',
        challengeId: 'challenge-test-010',
      };

      await request(app.getHttpServer())
        .post('/rewards/claim')
        .send(claimRewardDto)
        .expect(201);

      // Then try to delete the reward (should fail)
      return request(app.getHttpServer())
        .delete(`/rewards/${rewardId}`)
        .expect(400);
    });
  });
});
