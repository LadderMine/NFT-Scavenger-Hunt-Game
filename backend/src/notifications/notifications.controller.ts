import { Controller, Get, Post, Param, UseGuards, Req, Query, ParseIntPipe, DefaultValuePipe } from "@nestjs/common"
import type { NotificationsService } from "./notifications.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getUserNotifications(
    @Req() req,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.notificationsService.getUserNotifications(req.user.id, limit, offset)
  }

  @Post(":id/read")
  markAsRead(@Param('id') id: string, @Req() req) {
    return this.notificationsService.markNotificationAsRead(id, req.user.id)
  }

  @Post('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllNotificationsAsRead(req.user.id);
  }
}

