import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiTracking } from './entities/api-tracking.entity';
import { ApiTrackingService } from './api-tracking.service';
import { ApiTrackingController } from './api-tracking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApiTracking])],
  providers: [ApiTrackingService],
  controllers: [ApiTrackingController],
  exports: [ApiTrackingService],
})
export class ApiTrackingModule {}
