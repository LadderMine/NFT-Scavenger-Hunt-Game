import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseUUIDPipe } from "@nestjs/common"
import type { NotificationService } from "../services/notification.service"
import type { NotificationQueryDto } from "../dto/notification-query.dto"
import type { UpdateNotificationDto } from "../dto/update-notification.dto"
import type { Notification } from "../entities/notification.entity"

@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Query() query: NotificationQueryDto) {
    return this.notificationService.getNotifications(query);
  }

  @Get(':id')
  async getNotificationById(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    return this.notificationService.getNotificationById(id);
  }

  @Put(":id")
  async updateNotification(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationService.updateNotification(id, updateDto)
  }

  @Put(':id/read')
  async markAsRead(@Param('id', ParseUUIDPipe) id: string): Promise<Notification> {
    return this.notificationService.markAsRead(id);
  }

  @Put('user/:userId/read-all')
  async markAllAsRead(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ message: string }> {
    await this.notificationService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  @Get('user/:userId/unread-count')
  async getUnreadCount(@Param('userId', ParseUUIDPipe) userId: string): Promise<{ count: number }> {
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Delete(':id')
  async deleteNotification(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.notificationService.deleteNotification(id);
    return { message: 'Notification deleted successfully' };
  }

  @Post('cleanup')
  async cleanupOldNotifications(@Query('days') days?: number): Promise<{ deletedCount: number }> {
    const deletedCount = await this.notificationService.cleanupOldNotifications(days);
    return { deletedCount };
  }
}
