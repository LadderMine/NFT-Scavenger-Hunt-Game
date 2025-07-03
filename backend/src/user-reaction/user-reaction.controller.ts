import { Controller, Get, Post, Patch, Param, Delete, Query, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger"
import type { UserReactionService } from "./user-reaction.service"
import type { CreateReactionDto } from "./dto/create-reaction.dto"
import type { UpdateReactionDto } from "./dto/update-reaction.dto"
import { ReactionAggregationDto } from "./dto/reaction-aggregation.dto"
import { Reaction } from "./entities/reaction.entity"

@ApiTags("User Reactions")
@Controller("reactions")
export class UserReactionController {
  constructor(private readonly userReactionService: UserReactionService) {}

  @Post()
  @ApiOperation({ summary: "Create or update a reaction" })
  @ApiResponse({ status: 201, description: "Reaction created/updated successfully", type: Reaction })
  @ApiResponse({ status: 400, description: "Invalid emoji or request data" })
  async createReaction(createReactionDto: CreateReactionDto): Promise<Reaction> {
    return await this.userReactionService.createReaction(createReactionDto)
  }

  @Get('content/:contentId')
  @ApiOperation({ summary: 'Get all reactions for specific content' })
  @ApiParam({ name: 'contentId', description: 'Content ID' })
  @ApiResponse({ status: 200, description: 'Reactions retrieved successfully', type: [Reaction] })
  async getReactionsByContent(@Param('contentId') contentId: string): Promise<Reaction[]> {
    return await this.userReactionService.getReactionsByContent(contentId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reactions by specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User reactions retrieved successfully', type: [Reaction] })
  async getReactionsByUser(@Param('userId') userId: string): Promise<Reaction[]> {
    return await this.userReactionService.getReactionsByUser(userId);
  }

  @Get("user/:userId/content/:contentId")
  @ApiOperation({ summary: "Get specific reaction by user and content" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiParam({ name: "contentId", description: "Content ID" })
  @ApiResponse({ status: 200, description: "Reaction retrieved successfully", type: Reaction })
  @ApiResponse({ status: 404, description: "Reaction not found" })
  async getReactionByUserAndContent(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ): Promise<Reaction | null> {
    return await this.userReactionService.getReactionByUserAndContent(userId, contentId)
  }

  @Get('aggregation/:contentId')
  @ApiOperation({ summary: 'Get reaction aggregation for specific content' })
  @ApiParam({ name: 'contentId', description: 'Content ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reaction aggregation retrieved successfully', 
    type: ReactionAggregationDto 
  })
  async getReactionAggregation(@Param('contentId') contentId: string): Promise<ReactionAggregationDto> {
    return await this.userReactionService.getReactionAggregation(contentId);
  }

  @Get('aggregation')
  @ApiOperation({ summary: 'Get reaction aggregations for multiple contents' })
  @ApiQuery({ 
    name: 'contentIds', 
    description: 'Comma-separated list of content IDs',
    example: 'puzzle-1,puzzle-2,puzzle-3'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Multiple reaction aggregations retrieved successfully', 
    type: [ReactionAggregationDto] 
  })
  async getMultipleReactionAggregations(
    @Query('contentIds') contentIds: string,
  ): Promise<ReactionAggregationDto[]> {
    const contentIdArray = contentIds.split(',').map(id => id.trim()).filter(id => id.length > 0);
    return await this.userReactionService.getMultipleReactionAggregations(contentIdArray);
  }

  @Get("allowed-emojis")
  @ApiOperation({ summary: "Get list of allowed emojis" })
  @ApiResponse({ status: 200, description: "Allowed emojis retrieved successfully" })
  getAllowedEmojis(): { emojis: string[] } {
    return { emojis: this.userReactionService.getAllowedEmojis() }
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a reaction" })
  @ApiParam({ name: "id", description: "Reaction ID" })
  @ApiResponse({ status: 200, description: "Reaction updated successfully", type: Reaction })
  @ApiResponse({ status: 404, description: "Reaction not found" })
  @ApiResponse({ status: 400, description: "Invalid emoji" })
  async updateReaction(@Param('id') id: string, updateReactionDto: UpdateReactionDto): Promise<Reaction> {
    return await this.userReactionService.updateReaction(id, updateReactionDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a reaction by ID' })
  @ApiParam({ name: 'id', description: 'Reaction ID' })
  @ApiResponse({ status: 204, description: 'Reaction removed successfully' })
  @ApiResponse({ status: 404, description: 'Reaction not found' })
  async removeReaction(@Param('id') id: string): Promise<void> {
    await this.userReactionService.removeReaction(id);
  }

  @Delete("user/:userId/content/:contentId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove reaction by user and content" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiParam({ name: "contentId", description: "Content ID" })
  @ApiResponse({ status: 204, description: "Reaction removed successfully" })
  @ApiResponse({ status: 404, description: "Reaction not found" })
  async removeReactionByUserAndContent(
    @Param('userId') userId: string,
    @Param('contentId') contentId: string,
  ): Promise<void> {
    await this.userReactionService.removeReactionByUserAndContent(userId, contentId)
  }
}
