import { Controller, Get, Patch, Post, Delete, HttpCode, HttpStatus, Param, BadRequestException } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger"
import type { UserSettingsService } from "./user-settings.service"
import type { UpdateUserSettingsDto, CreateUserSettingsDto } from "./dto/user-settings.dto"
import { UserSettingsResponseDto } from "./dto/user-settings-response.dto"
import { SettingsCategoriesDto } from "./dto/settings-categories.dto"

@ApiTags("User Settings")
@Controller("user-settings")
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  @ApiOperation({ summary: "Get current user's settings" })
  @ApiResponse({ status: 200, description: "User settings retrieved successfully", type: UserSettingsResponseDto })
  @ApiResponse({ status: 400, description: "User ID header missing" })
  async getUserSettings(userId: string): Promise<UserSettingsResponseDto> {
    if (!userId) {
      throw new BadRequestException("User ID header (x-user-id) is required")
    }

    return await this.userSettingsService.getUserSettings(userId)
  }

  @Patch()
  @ApiOperation({ summary: "Update current user's settings" })
  @ApiResponse({ status: 200, description: "User settings updated successfully", type: UserSettingsResponseDto })
  @ApiResponse({ status: 400, description: "Invalid settings data or User ID header missing" })
  async updateUserSettings(userId: string, updateDto: UpdateUserSettingsDto): Promise<UserSettingsResponseDto> {
    if (!userId) {
      throw new BadRequestException("User ID header (x-user-id) is required")
    }

    return await this.userSettingsService.updateUserSettings(userId, updateDto)
  }

  @Post()
  @ApiOperation({ summary: "Create user settings with custom defaults" })
  @ApiResponse({ status: 201, description: "User settings created successfully", type: UserSettingsResponseDto })
  @ApiResponse({ status: 400, description: "Invalid settings data or user settings already exist" })
  async createUserSettings(createDto: CreateUserSettingsDto): Promise<UserSettingsResponseDto> {
    return await this.userSettingsService.createUserSettings(createDto)
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete current user's settings" })
  @ApiResponse({ status: 204, description: "User settings deleted successfully" })
  @ApiResponse({ status: 400, description: "User ID header missing" })
  @ApiResponse({ status: 404, description: "User settings not found" })
  async deleteUserSettings(userId: string): Promise<void> {
    if (!userId) {
      throw new BadRequestException("User ID header (x-user-id) is required")
    }

    await this.userSettingsService.deleteUserSettings(userId)
  }

  @Post("reset")
  @ApiOperation({ summary: "Reset current user's settings to defaults" })
  @ApiResponse({ status: 200, description: "User settings reset successfully", type: UserSettingsResponseDto })
  @ApiResponse({ status: 400, description: "User ID header missing" })
  @ApiResponse({ status: 404, description: "User settings not found" })
  async resetUserSettings(userId: string): Promise<UserSettingsResponseDto> {
    if (!userId) {
      throw new BadRequestException("User ID header (x-user-id) is required")
    }

    return await this.userSettingsService.resetUserSettings(userId)
  }

  @Get("categories")
  @ApiOperation({ summary: "Get available settings categories and options" })
  @ApiResponse({ status: 200, description: "Settings categories retrieved successfully", type: SettingsCategoriesDto })
  getSettingsCategories(): SettingsCategoriesDto {
    return this.userSettingsService.getSettingsCategories()
  }

  @Get("export")
  @ApiOperation({ summary: "Export current user's settings" })
  @ApiResponse({ status: 200, description: "User settings exported successfully" })
  @ApiResponse({ status: 400, description: "User ID header missing" })
  @ApiResponse({ status: 404, description: "User settings not found" })
  async exportUserSettings(userId: string): Promise<Record<string, any>> {
    if (!userId) {
      throw new BadRequestException("User ID header (x-user-id) is required")
    }

    return await this.userSettingsService.exportUserSettings(userId)
  }

  @Post("import")
  @ApiOperation({ summary: "Import user settings from exported data" })
  @ApiResponse({ status: 200, description: "User settings imported successfully", type: UserSettingsResponseDto })
  @ApiResponse({ status: 400, description: "Invalid settings data or User ID header missing" })
  async importUserSettings(userId: string, settingsData: Record<string, any>): Promise<UserSettingsResponseDto> {
    if (!userId) {
      throw new BadRequestException("User ID header (x-user-id) is required")
    }

    return await this.userSettingsService.importUserSettings(userId, settingsData)
  }

  @Get(":userId")
  @ApiOperation({ summary: "Get specific user's settings (admin only)" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({ status: 200, description: "User settings retrieved successfully", type: UserSettingsResponseDto })
  @ApiResponse({ status: 404, description: "User settings not found" })
  async getSpecificUserSettings(@Param("userId") userId: string): Promise<UserSettingsResponseDto> {
    return await this.userSettingsService.getUserSettings(userId)
  }

  @Patch(":userId")
  @ApiOperation({ summary: "Update specific user's settings (admin only)" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({ status: 200, description: "User settings updated successfully", type: UserSettingsResponseDto })
  @ApiResponse({ status: 400, description: "Invalid settings data" })
  async updateSpecificUserSettings(
    @Param("userId") userId: string,
    updateDto: UpdateUserSettingsDto,
  ): Promise<UserSettingsResponseDto> {
    return await this.userSettingsService.updateUserSettings(userId, updateDto)
  }

  @Delete(":userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete specific user's settings (admin only)" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({ status: 204, description: "User settings deleted successfully" })
  @ApiResponse({ status: 404, description: "User settings not found" })
  async deleteSpecificUserSettings(@Param("userId") userId: string): Promise<void> {
    await this.userSettingsService.deleteUserSettings(userId)
  }
}
