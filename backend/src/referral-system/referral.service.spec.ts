import type { Repository } from "typeorm"
import { ReferralService } from "./referral.service"
import { ReferralRewardService } from "./referral-reward.service"
import { ReferralCode } from "./entities/referral-code.entity"
import { Referral, ReferralStatus } from "./entities/referral.entity"

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

const createMockRepository = <T>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
});

describe('ReferralService', () => {
  let service: ReferralService;
  let referralCodeRepository: MockRepository<ReferralCode>;
  let referralRepository: MockRepository<Referral>;
  let referralRewardService: Partial<ReferralRewardService>;

  beforeEach(async () => {
    referralRewardService = {
      processReferralReward: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferralService,
        {
          provide: getRepositoryToken(ReferralCode),
          useValue: createMockRepository<ReferralCode>(),
        },
        {
          provide: getRepositoryToken(Referral),
          useValue: createMockRepository<Referral>(),
        },
        {
          provide: ReferralRewardService,
          useValue: referralRewardService,
        },
      ],
    }).compile();

    service = module.get<ReferralService>(ReferralService);
    referralCodeRepository = module.get(getRepositoryToken(ReferralCode));
    referralRepository = module.get(getRepositoryToken(Referral));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReferralCode', () => {
    it('should return existing code if user already has an active code', async () => {
      const userId = 'user-123';
      const existingCode = { id: 'code-123', code: 'ABC123', userId, active: true };
      
      referralCodeRepository.findOne.mockResolvedValue(existingCode);
      
      const result = await service.createReferralCode({ userId });
      
      expect(referralCodeRepository.findOne).toHaveBeenCalledWith({
        where: { userId, active: true },
      });
      expect(result).toEqual(existingCode);
      expect(referralCodeRepository.create).not.toHaveBeenCalled();
      expect(referralCodeRepository.save).not.toHaveBeenCalled();
    });

    it('should create a new code if user does not have an active code', async () => {
      const userId = 'user-123';
      const newCode = { id: 'code-456', code: 'XYZ789', userId, active: true };
      
      referralCodeRepository.findOne.mockResolvedValueOnce(null);
      referralCodeRepository.findOne.mockResolvedValueOnce(null); // For code uniqueness check
      referralCodeRepository.create.mockReturnValue(newCode);
      referralCodeRepository.save.mockResolvedValue(newCode);
      
      const result = await service.createReferralCode({ userId });
      
      expect(referralCodeRepository.findOne).toHaveBeenCalledWith({
        where: { userId, active: true },
      });
      expect(referralCodeRepository.create).toHaveBeenCalled();
      expect(referralCodeRepository.save).toHaveBeenCalledWith(newCode);
      expect(result).toEqual(newCode);
    });
  });

  describe('getReferralCodeByCode', () => {
    it('should return the referral code if it exists and is active', async () => {
      const code = 'ABC123';
      const referralCode = { id: 'code-123', code, active: true, expiresAt: null };
      
      referralCodeRepository.findOne.mockResolvedValue(referralCode);
      
      const result = await service.getReferralCodeByCode(code);
      
      expect(referralCodeRepository.findOne).toHaveBeenCalledWith({
        where: { code, active: true },
      });
      expect(result).toEqual(referralCode);
    });

    it('should throw NotFoundException if code does not exist or is inactive', async () => {
      const code = 'ABC123';
      
      referralCodeRepository.findOne.mockResolvedValue(null);
      
      await expect(service.getReferralCodeByCode(code)).rejects.toThrow(NotFoundException);
    });

    it('should deactivate and throw BadRequestException if code is expired', async () => {
      const code = 'ABC123';
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Yesterday
      
      const referralCode = { 
        id: 'code-123', 
        code, 
        active: true, 
        expiresAt: pastDate 
      };
      
      referralCodeRepository.findOne.mockResolvedValue(referralCode);
      referralCodeRepository.save.mockResolvedValue({ ...referralCode, active: false });
      
      await expect(service.getReferralCodeByCode(code)).rejects.toThrow(BadRequestException);
      expect(referralCodeRepository.save).toHaveBeenCalledWith({ ...referralCode, active: false });
    });
  });

  describe('applyReferralCode', () => {
    it('should create a new referral if all conditions are met', async () => {
      const code = 'ABC123';
      const referrerId = 'user-123';
      const referredId = 'user-456';
      
      const referralCode = { 
        id: 'code-123', 
        code, 
        userId: referrerId, 
        active: true, 
        expiresAt: null 
      };
      
      const newReferral = {
        id: 'referral-123',
        referrerId,
        referredId,
        referralCodeId: referralCode.id,
        status: ReferralStatus.PENDING,
      };
      
      referralCodeRepository.findOne.mockResolvedValue(referralCode);
      referralRepository.findOne.mockResolvedValue(null);
      referralRepository.create.mockReturnValue(newReferral);
      referralRepository.save.mockResolvedValue(newReferral);
      
      const result = await service.applyReferralCode({ code, referredId });
      
      expect(referralRepository.create).toHaveBeenCalledWith({
        referrerId,
        referredId,
        referralCodeId: referralCode.id,
        status: ReferralStatus.PENDING,
      });
      expect(referralRepository.save).toHaveBeenCalledWith(newReferral);
      expect(result).toEqual(newReferral);
    });

    it('should throw BadRequestException if user tries to refer themselves', async () => {
      const code = 'ABC123';
      const userId = 'user-123';
      
      const referralCode = { 
        id: 'code-123', 
        code, 
        userId, 
        active: true, 
        expiresAt: null 
      };
      
      referralCodeRepository.findOne.mockResolvedValue(referralCode);
      
      await expect(service.applyReferralCode({ code, referredId: userId })).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if user has already been referred', async () => {
      const code = 'ABC123';
      const referrerId = 'user-123';
      const referredId = 'user-456';
      
      const referralCode = { 
        id: 'code-123', 
        code, 
        userId: referrerId, 
        active: true, 
        expiresAt: null 
      };
      
      const existingReferral = {
        id: 'referral-123',
        referrerId: 'some-other-user',
        referredId,
      };
      
      referralCodeRepository.findOne.mockResolvedValue(referralCode);
      referralRepository.findOne.mockResolvedValue(existingReferral);
      
      await expect(service.applyReferralCode({ code, referredId })).rejects.toThrow(ConflictException);
    });
  });

  describe('updateReferralStatus', () => {
    it('should update the referral status', async () => {
      const referralId = 'referral-123';
      const referral = {
        id: referralId,
        status: ReferralStatus.PENDING,
        completedAt: null,
        rewardedAt: null,
        referralCode: { id: 'code-123' },
      };
      
      referralRepository.findOne.mockResolvedValue(referral);
      referralRepository.save.mockImplementation(data => Promise.resolve(data));
      
      const result = await service.updateReferralStatus({
        referralId,
        status: ReferralStatus.COMPLETED,
      });
      
      expect(result.status).toBe(ReferralStatus.COMPLETED);
      expect(result.completedAt).toBeDefined();
      expect(referralRepository.save).toHaveBeenCalled();
    });

    it('should process rewards when status is updated to REWARDED', async () => {
      const referralId = 'referral-123';
      const referral = {
        id: referralId,
        status: ReferralStatus.COMPLETED,
        completedAt: new Date(),
        rewardedAt: null,
        referralCode: { id: 'code-123' },
      };
      
      referralRepository.findOne.mockResolvedValue(referral);
      referralRepository.save.mockImplementation(data => Promise.resolve(data));
      
      const result = await service.updateReferralStatus({
        referralId,
        status: ReferralStatus.REWARDED,
      });
      
      expect(result.status).toBe(ReferralStatus.REWARDED);
      expect(result.rewardedAt).toBeDefined();
      expect(referralRewardService.processReferralReward).toHaveBeenCalledWith(expect.objectContaining({
        id: referralId,
        status: ReferralStatus.REWARDED,
      }));
    });

    it('should throw NotFoundException if referral does not exist', async () => {
      const referralId = 'non-existent';
      
      referralRepository.findOne.mockResolvedValue(null);
      
      await expect(service.updateReferralStatus({
        referralId,
        status: ReferralStatus.COMPLETED,
      })).rejects.toThrow(NotFoundException);
    });
  });
});

