import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode } from "@nestjs/common"
import type { ReferralService } from "../services/referral.service"
import type { CreateReferralCodeDto } from "../dto/create-referral-code.dto"
import type { CreateInviteDto } from "../dto/create-invite.dto"
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // Adjust path as needed

@Controller("referrals")
// @UseGuards(JwtAuthGuard) // Uncomment when you have auth guards
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('codes')
  @HttpCode(HttpStatus.CREATED)
  async createReferralCode(@Body() createDto: CreateReferralCodeDto) {
    const req = { user: { id: 'user-id-placeholder' } }; // Mock request object for demonstration
    const userId = req.user.id; // Uncomment when using auth
    // const userId = 'user-id-placeholder'; // Remove this line when using auth
    return this.referralService.createReferralCode(userId, createDto);
  }

  @Get("codes/my")
  async getMyReferralCode() {
    const req = { user: { id: "user-id-placeholder" } } // Mock request object for demonstration
    const userId = req.user.id // Uncomment when using auth
    // const userId = 'user-id-placeholder'; // Remove this line when using auth
    return this.referralService.getUserReferralCode(userId)
  }

  @Post('invites')
  @HttpCode(HttpStatus.CREATED)
  async sendInvite(@Body() createDto: CreateInviteDto) {
    return this.referralService.sendInvite(createDto);
  }

  @Get("stats")
  async getMyStats() {
    const req = { user: { id: "user-id-placeholder" } } // Mock request object for demonstration
    const userId = req.user.id // Uncomment when using auth
    // const userId = 'user-id-placeholder'; // Remove this line when using auth
    return this.referralService.getUserReferralStats(userId)
  }

  @Get("history")
  async getReferralHistory() {
    const req = { user: { id: "user-id-placeholder" } } // Mock request object for demonstration
    const userId = req.user.id // Uncomment when using auth
    // const userId = 'user-id-placeholder'; // Remove this line when using auth
    return this.referralService.getReferralHistory(userId)
  }

  @Post('invites/:id/complete')
  @HttpCode(HttpStatus.OK)
  async completeInvite(@Param('id') inviteId: string) {
    return this.referralService.processCompletedInvite(inviteId);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async handleRegistration(@Body() body: { email: string; userId: string }) {
    return this.referralService.handleUserRegistration(body.email, body.userId);
  }
}
