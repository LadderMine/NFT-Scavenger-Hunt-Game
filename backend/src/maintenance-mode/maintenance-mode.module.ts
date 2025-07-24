import { Module, type DynamicModule } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { ScheduleModule } from "@nestjs/schedule"
import { APP_GUARD } from "@nestjs/core"
import { MaintenanceModeService } from "./maintenance-mode.service"
import { MaintenanceModeController } from "./maintenance-mode.controller"
import { MaintenanceConfig } from "./entities/maintenance-config.entity"
import { MaintenanceGuard } from "./guards/maintenance.guard"
import { AdminGuard } from "./guards/admin.guard"

export interface MaintenanceModeModuleOptions {
  enableGlobalGuard?: boolean
  defaultAllowedRoutes?: string[]
}

@Module({})
export class MaintenanceModeModule {
  static forRoot(options: MaintenanceModeModuleOptions = {}): DynamicModule {
    const providers = [MaintenanceModeService, AdminGuard]

    // Add global maintenance guard if enabled
    if (options.enableGlobalGuard !== false) {
      providers.push({
        provide: APP_GUARD,
        useClass: MaintenanceGuard,
      })
    }

    return {
      module: MaintenanceModeModule,
      imports: [TypeOrmModule.forFeature([MaintenanceConfig]), ConfigModule, ScheduleModule.forRoot()],
      controllers: [MaintenanceModeController],
      providers,
      exports: [MaintenanceModeService],
      global: true, // Make it globally available
    }
  }

  static forFeature(): DynamicModule {
    return {
      module: MaintenanceModeModule,
      imports: [TypeOrmModule.forFeature([MaintenanceConfig])],
      providers: [MaintenanceModeService],
      exports: [MaintenanceModeService],
    }
  }
}
