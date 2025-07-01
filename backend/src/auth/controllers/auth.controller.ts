import { Controller, Post, Get, UseGuards, Request, HttpStatus, HttpCode, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { AuthService } from "../services/auth.service"
import { Auth } from "../decorators/auth-decorator"
import { AuthType } from "../enums/auth-type.enum"
import { AuthResponseDto } from "../dto/auth-response.dto"
import { RegisterDto } from "../dto/register.dto"
import { LoginDto } from "../dto/login.dto"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { User } from "../entities/user.entity"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Auth(AuthType.None) 
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Register a new user",
    description: "Create a new user account with email and password. Password will be securely hashed.",
  })
  @ApiResponse({
    status: 201,
    description: "User successfully registered",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - validation failed",
  })
  @ApiResponse({
    status: 409,
    description: "Conflict - user already exists",
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.register(registerDto)
    } catch (error) {
      console.error("Registration controller error:", error)
      throw error
    }
  }

  @Post("login")
  @Auth(AuthType.None) // Public route
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "User login",
    description: "Authenticate user with email and password, returns JWT access token",
  })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - invalid credentials",
  })
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.login(loginDto)
    } catch (error) {
      console.error("Login controller error:", error)
      throw error
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Retrieve the profile information of the currently authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or expired token' 
  })
  async getProfile(@Request() req: { user: User }) {
    const { password, ...userProfile } = req.user;
    return {
      message: 'Profile retrieved successfully',
      user: userProfile,
    };
  }

  @Post('validate-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Validate JWT token',
    description: 'Check if the provided JWT token is valid and not expired'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token is valid' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token is invalid or expired' 
  })
  async validateToken(@Request() req: { user: User }) {
    return {
      message: 'Token is valid',
      valid: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    };
  }
}
