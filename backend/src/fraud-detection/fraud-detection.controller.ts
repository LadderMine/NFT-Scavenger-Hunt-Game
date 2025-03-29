import { Controller, Get, Post, Body, Param, Query, Put, UseGuards } from "@nestjs/common"
import type { FraudDetectionService } from "./fraud-detection.service"
import type { CreateFraudCheckDto } from "./dto/create-fraud-check.dto"
import type { UpdateFraudReviewDto } from "./dto/update-fraud-review.dto"
import type { FraudSuspectQueryDto } from "./dto/fraud-suspect-query.dto"
import type { FraudSuspect } from "./entities/fraud-suspect.entity"
import { AdminGuard } from "../common/guards/admin.guard" // You'll need to implement this guard

@Controller("fraud-detection")
export class FraudDetectionController {
  constructor(private readonly fraudDetectionService: FraudDetectionService) {}

  @Post('check')
  async checkForFraud(@Body() checkDto: CreateFraudCheckDto): Promise<{ isFraudulent: boolean }> {
    const isFraudulent = await this.fraudDetectionService.checkForFraud(checkDto);
    return { isFraudulent };
  }

  @UseGuards(AdminGuard)
  @Get('suspects')
  async getSuspects(@Query() queryDto: FraudSuspectQueryDto): Promise<FraudSuspect[]> {
    return this.fraudDetectionService.getSuspects(queryDto);
  }

  @UseGuards(AdminGuard)
  @Get('suspects/:id')
  async getSuspectById(@Param('id') id: string): Promise<FraudSuspect> {
    return this.fraudDetectionService.getSuspectById(id);
  }

  @UseGuards(AdminGuard)
  @Put("review/:id")
  async reviewSuspect(@Param('id') id: string, @Body() updateDto: UpdateFraudReviewDto): Promise<FraudSuspect> {
    return this.fraudDetectionService.reviewSuspect(id, updateDto)
  }

  @UseGuards(AdminGuard)
  @Get("stats")
  async getStats(): Promise<any> {
    return this.fraudDetectionService.getActivityStats()
  }
}

