import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailChangeController } from './email-change.controller';
import { EmailChangeService } from './email-change.service';
import { EmailChangeRequest } from './email-change-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailChangeRequest]),
  ],
  controllers: [EmailChangeController],
  providers: [EmailChangeService],
  exports: [EmailChangeService], 
})
export class EmailChangeModule {}
