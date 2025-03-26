import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefundRequest, RefundStatus } from './entities/refund-request.entity';
import { CreateRefundDto } from './dto/create-refund.dto';

@Injectable()
export class RefundsService {
  constructor(
    @InjectRepository(RefundRequest)
    private readonly refundRepository: Repository<RefundRequest>,
  ) {}

  async requestRefund(createRefundDto: CreateRefundDto): Promise<RefundRequest> {
    const refundRequest = this.refundRepository.create({ ...createRefundDto, status: RefundStatus.PENDING });
    return this.refundRepository.save(refundRequest);
  }
}
