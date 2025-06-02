import { Controller, Post, Body } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post('request')
  async requestRefund(@Body() createRefundDto: CreateRefundDto) {
    const refund = await this.refundsService.requestRefund(createRefundDto);
    return { message: 'Refund request submitted', refund };
  }
}
