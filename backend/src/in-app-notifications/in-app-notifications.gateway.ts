import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { InAppNotification } from './entities/in-app-notification.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'notifications',
})
export class InAppNotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(InAppNotificationsGateway.name);
  private readonly clients = new Map<number, Socket>();

  async handleConnection(socket: Socket) {
    try {
      const userId = this.getUserIdFromSocket(socket);
      if (!userId) {
        this.logger.warn('Connection attempt without user ID');
        socket.disconnect();
        return;
      }

      this.clients.set(userId, socket);
      this.logger.log(`Client connected: ${userId}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    try {
      const userId = this.getUserIdFromSocket(socket);
      if (userId) {
        this.clients.delete(userId);
        this.logger.log(`Client disconnected: ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Disconnection error: ${error.message}`);
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('join')
  handleJoin(socket: Socket) {
    try {
      const userId = this.getUserIdFromSocket(socket);
      if (userId) {
        this.clients.set(userId, socket);
        this.logger.log(`User ${userId} joined notifications channel`);
        return { success: true, message: 'Successfully joined notifications channel' };
      }
      return { success: false, message: 'Failed to join notifications channel' };
    } catch (error) {
      this.logger.error(`Join error: ${error.message}`);
      return { success: false, message: 'Failed to join notifications channel' };
    }
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('leave')
  handleLeave(socket: Socket) {
    try {
      const userId = this.getUserIdFromSocket(socket);
      if (userId) {
        this.clients.delete(userId);
        this.logger.log(`User ${userId} left notifications channel`);
        return { success: true, message: 'Successfully left notifications channel' };
      }
      return { success: false, message: 'Failed to leave notifications channel' };
    } catch (error) {
      this.logger.error(`Leave error: ${error.message}`);
      return { success: false, message: 'Failed to leave notifications channel' };
    }
  }

  sendNotification(userId: number, notification: InAppNotification) {
    try {
      const client = this.clients.get(userId);
      if (client) {
        client.emit('new-notification', notification);
        this.logger.log(`Notification sent to user ${userId}`);
        return true;
      }
      this.logger.warn(`User ${userId} is not connected`);
      return false;
    } catch (error) {
      this.logger.error(`Error sending notification: ${error.message}`);
      return false;
    }
  }

  sendSystemNotification(notification: InAppNotification) {
    try {
      this.server.emit('system-notification', notification);
      this.logger.log('System notification broadcasted');
      return true;
    } catch (error) {
      this.logger.error(`Error sending system notification: ${error.message}`);
      return false;
    }
  }

  private getUserIdFromSocket(socket: Socket): number | null {
    try {
      // First try to get from authenticated user data
      if (socket.data?.user?.id) {
        return socket.data.user.id;
      }
      
      // Fallback to query parameter
      const userId = Number(socket.handshake.query.userId);
      return isNaN(userId) ? null : userId;
    } catch {
      return null;
    }
  }
} 