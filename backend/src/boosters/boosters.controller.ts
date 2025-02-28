import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common"
import type { BoostersService } from "./boosters.service"
import type { CreateBoosterDto } from "./dto/create-booster.dto"
import type { UpdateBoosterDto } from "./dto/update-booster.dto"
import type { UseBoosterDto } from "./dto/use-booster.dto"
import type { PurchaseBoosterDto } from "./dto/purchase-booster.dto"
import type { CreateBoosterBundleDto } from "./dto/create-booster-bundle.dto"
import type { PurchaseBundleDto } from "./dto/purchase-bundle.dto"
import type { GiftBoosterDto } from "./dto/gift-booster.dto"
import type { RespondToGiftDto } from "./dto/respond-to-gift.dto"
import type { CreateAchievementDto } from "./dto/create-achievement.dto"
import type { ClaimAchievementDto } from "./dto/claim-achievement.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { Role } from "../users/enums/role.enum"

@Controller("boosters")
export class BoostersController {
  constructor(private readonly boostersService: BoostersService) {}

  // Booster CRUD operations (Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createBoosterDto: CreateBoosterDto) {
    return this.boostersService.create(createBoosterDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive: boolean = false) {
    return this.boostersService.findAll(includeInactive);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boostersService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateBoosterDto: UpdateBoosterDto) {
    return this.boostersService.update(id, updateBoosterDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.boostersService.remove(id);
  }

  // Player booster inventory management
  @Get('user/inventory')
  @UseGuards(JwtAuthGuard)
  getUserBoosters(@Req() req) {
    return this.boostersService.getUserBoosters(req.user.id);
  }

  @Post("purchase")
  @UseGuards(JwtAuthGuard)
  purchaseBooster(@Req() req, @Body() purchaseDto: PurchaseBoosterDto) {
    return this.boostersService.purchaseBooster(req.user.id, purchaseDto)
  }

  @Post("use")
  @UseGuards(JwtAuthGuard)
  useBooster(@Req() req, @Body() useBoosterDto: UseBoosterDto) {
    return this.boostersService.useBooster(req.user.id, useBoosterDto)
  }

  @Get("user/history")
  @UseGuards(JwtAuthGuard)
  getBoosterUsageHistory(
    @Req() req,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.boostersService.getBoosterUsageHistory(req.user.id, limit, offset)
  }

  // Booster bundles
  @Post('bundles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createBoosterBundle(@Body() createBundleDto: CreateBoosterBundleDto) {
    return this.boostersService.createBoosterBundle(createBundleDto);
  }

  @Get("bundles")
  getActiveBundles() {
    return this.boostersService.getActiveBundles()
  }

  @Post("bundles/purchase")
  @UseGuards(JwtAuthGuard)
  purchaseBundle(@Req() req, @Body() purchaseDto: PurchaseBundleDto) {
    return this.boostersService.purchaseBundle(req.user.id, purchaseDto)
  }

  // Booster gifting
  @Post("gift")
  @UseGuards(JwtAuthGuard)
  giftBooster(@Req() req, @Body() giftDto: GiftBoosterDto) {
    return this.boostersService.giftBooster(req.user.id, giftDto)
  }

  @Get('gifts/pending')
  @UseGuards(JwtAuthGuard)
  getPendingGifts(@Req() req) {
    return this.boostersService.getPendingGifts(req.user.id);
  }

  @Post("gifts/respond")
  @UseGuards(JwtAuthGuard)
  respondToGift(@Req() req, @Body() responseDto: RespondToGiftDto) {
    return this.boostersService.respondToGift(req.user.id, responseDto)
  }

  // Achievements
  @Post('achievements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createAchievement(@Body() createAchievementDto: CreateAchievementDto) {
    return this.boostersService.createAchievement(createAchievementDto);
  }

  @Get("achievements")
  getAchievements() {
    return this.boostersService.getAchievements()
  }

  @Get('user/achievements')
  @UseGuards(JwtAuthGuard)
  getUserAchievements(@Req() req) {
    return this.boostersService.getUserAchievements(req.user.id);
  }

  @Post("achievements/claim")
  @UseGuards(JwtAuthGuard)
  claimAchievementReward(@Req() req, @Body() claimDto: ClaimAchievementDto) {
    return this.boostersService.claimAchievementReward(req.user.id, claimDto)
  }

  // Analytics (Admin only)
  @Get("analytics/usage")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getBoosterUsageStats(@Query('startDate') startDate?: Date, @Query('endDate') endDate?: Date) {
    return this.boostersService.getBoosterUsageStats(startDate, endDate)
  }

  @Get('analytics/top-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getTopBoosterUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.boostersService.getTopBoosterUsers(limit);
  }

  @Get("analytics/revenue")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getBoosterRevenue(@Query('startDate') startDate?: Date, @Query('endDate') endDate?: Date) {
    return this.boostersService.getBoosterRevenue(startDate, endDate)
  }

  // Leaderboards
  @Get("leaderboards/usage")
  getBoosterUsageLeaderboard(
    @Query('boosterId') boosterId?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.boostersService.getBoosterUsageLeaderboard(boosterId, limit)
  }
}

