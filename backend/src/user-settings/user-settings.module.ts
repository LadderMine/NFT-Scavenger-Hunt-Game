import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserSettingsService } from "./user-settings.service"
import { UserSettingsController } from "./user-settings.controller"
import { UserSettings } from "./entities/user-settings.entity"

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService], // Export service for potential use in other modules
})
export class UserSettingsModule {}
