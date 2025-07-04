import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { ConflictException, UnauthorizedException } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { User } from "../entities/user.entity"
import type { RegisterDto } from "../dto/register.dto"
import type { LoginDto } from "../dto/login.dto"
import { jest } from "@jest/globals"
import type { Repository } from "typeorm"

describe("AuthService", () => {
  let service: AuthService
  let userRepository: jest.Mocked<Repository<User>>
  let jwtService: jest.Mocked<JwtService>

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<Partial<Repository<User>>>

  const mockJwtService = {
    sign: jest.fn(),
  } as unknown as jest.Mocked<JwtService>

  const mockConfigService = {
    get: jest.fn(),
  } as unknown as jest.Mocked<ConfigService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userRepository = module.get(getRepositoryToken(User)) as jest.Mocked<Repository<User>>
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("register", () => {
    const registerDto: RegisterDto = {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePass123!",
    }

    it("should successfully register a new user", async () => {
      const mockUser = {
        id: "user-id",
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date(),
      } as User

      userRepository.findOne.mockResolvedValue(null)
      userRepository.create.mockReturnValue(mockUser)
      userRepository.save.mockResolvedValue(mockUser)
      jwtService.sign.mockReturnValue("jwt-token")
      mockConfigService.get.mockReturnValue("15m")

      const result = await service.register(registerDto)

      expect(result).toHaveProperty("accessToken", "jwt-token")
      expect(result).toHaveProperty("user")
      expect(result.user.email).toBe("john@example.com")
    })

    it("should throw ConflictException if user already exists", async () => {
      const existingUser = { id: "existing-user" } as User
      userRepository.findOne.mockResolvedValue(existingUser)

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException)
    })
  })

  describe("login", () => {
    const loginDto: LoginDto = {
      email: "john@example.com",
      password: "SecurePass123!",
    }

    it("should successfully login with valid credentials", async () => {
      const mockUser = {
        id: "user-id",
        name: "John Doe",
        email: "john@example.com",
        isActive: true,
        validatePassword: jest.fn().mockResolvedValue(true),
      } as User & { validatePassword: jest.Mock }

      userRepository.findOne.mockResolvedValue(mockUser)
      userRepository.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} })
      jwtService.sign.mockReturnValue("jwt-token")
      mockConfigService.get.mockReturnValue("15m")

      const result = await service.login(loginDto)

      expect(result).toHaveProperty("accessToken", "jwt-token")
      expect(result).toHaveProperty("user")
    })

    it("should throw UnauthorizedException for invalid credentials", async () => {
      userRepository.findOne.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it("should throw UnauthorizedException for inactive user", async () => {
      const mockUser = {
        id: "user-id",
        isActive: false,
      } as User

      userRepository.findOne.mockResolvedValue(mockUser)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })
})
