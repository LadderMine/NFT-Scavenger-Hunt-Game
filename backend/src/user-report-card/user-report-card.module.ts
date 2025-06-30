import { Module } from '@nestjs/common';
import { UserReportCardController } from './user-report-card.controller';
import { UserReportCardService } from './user-report-card.service';

@Module({
  controllers: [UserReportCardController],
  providers: [UserReportCardService],
  exports: [UserReportCardService], 
})
export class UserReportCardModule {}