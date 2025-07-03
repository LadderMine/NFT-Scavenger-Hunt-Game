import { Injectable, Logger, type OnModuleInit } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { Cron, CronExpression } from "@nestjs/schedule"
import type { Repository } from "typeorm"
import type { MaintenanceConfig } from "./entities/maintenance-config.entity"
import type { UpdateMaintenanceConfigDto } from "./dto/maintenance-config.dto"
import type { MaintenanceStatusDto } from "./dto/maintenance-status.dto"

@Injectable()
export class MaintenanceModeService implements OnModuleInit {
  private readonly logger = new Logger(MaintenanceModeService.name)
  private cachedConfig: MaintenanceConfig | null = null
  private readonly cacheTimeout = 30000 // 30 seconds cache

  constructor(
    private readonly maintenanceConfigRepository: Repository<MaintenanceConfig>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.initializeMaintenanceConfig()
  }

  /**
   * Initialize maintenance configuration on startup
   */
  private async initializeMaintenanceConfig(): Promise<void> {
    try {
      let config = await this.maintenanceConfigRepository.findOne({
        where: {},
        order: { createdAt: "DESC" },
      })

      if (!config) {
        // Create default configuration
        config = this.maintenanceConfigRepository.create({
          isMaintenanceMode: this.configService.get<boolean>("MAINTENANCE_MODE", false),
          maintenanceMessage: this.configService.get<string>(
            "MAINTENANCE_MESSAGE",
            "System is currently under maintenance. Please try again later.",
          ),
          allowedRoutes: ["/health", "/admin/*", "/maintenance/*"],
          blockApiRoutes: true,
          blockWebRoutes: true,
        })

        await this.maintenanceConfigRepository.save(config)
        this.logger.log("Created default maintenance configuration")
      }

      this.cachedConfig = config
      this.logger.log(`Maintenance mode initialized: ${config.isMaintenanceMode ? "ENABLED" : "DISABLED"}`)
    } catch (error) {
      this.logger.error("Failed to initialize maintenance configuration", error)
    }
  }

  /**
   * Get current maintenance configuration
   */
  async getMaintenanceConfig(): Promise<MaintenanceConfig> {
    if (this.cachedConfig && this.isCacheValid()) {
      return this.cachedConfig
    }

    const config = await this.maintenanceConfigRepository.findOne({
      where: {},
      order: { updatedAt: "DESC" },
    })

    if (!config) {
      throw new Error("Maintenance configuration not found")
    }

    this.cachedConfig = config
    return config
  }

  /**
   * Get maintenance status (public information)
   */
  async getMaintenanceStatus(): Promise<MaintenanceStatusDto> {
    const config = await this.getMaintenanceConfig()

    return {
      isMaintenanceMode: config.isMaintenanceMode,
      maintenanceMessage: config.maintenanceMessage,
      scheduledStart: config.scheduledStart,
      scheduledEnd: config.scheduledEnd,
      enabledByUsername: config.enabledByUsername,
      reason: config.reason,
      updatedAt: config.updatedAt,
    }
  }

  /**
   * Update maintenance configuration
   */
  async updateMaintenanceConfig(updateDto: UpdateMaintenanceConfigDto): Promise<MaintenanceConfig> {
    const config = await this.getMaintenanceConfig()

    // Update fields
    Object.assign(config, updateDto)

    // Handle date strings
    if (updateDto.scheduledStart) {
      config.scheduledStart = new Date(updateDto.scheduledStart)
    }
    if (updateDto.scheduledEnd) {
      config.scheduledEnd = new Date(updateDto.scheduledEnd)
    }

    const savedConfig = await this.maintenanceConfigRepository.save(config)
    this.cachedConfig = savedConfig

    this.logger.log(
      `Maintenance mode ${savedConfig.isMaintenanceMode ? "ENABLED" : "DISABLED"} by ${savedConfig.enabledByUsername || "system"}`,
    )

    return savedConfig
  }

