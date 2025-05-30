import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEvent } from "./entities/user-event.entity"
import { UserEventsController } from "./controllers/user-events.controller"
import { UserEventsService } from "./providers/user-events.service"

@Module({
  imports: [TypeOrmModule.forFeature([UserEvent])],
  controllers: [UserEventsController],
  providers: [UserEventsService],
  exports: [UserEventsService],
})
export class UserEventsModule {}
