import { Body, Controller, Get, Param, Patch, Post, UseGuards, Request, Query, Delete } from "@nestjs/common"
import type { CreateRefundDto } from "./dto/create-refund.dto"
import type { FindRefundsDto } from "./dto/find-refunds.dto"
import type { ProcessRefundDto } from "./dto/process-refund.dto"
import type { UpdateRefundStatusDto } from "./dto/update-refund-status.dto"
import type { Refund, RefundStatus } from "./entities/refund.entity"
import type { RefundsService } from "./refunds.service"
import { Roles } from "../common/decorators/roles.decorator"
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard"
import { RolesGuard } from "../common/guards/roles.guard"

@Controller("refunds")
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @UseGuards(JwtAuthGuard)
  @Post("request")
  async create(@Request() req, @Body() createRefundDto: CreateRefundDto): Promise<Refund> {
    return this.refundsService.create(req.user.id, createRefundDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Request() req, @Param('id') id: string): Promise<Refund> {
    const refund = await this.refundsService.findOne(id)

    // If the user is not an admin, they can only view their own refunds
    if (req.user.role !== "admin" && refund.userId !== req.user.id) {
      throw new Error("You are not authorized to view this refund")
    }

    return refund
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get()
  async findAll(@Query() findRefundsDto: FindRefundsDto): Promise<{ data: Refund[]; total: number; page: number; limit: number }> {
    return this.refundsService.findAll(findRefundsDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get("user/me")
  async findMyRefunds(
    @Request() req,
    @Query() findRefundsDto: FindRefundsDto,
  ): Promise<{ data: Refund[]; total: number; page: number; limit: number }> {
    return this.refundsService.findByUserId(req.user.id, findRefundsDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Patch(":id/status")
  async updateStatus(@Param('id') id: string, @Body() updateRefundStatusDto: UpdateRefundStatusDto): Promise<Refund> {
    return this.refundsService.updateStatus(id, updateRefundStatusDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Patch(":id/process")
  async processRefund(
    @Request() req,
    @Param('id') id: string,
    @Body() processRefundDto: ProcessRefundDto,
  ): Promise<Refund> {
    return this.refundsService.processRefund(id, req.user.id, processRefundDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/cancel")
  async cancelRefund(@Request() req, @Param('id') id: string): Promise<Refund> {
    return this.refundsService.cancelRefund(id, req.user.id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Get("statistics")
  async getStatistics(@Query('startDate') startDate: string, @Query('endDate') endDate: string): Promise<any> {
    return this.refundsService.getRefundStatistics(startDate, endDate)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Patch("bulk/status")
  async bulkUpdateStatus(
    @Request() req,
    @Body() { ids, status }: { ids: string[], status: RefundStatus },
  ): Promise<{ success: boolean }> {
    await this.refundsService.bulkUpdateStatus(ids, status, req.user.id)
    return { success: true }
  }
}

