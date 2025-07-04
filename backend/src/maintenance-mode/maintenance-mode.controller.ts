import { Controller, Get, Put, Post, Delete, HttpCode, HttpStatus, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiSecurity } from "@nestjs/swagger"
import type { MaintenanceModeService } from "./maintenance-mode.service"
import type { UpdateMaintenanceConfigDto } from "./dto/maintenance-config.dto"
import { MaintenanceStatusDto } from "./dto/maintenance-status.dto"
import { MaintenanceConfig } from "./entities/maintenance-config.entity"
import { AdminGuard } from "./guards/admin.guard"
import { AdminOnly } from "./decorators/admin-only.decorator"
import { MaintenanceExempt } from "./decorators/maintenance-exempt.decorator"

@ApiTags("Maintenance Mode")
@Controller("maintenance")
@MaintenanceExempt() // This controller is exempt from maintenance mode
export class MaintenanceModeController {
  constructor(private readonly maintenanceModeService: MaintenanceModeService) {}

  @Get("status")
  @ApiOperation({ summary: "Get current maintenance status (public)" })
  @ApiResponse({ status: 200, description: "Maintenance status retrieved", type: MaintenanceStatusDto })
  async getMaintenanceStatus(): Promise<MaintenanceStatusDto> {
    return await this.maintenanceModeService.getMaintenanceStatus()
  }

  @Get("config")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @ApiOperation({ summary: "Get full maintenance configuration (admin only)" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "Maintenance configuration retrieved", type: MaintenanceConfig })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async getMaintenanceConfig(): Promise<MaintenanceConfig> {
    return await this.maintenanceModeService.getMaintenanceConfig()
  }

  @Put("config")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @ApiOperation({ summary: "Update maintenance configuration (admin only)" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "Maintenance configuration updated", type: MaintenanceConfig })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async updateMaintenanceConfig(updateDto: UpdateMaintenanceConfigDto): Promise<MaintenanceConfig> {
    return await this.maintenanceModeService.updateMaintenanceConfig(updateDto)
  }

  @Post("enable")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @ApiOperation({ summary: "Enable maintenance mode (admin only)" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "Maintenance mode enabled", type: MaintenanceConfig })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async enableMaintenanceMode(enableDto: {
    reason?: string
    message?: string
    adminUserId?: string
    adminUsername?: string
  }): Promise<MaintenanceConfig> {
    return await this.maintenanceModeService.enableMaintenanceMode(
      enableDto.adminUserId,
      enableDto.adminUsername,
      enableDto.reason,
      enableDto.message,
    )
  }

  @Post("disable")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @ApiOperation({ summary: "Disable maintenance mode (admin only)" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "Maintenance mode disabled", type: MaintenanceConfig })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async disableMaintenanceMode(disableDto: {
    adminUserId?: string
    adminUsername?: string
  }): Promise<MaintenanceConfig> {
    return await this.maintenanceModeService.disableMaintenanceMode(disableDto.adminUserId, disableDto.adminUsername)
  }

  @Post("schedule")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @ApiOperation({ summary: "Schedule maintenance mode (admin only)" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "Maintenance mode scheduled", type: MaintenanceConfig })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async scheduleMaintenanceMode(scheduleDto: {
    startTime: string
    endTime: string
    reason?: string
    message?: string
    adminUserId?: string
    adminUsername?: string
  }): Promise<MaintenanceConfig> {
    return await this.maintenanceModeService.scheduleMaintenanceMode(
      new Date(scheduleDto.startTime),
      new Date(scheduleDto.endTime),
      scheduleDto.adminUserId,
      scheduleDto.adminUsername,
      scheduleDto.reason,
      scheduleDto.message,
    )
  }

  @Post("allowed-routes/:route")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Add allowed route during maintenance (admin only)" })
  @ApiParam({ name: "route", description: "Route to allow during maintenance" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "Route added to allowed list" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async addAllowedRoute(route: string): Promise<MaintenanceConfig> {
    // Decode URL-encoded route
    const decodedRoute = decodeURIComponent(route)
    return await this.maintenanceModeService.addAllowedRoute(decodedRoute)
  }

  @Delete("allowed-routes/:route")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove allowed route (admin only)" })
  @ApiParam({ name: "route", description: "Route to remove from allowed list" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "Route removed from allowed list" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async removeAllowedRoute(route: string): Promise<MaintenanceConfig> {
    const decodedRoute = decodeURIComponent(route)
    return await this.maintenanceModeService.removeAllowedRoute(decodedRoute)
  }

  @Post("allowed-users/:userId")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Add allowed user during maintenance (admin only)" })
  @ApiParam({ name: "userId", description: "User ID to allow during maintenance" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "User added to allowed list" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async addAllowedUser(userId: string): Promise<MaintenanceConfig> {
    return await this.maintenanceModeService.addAllowedUser(userId)
  }

  @Delete("allowed-users/:userId")
  @UseGuards(AdminGuard)
  @AdminOnly()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove allowed user (admin only)" })
  @ApiParam({ name: "userId", description: "User ID to remove from allowed list" })
  @ApiSecurity("admin")
  @ApiResponse({ status: 200, description: "User removed from allowed list" })
  @ApiResponse({ status: 403, description: "Admin access required" })
  async removeAllowedUser(userId: string): Promise<MaintenanceConfig> {
    return await this.maintenanceModeService.removeAllowedUser(userId)
  }
}
