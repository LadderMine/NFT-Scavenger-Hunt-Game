import { Controller, Post, Body, Get, Param, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common"
import type { InviteFriendsService } from "./invite-friends.service"
import type { CreateInviteDto } from "./dto/create-invite.dto"
import { InviteResponseDto } from "./dto/invite-response.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard" // Adjust import path as needed

@ApiTags("invites")
@Controller("invite")
export class InviteFriendsController {
  constructor(private readonly inviteFriendsService: InviteFriendsService) {}

  @Post("send")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Send an invitation to a friend" })
  @ApiResponse({ status: 201, description: "Invitation created successfully", type: InviteResponseDto })
  @ApiResponse({ status: 400, description: "Bad request" })
  @HttpCode(HttpStatus.CREATED)
  async sendInvite(@Body() createInviteDto: CreateInviteDto, @Req() req: any): Promise<InviteResponseDto> {
    // Extract user ID from the request (assuming it's added by the auth guard)
    const userId = req.user.id
    return this.inviteFriendsService.createInvite(createInviteDto, userId)
  }

  @Get('accept/:token')
  @ApiOperation({ summary: 'Accept an invitation using a token' })
  @ApiResponse({ status: 200, description: 'Invitation accepted successfully', type: InviteResponseDto })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({ status: 400, description: 'Invitation expired or already accepted' })
  async acceptInvite(@Param('token') token: string): Promise<InviteResponseDto> {
    return this.inviteFriendsService.acceptInvite(token);
  }

  @Get(':token')
  @ApiOperation({ summary: 'Get invitation details by token' })
  @ApiResponse({ status: 200, description: 'Invitation details retrieved successfully', type: InviteResponseDto })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async getInvite(@Param('token') token: string): Promise<InviteResponseDto> {
    return this.inviteFriendsService.getInviteByToken(token);
  }
}

