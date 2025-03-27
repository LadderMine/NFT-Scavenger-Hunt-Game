import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from "@nestjs/common"
import type { NotificationsService } from "./notifications.service"
import type { CreateNotificationDto } from "./dto/create-notification.dto"
import type { Notification, NotificationType } from "./entities/notification.entity"
import type { PaginationDto } from "./dto/pagination.dto"
import type { FilterNotificationsDto } from "./dto/filter-notifications.dto"
import type { NotificationIdsDto } from "./dto/notification-ids.dto"

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post('system')
  createSystemNotification(
    @Body() payload: { title: string; message: string; type?: NotificationType }
  ): Promise<Notification> {
    return this.notificationsService.createSystemNotification(
      payload.title,
      payload.message,
      payload.type
    );
  }

  @Post('bulk')
  createForMultipleUsers(
    @Body() payload: { 
      userIds: string[]; 
      title: string; 
      message: string; 
      type?: NotificationType 
    }
  ): Promise<Notification[]> {
    return this.notificationsService.createNotificationForMultipleUsers(
      payload.userIds,
      payload.title,
      payload.message,
      payload.type
    );
  }

  @Post('template')
  createFromTemplate(
    @Body() payload: { 
      templateKey: string; 
      userId?: string; 
      params?: Record<string, any> 
    }
  ): Promise<Notification> {
    return this.notificationsService.createFromTemplate(
      payload.templateKey,
      payload.userId || null,
      payload.params
    );
  }

  @Post('schedule')
  scheduleNotification(
    @Body() payload: { 
      notification: CreateNotificationDto; 
      scheduledDate: string 
    }
  ): { jobId: string } {
    const jobId = this.notificationsService.scheduleNotification(
      payload.notification,
      new Date(payload.scheduledDate)
    );
    return { jobId };
  }

  @Delete('schedule/:jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelScheduledNotification(@Param('jobId') jobId: string): void {
    this.notificationsService.cancelScheduledNotification(jobId);
  }

  @Get()
  findAll(@Query() filterDto: FilterNotificationsDto, @Query() paginationDto: PaginationDto) {
    if (filterDto.userId) {
      return this.notificationsService.findWithFilters(filterDto, paginationDto)
    }

    // If no userId is provided, return filtered notifications
    return this.notificationsService.findWithFilters(filterDto, paginationDto)
  }

  @Get("user/:userId")
  findAllForUser(@Param('userId', ParseUUIDPipe) userId: string, @Query() paginationDto: PaginationDto) {
    return this.notificationsService.findAllForUser(userId, paginationDto)
  }

  @Get('user/:userId/unread/count')
  countUnread(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ count: number }> {
    return this.notificationsService.countUnreadForUser(userId)
      .then(count => ({ count }));
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    try {
      return await this.notificationsService.markAsRead(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Failed to mark notification as read`);
    }
  }

  @Patch('read/bulk')
  async markMultipleAsRead(@Body() dto: NotificationIdsDto): Promise<{ affected: number }> {
    const affected = await this.notificationsService.markMultipleAsRead(dto.ids);
    return { affected };
  }

  @Patch('read/all/:userId')
  async markAllAsReadForUser(
    @Param('userId', ParseUUIDPipe) userId: string
  ): Promise<{ affected: number }> {
    const affected = await this.notificationsService.markAllAsReadForUser(userId);
    return { affected };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.notificationsService.delete(id);
  }

  @Delete('bulk')
  async deleteMultiple(@Body() dto: NotificationIdsDto): Promise<{ affected: number }> {
    const affected = await this.notificationsService.deleteMultiple(dto.ids);
    return { affected };
  }

  @Delete('user/:userId')
  async deleteAllForUser(
    @Param('userId', ParseUUIDPipe) userId: string
  ): Promise<{ affected: number }> {
    const affected = await this.notificationsService.deleteAllForUser(userId);
    return { affected };
  }

  @Delete('cleanup')
  async cleanupOldNotifications(
    @Query('olderThan') olderThan: string
  ): Promise<{ affected: number }> {
    const date = olderThan ? new Date(olderThan) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days
    const affected = await this.notificationsService.deleteOldNotifications(date);
    return { affected };
  }
}

