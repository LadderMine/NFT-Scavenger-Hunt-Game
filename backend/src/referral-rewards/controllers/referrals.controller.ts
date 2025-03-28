import { Controller, Get, Post, Body, Param, Patch, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { ReferralsService } from "../services/referrals.service"
import type { CreateReferralDto } from "../dto/create-referral.dto"
import type { UpdateReferralDto } from "../dto/update-referral.dto"
import { Referral } from "../entities/referral.entity"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard" // Assuming you have an auth module

@ApiTags("referrals")
@Controller("referrals")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new referral' })
  @ApiResponse({ status: 201, description: 'The referral has been successfully created.', type: Referral })
  async create(@Body() createReferralDto: CreateReferralDto): Promise<Referral> {
    return this.referralsService.create(createReferralDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a referral by ID' })
  @ApiResponse({ status: 200, description: 'Return the referral.', type: Referral })
  @ApiResponse({ status: 404, description: 'Referral not found.' })
  async findOne(@Param('id') id: string): Promise<Referral> {
    return this.referralsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a referral status" })
  @ApiResponse({ status: 200, description: "The referral has been successfully updated.", type: Referral })
  @ApiResponse({ status: 404, description: "Referral not found." })
  async update(@Param('id') id: string, @Body() updateReferralDto: UpdateReferralDto): Promise<Referral> {
    return this.referralsService.update(id, updateReferralDto)
  }
}

