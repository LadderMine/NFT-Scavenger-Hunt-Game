import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InAppNotificationsService } from './in-app-notifications.service';
import { CreateInAppNotificationDto } from './dto/create-in-app-notification.dto';
import { InAppNotificationType } from './entities/in-app-notification.entity';
import { WsJwtAuthGuard } from 'src/auth/guards/ws-jwt-auth.guard';

@ApiTags('in-app-notifications')
@Controller('in-app-notifications')
@UseGuards(WsJwtAuthGuard)
@ApiBearerAuth()
export class InAppNotificationsController {
  constructor(private readonly notificationsService: InAppNotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiQuery({ name: 'isArchived', required: false, type: Boolean })
  @ApiQuery({ name: 'type', required: false, enum: InAppNotificationType })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns user notifications' })
  async getUserNotifications(
    @Query('isRead') isRead?: boolean,
    @Query('isArchived') isArchived?: boolean,
    @Query('type') type?: InAppNotificationType,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.notificationsService.getUserNotifications(1, {
      isRead,
      isArchived,
      type,
      startDate,
      endDate,
      limit,
      offset,
    });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({ status: 200, description: 'Returns unread notifications count' })
  async getUnreadCount() {
    return this.notificationsService.getUnreadCount(1);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  async create(@Body() createDto: CreateInAppNotificationDto) {
    return this.notificationsService.create(createDto);
  }

  @Post('system')
  @ApiOperation({ summary: 'Create a system-wide notification' })
  @ApiResponse({ status: 201, description: 'System notification created successfully' })
  async createSystemNotification(@Body() notification: Omit<CreateInAppNotificationDto, 'userId'>) {
    return this.notificationsService.createSystemNotification(notification);
  }

  @Patch('read')
  @ApiOperation({ summary: 'Mark notifications as read' })
  @ApiResponse({ status: 200, description: 'Notifications marked as read' })
  async markAsRead(@Body('notificationIds') notificationIds: number[]) {
    return this.notificationsService.markAsRead(notificationIds);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead() {
    return this.notificationsService.markAllAsRead(1);
  }

  @Patch('archive')
  @ApiOperation({ summary: 'Archive notifications' })
  @ApiResponse({ status: 200, description: 'Notifications archived successfully' })
  async archiveNotifications(@Body('notificationIds') notificationIds: number[]) {
    return this.notificationsService.archiveNotifications(notificationIds);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.delete(id);
  }
}
