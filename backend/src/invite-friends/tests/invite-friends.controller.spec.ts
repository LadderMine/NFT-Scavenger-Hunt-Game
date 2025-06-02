import { Test, type TestingModule } from "@nestjs/testing"
import { InviteFriendsController } from "../invite-friends.controller"
import { InviteFriendsService } from "../invite-friends.service"
import { type CreateInviteDto, InviteMethod } from "../dto/create-invite.dto"
import type { InviteResponseDto } from "../dto/invite-response.dto"
import { InviteStatus } from "../enums/invite-status.enum"

// Mock service
const mockInviteFriendsService = {
  createInvite: jest.fn(),
  acceptInvite: jest.fn(),
  getInviteByToken: jest.fn(),
}

describe("InviteFriendsController", () => {
  let controller: InviteFriendsController
  let service: InviteFriendsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InviteFriendsController],
      providers: [
        {
          provide: InviteFriendsService,
          useValue: mockInviteFriendsService,
        },
      ],
    }).compile()

    controller = module.get<InviteFriendsController>(InviteFriendsController)
    service = module.get<InviteFriendsService>(InviteFriendsService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("sendInvite", () => {
    it("should create an invitation", async () => {
      const createInviteDto: CreateInviteDto = {
        email: "test@example.com",
        method: InviteMethod.EMAIL,
      }

      const mockRequest = {
        user: {
          id: "user123",
        },
      }

      const mockResponse: InviteResponseDto = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: "token123",
        status: InviteStatus.PENDING,
        createdAt: new Date(),
        expiresAt: new Date(),
        shareableLink: "http://test.com/invite/accept/token123",
      }

      jest.spyOn(service, "createInvite").mockResolvedValue(mockResponse)

      const result = await controller.sendInvite(createInviteDto, mockRequest)

      expect(service.createInvite).toHaveBeenCalledWith(createInviteDto, "user123")
      expect(result).toEqual(mockResponse)
    })
  })

  describe("acceptInvite", () => {
    it("should accept an invitation", async () => {
      const token = "token123"

      const mockResponse: InviteResponseDto = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: token,
        status: InviteStatus.ACCEPTED,
        createdAt: new Date(),
        expiresAt: new Date(),
        shareableLink: "http://test.com/invite/accept/token123",
      }

      jest.spyOn(service, "acceptInvite").mockResolvedValue(mockResponse)

      const result = await controller.acceptInvite(token)

      expect(service.acceptInvite).toHaveBeenCalledWith(token)
      expect(result).toEqual(mockResponse)
    })
  })

  describe("getInvite", () => {
    it("should get invitation details", async () => {
      const token = "token123"

      const mockResponse: InviteResponseDto = {
        id: "invite123",
        emailOrPhone: "test@example.com",
        inviteToken: token,
        status: InviteStatus.PENDING,
        createdAt: new Date(),
        expiresAt: new Date(),
        shareableLink: "http://test.com/invite/accept/token123",
      }

      jest.spyOn(service, "getInviteByToken").mockResolvedValue(mockResponse)

      const result = await controller.getInvite(token)

      expect(service.getInviteByToken).toHaveBeenCalledWith(token)
      expect(result).toEqual(mockResponse)
    })
  })
})

