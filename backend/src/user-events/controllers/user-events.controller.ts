import { Controller, Get, Post, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"
import { AuthTokenGuard } from "src/auth/guard/auth-token/auth-token.guard";
import { UserEventsService } from "../providers/user-events.service";
import { Public } from "src/auth/decorators/public.decorator";
import { UserEvent } from "../entities/user-event.entity";
import { CreateUserEventDto } from "../dto/create-user-event.dto";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/auth/enums/roles.enum";
import { EventAnalyticsResponseDto } from "../dto/event-analytics-response.dto";
import { EventAnalyticsQueryDto } from "../dto/event-analytics.dto";
import { EventType } from "../enums/event-type.enum";

@ApiTags("User Events")
@Controller("user-events")
@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
export class UserEventsController {
  constructor(private readonly userEventsService: UserEventsService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Log a user event" })
  @ApiResponse({
    status: 201,
    description: "Event logged successfully",
    type: UserEvent,
  })
  async logEvent(createUserEventDto: CreateUserEventDto, @Req() request: any): Promise<UserEvent> {
    // Extract additional context from request if not provided
    const eventData = {
      ...createUserEventDto,
      ipAddress: createUserEventDto.ipAddress || request.ip,
      userAgent: createUserEventDto.userAgent || request.get("User-Agent"),
      sessionId: createUserEventDto.sessionId || request.sessionID,
    }

    return await this.userEventsService.logEvent(eventData)
  }

  @Get('analytics')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiOperation({ summary: 'Get user events analytics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Analytics data retrieved successfully',
    type: EventAnalyticsResponseDto,
  })
  async getAnalytics(
    @Query() query: EventAnalyticsQueryDto,
  ): Promise<EventAnalyticsResponseDto> {
    return await this.userEventsService.getAnalytics(query);
  }

  @Get("user/:userId")
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiOperation({ summary: "Get events for a specific user (Admin only)" })
  @ApiQuery({ name: "eventTypes", required: false, isArray: true, enum: EventType })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiQuery({ name: "offset", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "User events retrieved successfully",
    type: [UserEvent],
  })
  async getUserEvents(
    @Param('userId') userId: string,
    @Query('eventTypes') eventTypes?: EventType[],
    @Query('limit') limit = 50,
    @Query('offset') offset = 0,
  ): Promise<{ events: UserEvent[]; total: number }> {
    const eventTypesArray = eventTypes ? (Array.isArray(eventTypes) ? eventTypes : [eventTypes]) : undefined
    return await this.userEventsService.getUserEvents(userId, eventTypesArray, Number(limit), Number(offset))
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiOperation({ summary: 'Get a specific event by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
    type: UserEvent,
  })
  async getEventById(@Param('id') id: string): Promise<UserEvent> {
    return await this.userEventsService.getEventById(id);
  }

  @Post('cleanup')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clean up old events (Admin only)' })
  @ApiQuery({ name: 'daysToKeep', required: false, type: Number, description: 'Number of days to keep (default: 90)' })
  @ApiResponse({
    status: 200,
    description: 'Old events cleaned up successfully',
    schema: {
      type: 'object',
      properties: {
        deletedCount: { type: 'number' },
        message: { type: 'string' },
      },
    },
  })
  async cleanupOldEvents(
    @Query('daysToKeep') daysToKeep = 90,
  ): Promise<{ deletedCount: number; message: string }> {
    const deletedCount = await this.userEventsService.deleteOldEvents(Number(daysToKeep));
    return {
      deletedCount,
      message: `Successfully deleted ${deletedCount} events older than ${daysToKeep} days`,
    };
  }
}
