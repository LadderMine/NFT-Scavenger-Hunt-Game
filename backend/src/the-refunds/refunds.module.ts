import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Refund } from "./entities/refund.entity"
import { RefundsController } from "./refunds.controller"
import { RefundsService } from "./refunds.service"

@Module({
  imports: [TypeOrmModule.forFeature([Refund])],
  controllers: [RefundsController],
  providers: [RefundsService],
  exports: [RefundsService],
})
export class RefundsModule {}

