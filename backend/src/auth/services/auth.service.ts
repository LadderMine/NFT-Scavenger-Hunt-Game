import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from "@nestjs/common"
import { Repository } from "typeorm"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { User } from "../entities/user.entity"
import { RegisterDto } from "../dto/register.dto"
import { AuthResponseDto } from "../dto/auth-response.dto"
import { LoginDto } from "../dto/login.dto"
import { InjectRepository } from "@nestjs/typeorm"

export interface JwtPayload {
  sub: string // user id
  email: string
  name: string
  username?: string
  iat?: number
  exp?: number
}

@Injectable()
export class AuthService {

  constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  private readonly jwtService: JwtService,
  private readonly configService: ConfigService,
) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { name, username, email, password } = registerDto

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: email.toLowerCase() },
      })

      if (existingUser) {
        throw new ConflictException("User with this email already exists")
      }

      // Create new user
      const user = this.userRepository.create({
        name: name.trim(),
        username: username.trim(),
        email: email.toLowerCase(),
        password, // Will be hashed by the entity hook
      })

      const savedUser = await this.userRepository.save(user)

      // Generate JWT token
      const payload: JwtPayload = {
        sub: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
      }

      const accessToken = this.jwtService.sign(payload)
      const expiresIn = this.getTokenExpirationTime()

      return {
        accessToken,
        tokenType: "Bearer",
        expiresIn,
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          createdAt: savedUser.createdAt,
        },
      }
    } catch (error) {
      console.error("Registration error:", error) // Add logging

      if (error instanceof ConflictException) {
        throw error
      }

      if (error.code === "23505") {
        // PostgreSQL unique violation
        throw new ConflictException("User with this email already exists")
      }

      throw new BadRequestException(`Failed to create user account: ${error.message}`)
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto

    try {
      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email: email.toLowerCase() },
      })

      if (!user) {
        throw new UnauthorizedException("Invalid email or password")
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException("Account has been deactivated")
      }

      // Validate password
      const isPasswordValid = await user.validatePassword(password)
      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid email or password")
      }

      // Update last login time
      await this.userRepository.update(user.id, {
        lastLoginAt: new Date(),
      })

      // Generate JWT token
      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      }

      const accessToken = this.jwtService.sign(payload)
      const expiresIn = this.getTokenExpirationTime()

      return {
        accessToken,
        tokenType: "Bearer",
        expiresIn,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      }
    } catch (error) {
      console.error("Login error:", error) // Add logging

      if (error instanceof UnauthorizedException) {
        throw error
      }

      throw new BadRequestException(`Login failed: ${error.message}`)
    }
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or inactive")
    }

    return user
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    })

    if (!user) {
      throw new UnauthorizedException("User not found")
    }

    return user
  }

  private getTokenExpirationTime(): number {
    const expiresIn = this.configService.get("JWT_EXPIRES_IN") || "15m"

    // Convert time string to seconds
    if (typeof expiresIn === "string") {
      const timeValue = Number.parseInt(expiresIn)
      const timeUnit = expiresIn.slice(-1)

      switch (timeUnit) {
        case "s":
          return timeValue
        case "m":
          return timeValue * 60
        case "h":
          return timeValue * 60 * 60
        case "d":
          return timeValue * 24 * 60 * 60
        default:
          return 900 // 15 minutes default
      }
    }

    return typeof expiresIn === "number" ? expiresIn : 900
  }
}
