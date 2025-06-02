import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ConfigService } from "@nestjs/config"
import type { Repository } from "typeorm"
import { InviteFriendsService } from "../invite-friends.service"
import { Invite } from "../entities/invite.entity"
import { type CreateInviteDto, InviteMethod } from "../dto/create-invite.dto"
import { InviteStatus } from "../enums/invite-status.enum"
import { BadRequestException, NotFoundException } from "@nestjs/common"

// Mock repository
const mockRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(true),
  })),
})

// Mock config service
const mockConfigService = () => ({
  get: jest.fn((key: string) => {
    // Return mock values for config keys
    const configs = {
      APP_URL: "http://test.com",
      SMTP_HOST: "smtp.test.com",
      SMTP_PORT: 587,
      SMTP_USER: "test@test.com",
      SMTP_PASS: "password",
      EMAIL_FROM: "noreply@test.com",
      TWILIO_ACCOUNT_SID: "test_sid",
      TWILIO_AUTH_TOKEN: "test_token",
      TWILIO_PHONE_NUMBER: "+15551234567",
    }
    return configs[key]
  }),
})

describe("InviteFriendsService", () => {
  let service: InviteFriendsService
  let repository: Repository<Invite>
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteFriendsService,
        {
          provide: getRepositoryToken(Invite),
          useFactory: mockRepository,
        },
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<InviteFriendsService>(InviteFriendsService)
    repository = module.get<Repository<Invite>>(getRepositoryToken(Invite))
    configService = module.get<ConfigService>(ConfigService)

    // Mock the email and SMS sending methods
    jest.spyOn(service as any, "sendEmail").mockResolvedValue(undefined)
    jest.spyOn(service as any, "sendSms").mockResolvedValue(undefined)
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("createInvite", () => {
    it("should create an email invite successfully", async () => {
      const createInviteDto: CreateInviteDto = {
        email: "test@example.com",
        method: InviteMethod.EMAIL,
      }

      const userId = "user123"

      const mockInvite = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: "token123",
        status: InviteStatus.PENDING,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        invitedById: userId,
        updatedAt: new Date(),
      }

      jest.spyOn(repository, "create").mockReturnValue(mockInvite as any)
      jest.spyOn(repository, "save").mockResolvedValue(mockInvite as any)
      jest.spyOn(service as any, "generateInviteToken").mockReturnValue("token123")

      const result = await service.createInvite(createInviteDto, userId)

      expect(repository.create).toHaveBeenCalled()
      expect(repository.save).toHaveBeenCalled()
      expect(result.id).toEqual(mockInvite.id)
      expect(result.inviteToken).toEqual(mockInvite.inviteToken)
      expect(result.shareableLink).toContain(mockInvite.inviteToken)
    })

    it("should throw BadRequestException when email is missing for email method", async () => {
      const createInviteDto: CreateInviteDto = {
        method: InviteMethod.EMAIL,
      }

      await expect(service.createInvite(createInviteDto, "user123")).rejects.toThrow(BadRequestException)
    })
  })

  describe("acceptInvite", () => {
    it("should accept a valid invite", async () => {
      const mockInvite = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: "token123",
        status: InviteStatus.PENDING,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        invitedById: "user123",
        updatedAt: new Date(),
      }

      jest.spyOn(repository, "findOne").mockResolvedValue(mockInvite as any)
      jest.spyOn(repository, "save").mockImplementation(async (invite) => invite as any)

      const result = await service.acceptInvite("token123")

      expect(repository.findOne).toHaveBeenCalledWith({ where: { inviteToken: "token123" } })
      expect(repository.save).toHaveBeenCalled()
      expect(result.status).toEqual(InviteStatus.ACCEPTED)
    })

    it("should throw NotFoundException when invite not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null)

      await expect(service.acceptInvite("nonexistent")).rejects.toThrow(NotFoundException)
    })

    it("should throw BadRequestException when invite already accepted", async () => {
      const mockInvite = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: "token123",
        status: InviteStatus.ACCEPTED,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        invitedById: "user123",
        updatedAt: new Date(),
      }

      jest.spyOn(repository, "findOne").mockResolvedValue(mockInvite as any)

      await expect(service.acceptInvite("token123")).rejects.toThrow(BadRequestException)
    })

    it("should throw BadRequestException when invite expired", async () => {
      const mockInvite = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: "token123",
        status: InviteStatus.PENDING,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Expired date
        invitedById: "user123",
        updatedAt: new Date(),
      }

      jest.spyOn(repository, "findOne").mockResolvedValue(mockInvite as any)
      jest.spyOn(repository, "save").mockImplementation(async (invite) => invite as any)

      await expect(service.acceptInvite("token123")).rejects.toThrow(BadRequestException)
      expect(repository.save).toHaveBeenCalled()
      expect((await repository.save).mock.calls[0][0].status).toEqual(InviteStatus.EXPIRED)
    })
  })

  describe("getInviteByToken", () => {
    it("should return invite details for valid token", async () => {
      const mockInvite = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: "token123",
        status: InviteStatus.PENDING,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        invitedById: "user123",
        updatedAt: new Date(),
      }

      jest.spyOn(repository, "findOne").mockResolvedValue(mockInvite as any)

      const result = await service.getInviteByToken("token123")

      expect(repository.findOne).toHaveBeenCalledWith({ where: { inviteToken: "token123" } })
      expect(result.id).toEqual(mockInvite.id)
      expect(result.inviteToken).toEqual(mockInvite.inviteToken)
    })

    it("should throw NotFoundException when invite not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null)

      await expect(service.getInviteByToken("nonexistent")).rejects.toThrow(NotFoundException)
    })

    it("should update status to EXPIRED if invite has expired", async () => {
      const mockInvite = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: "token123",
        status: InviteStatus.PENDING,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Expired date
        invitedById: "user123",
        updatedAt: new Date(),
      }

      jest.spyOn(repository, "findOne").mockResolvedValue(mockInvite as any)
      jest.spyOn(repository, "save").mockImplementation(async (invite) => invite as any)

      const result = await service.getInviteByToken("token123")

      expect(repository.save).toHaveBeenCalled()
      expect(result.status).toEqual(InviteStatus.EXPIRED)
    })
  })

  describe("expireOldInvites", () => {
    it("should update expired invites", async () => {
      const queryBuilder = repository.createQueryBuilder()

      await service.expireOldInvites()

      expect(queryBuilder.update).toHaveBeenCalled()
      expect(queryBuilder.set).toHaveBeenCalledWith({ status: InviteStatus.EXPIRED })
      expect(queryBuilder.where).toHaveBeenCalled()
      expect(queryBuilder.andWhere).toHaveBeenCalled()
      expect(queryBuilder.execute).toHaveBeenCalled()
    })
  })
})

