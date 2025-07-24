import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  /**
   * Create a new report
   */
  async create(createReportDto: CreateReportDto, userId: number) {
    const existingReport = await this.reportRepository.findOne({
      where: {
        userId,
        puzzleId: createReportDto.puzzleId,
      },
    });

    if (existingReport) {
      throw new BadRequestException(
        'You have already reported this puzzle. Thank you!',
      );
    }

    const report = this.reportRepository.create({
      ...createReportDto,
      userId,
      resolved: false,
    });

    return this.reportRepository.save(report);
  }

  /**
   * Admin-only: Get all reports
   */
  async findAll() {
    return this.reportRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Admin-only: Update a report
   */
  async update(id: number, updateDto: UpdateReportDto) {
    const report = await this.reportRepository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    Object.assign(report, updateDto);

    return this.reportRepository.save(report);
  }

  /**
   * Optional: Get reports by user
   */
  async findByUser(userId: number) {
    return this.reportRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Optional: Get unresolved reports
   */
  async findUnresolved() {
    return this.reportRepository.find({
      where: { resolved: false },
      order: { createdAt: 'DESC' },
    });
  }
}
