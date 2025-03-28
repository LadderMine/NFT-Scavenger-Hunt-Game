import { Controller, Get, Post, Body, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import type { RewardsService } from "../services/rewards.service"
import type { CreateRewardDto } from "../dto/create-reward.dto"
import type { QueryRewardsDto } from "../dto/query-rewards.dto"
import { Reward } from "../entities/reward.entity"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard" // Assuming you have an auth module

@ApiTags("rewards")
@Controller("rewards")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiResponse({ status: 201, description: 'The reward has been successfully created.', type: Reward })
  async create(@Body() createRewardDto: CreateRewardDto): Promise<Reward> {
    return this.rewardsService.create(createRewardDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rewards with optional filtering' })
  @ApiResponse({ status: 200, description: 'Return all rewards that match the criteria.', type: [Reward] })
  async findAll(@Query() queryParams: QueryRewardsDto): Promise<Reward[]> {
    return this.rewardsService.findAll(queryParams);
  }
}

