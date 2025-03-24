import { Controller, Get, Patch, Param, Body, Delete, Post, UseGuards } from "@nestjs/common"
import type { UserLanguageService } from "../services/user-language.service"
import { CreateUserLanguageDto } from "../dto/create-user-language.dto"
import { UpdateUserLanguageDto } from "../dto/update-user-language.dto"
import { LanguageGuard } from "../guards/language.guard"
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from "@nestjs/swagger"

@ApiTags("User Language Preferences")
@Controller("language")
export class UserLanguageController {
  constructor(private readonly userLanguageService: UserLanguageService) {}

  @ApiOperation({ summary: 'Get user language preference' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the user language preference',
  })
  @Get(':userId')
  async getUserLanguage(@Param('userId') userId: string) {
    const preference = await this.userLanguageService.getUserLanguage(userId);
    return {
      success: true,
      data: preference,
    };
  }

  @ApiOperation({ summary: 'Create user language preference' })
  @ApiBody({ type: CreateUserLanguageDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Creates a new user language preference',
  })
  @Post()
  async createUserLanguage(@Body() createDto: CreateUserLanguageDto) {
    const preference = await this.userLanguageService.createUserLanguage(createDto);
    return {
      success: true,
      data: preference,
    };
  }

  @ApiOperation({ summary: "Update user language preference" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiBody({ type: UpdateUserLanguageDto })
  @ApiResponse({
    status: 200,
    description: "Updates the user language preference",
  })
  @Patch("update/:userId")
  async updateUserLanguage(@Param('userId') userId: string, @Body() updateDto: UpdateUserLanguageDto) {
    const preference = await this.userLanguageService.updateUserLanguage(userId, updateDto)
    return {
      success: true,
      data: preference,
    }
  }

  @ApiOperation({ summary: 'Delete user language preference' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Deletes the user language preference',
  })
  @Delete(':userId')
  @UseGuards(LanguageGuard)
  async deleteUserLanguage(@Param('userId') userId: string) {
    await this.userLanguageService.deleteUserLanguage(userId);
    return {
      success: true,
      message: 'User language preference deleted successfully',
    };
  }
}

