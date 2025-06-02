import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Between, ILike, type Repository } from "typeorm"
import type { CreateRefundDto } from "./dto/create-refund.dto"
import type { FindRefundsDto } from "./dto/find-refunds.dto"
import type { ProcessRefundDto } from "./dto/process-refund.dto"
import type { UpdateRefundStatusDto } from "./dto/update-refund-status.dto"
import { Refund, RefundStatus } from "./entities/refund.entity"

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(Refund)
    private refundsRepository: Repository<Refund>,
  ) {}

  async create(userId: string, createRefundDto: CreateRefundDto): Promise<Refund> {
    // Check if a refund request already exists for this order
    const existingRefund = await this.refundsRepository.findOne({
      where: { orderId: createRefundDto.orderId },
    })

    if (existingRefund) {
      throw new BadRequestException("A refund request already exists for this order")
    }

    // TODO: Add validation to check if the order exists and belongs to the user
    // This would require injecting an OrdersService or similar

    const refund = this.refundsRepository.create({
      userId,
      ...createRefundDto,
    })

    return this.refundsRepository.save(refund)
  }

  async findAll(
    findRefundsDto?: FindRefundsDto,
  ): Promise<{ data: Refund[]; total: number; page: number; limit: number }> {
    const {
      userId,
      orderId,
      status,
      startDate,
      endDate,
      searchTerm,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = findRefundsDto || {}

    const skip = (page - 1) * limit

    const whereClause: any = {}

    if (userId) whereClause.userId = userId
    if (orderId) whereClause.orderId = orderId
    if (status) whereClause.status = status

    if (startDate && endDate) {
      whereClause.createdAt = Between(new Date(startDate), new Date(endDate))
    }

    if (searchTerm) {
      whereClause.reason = ILike(`%${searchTerm}%`)
    }

    const [data, total] = await this.refundsRepository.findAndCount({
      where: whereClause,
      order: { [sortBy]: sortOrder },
      skip,
      take: limit,
    })

    return {
      data,
      total,
      page,
      limit,
    }
  }

  async findOne(id: string): Promise<Refund> {
    const refund = await this.refundsRepository.findOne({ where: { id } })

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${id} not found`)
    }

    return refund
  }

  async findByUserId(
    userId: string,
    findRefundsDto?: FindRefundsDto,
  ): Promise<{ data: Refund[]; total: number; page: number; limit: number }> {
    const modifiedDto = { ...findRefundsDto, userId }
    return this.findAll(modifiedDto)
  }

  async updateStatus(id: string, updateRefundStatusDto: UpdateRefundStatusDto): Promise<Refund> {
    const refund = await this.findOne(id)

    const updatedRefund = {
      ...refund,
      status: updateRefundStatusDto.status,
    }

    return this.refundsRepository.save(updatedRefund)
  }

  async processRefund(id: string, adminId: string, processRefundDto: ProcessRefundDto): Promise<Refund> {
    const refund = await this.findOne(id)

    if (refund.status !== RefundStatus.PENDING) {
      throw new BadRequestException(`Refund with ID ${id} is not in PENDING status`)
    }

    const updatedRefund = {
      ...refund,
      status: processRefundDto.status,
      adminNotes: processRefundDto.adminNotes,
      processedBy: adminId,
      processedAt: new Date(),
    }

    // If the refund is approved, we would typically integrate with a payment processor here
    if (processRefundDto.status === RefundStatus.APPROVED) {
      // TODO: Integrate with payment processor to issue the refund
      // For now, we'll just update the status
    }

    return this.refundsRepository.save(updatedRefund)
  }

  async cancelRefund(id: string, userId: string): Promise<Refund> {
    const refund = await this.findOne(id)

    if (refund.userId !== userId) {
      throw new BadRequestException("You can only cancel your own refund requests")
    }

    if (refund.status !== RefundStatus.PENDING) {
      throw new BadRequestException("Only pending refund requests can be cancelled")
    }

    const updatedRefund = {
      ...refund,
      status: RefundStatus.CANCELLED,
    }

    return this.refundsRepository.save(updatedRefund)
  }

  async getRefundStatistics(startDate?: string, endDate?: string): Promise<any> {
    const query = this.refundsRepository.createQueryBuilder("refund")

    if (startDate && endDate) {
      query.where("refund.createdAt BETWEEN :startDate AND :endDate", {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
    }

    const totalCount = await query.getCount()

    const statusCounts = await query
      .select("refund.status", "status")
      .addSelect("COUNT(refund.id)", "count")
      .groupBy("refund.status")
      .getRawMany()

    const averageProcessingTime = await query
      .select("AVG(EXTRACT(EPOCH FROM (refund.processedAt - refund.createdAt)))", "avgTime")
      .where("refund.processedAt IS NOT NULL")
      .getRawOne()

    return {
      totalCount,
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = Number.parseInt(curr.count)
        return acc
      }, {}),
      averageProcessingTime: averageProcessingTime?.avgTime
        ? Number.parseFloat(averageProcessingTime.avgTime) / 3600
        : // Convert seconds to hours
          null,
    }
  }

  async bulkUpdateStatus(ids: string[], status: RefundStatus, adminId: string): Promise<void> {
    await this.refundsRepository.update(
      { id: { $in: ids } },
      {
        status,
        processedBy: adminId,
        processedAt: new Date(),
      },
    )
  }
}