  /**
   * Enable maintenance mode
   */
  async enableMaintenanceMode(
    adminUserId?: string,
    adminUsername?: string,
    reason?: string,
    message?: string,
  ): Promise<MaintenanceConfig> {
    return await this.updateMaintenanceConfig({
      isMaintenanceMode: true,
      enabledBy: adminUserId,
      enabledByUsername: adminUsername,
      reason,
      maintenanceMessage: message,
    })
  }

  /**
   * Disable maintenance mode
   */
  async disableMaintenanceMode(adminUserId?: string, adminUsername?: string): Promise<MaintenanceConfig> {
    return await this.updateMaintenanceConfig({
      isMaintenanceMode: false,
      enabledBy: adminUserId,
      enabledByUsername: adminUsername,
    })
  }

  /**
   * Schedule maintenance mode
   */
  async scheduleMaintenanceMode(
    startTime: Date,
    endTime: Date,
    adminUserId?: string,
    adminUsername?: string,
    reason?: string,
    message?: string,
  ): Promise<MaintenanceConfig> {
    return await this.updateMaintenanceConfig({
      isMaintenanceMode: false, // Will be enabled automatically at scheduled time
      scheduledStart: startTime.toISOString(),
      scheduledEnd: endTime.toISOString(),
      enabledBy: adminUserId,
      enabledByUsername: adminUsername,
      reason,
      maintenanceMessage: message,
    })
  }

  /**
   * Check if maintenance mode should be automatically enabled/disabled
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkScheduledMaintenance(): Promise<void> {
    try {
      const config = await this.getMaintenanceConfig()
      const now = new Date()

      // Check if scheduled maintenance should start
      if (
        config.scheduledStart &&
        !config.isMaintenanceMode &&
        now >= config.scheduledStart &&
        (!config.scheduledEnd || now < config.scheduledEnd)
      ) {
        await this.updateMaintenanceConfig({
          isMaintenanceMode: true,
        })
        this.logger.log("Scheduled maintenance mode ENABLED")
      }

      // Check if scheduled maintenance should end
      if (config.scheduledEnd && config.isMaintenanceMode && now >= config.scheduledEnd) {
        await this.updateMaintenanceConfig({
          isMaintenanceMode: false,
          scheduledStart: null,
          scheduledEnd: null,
        })
        this.logger.log("Scheduled maintenance mode DISABLED")
      }
    } catch (error) {
      this.logger.error("Error checking scheduled maintenance", error)
    }
  }

  /**
   * Add allowed route during maintenance
   */
  async addAllowedRoute(route: string): Promise<MaintenanceConfig> {
    const config = await this.getMaintenanceConfig()
    const allowedRoutes = config.allowedRoutes || []

    if (!allowedRoutes.includes(route)) {
      allowedRoutes.push(route)
      return await this.updateMaintenanceConfig({ allowedRoutes })
    }

    return config
  }

  /**
   * Remove allowed route
   */
  async removeAllowedRoute(route: string): Promise<MaintenanceConfig> {
    const config = await this.getMaintenanceConfig()
    const allowedRoutes = config.allowedRoutes || []

    const updatedRoutes = allowedRoutes.filter((r) => r !== route)
    return await this.updateMaintenanceConfig({ allowedRoutes: updatedRoutes })
  }

  /**
   * Add allowed user during maintenance
   */
  async addAllowedUser(userId: string): Promise<MaintenanceConfig> {
    const config = await this.getMaintenanceConfig()
    const allowedUserIds = config.allowedUserIds || []

    if (!allowedUserIds.includes(userId)) {
      allowedUserIds.push(userId)
      return await this.updateMaintenanceConfig({ allowedUserIds })
    }

    return config
  }

  /**
   * Remove allowed user
   */
  async removeAllowedUser(userId: string): Promise<MaintenanceConfig> {
    const config = await this.getMaintenanceConfig()
    const allowedUserIds = config.allowedUserIds || []

    const updatedUserIds = allowedUserIds.filter((id) => id !== userId)
    return await this.updateMaintenanceConfig({ allowedUserIds: updatedUserIds })
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(): boolean {
    if (!this.cachedConfig) return false
    const cacheAge = Date.now() - this.cachedConfig.updatedAt.getTime()
    return cacheAge < this.cacheTimeout
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.cachedConfig = null
  }
}
