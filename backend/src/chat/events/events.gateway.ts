import {
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import type { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSocketMap: Map<string, string[]> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Store socket connection
      const userSockets = this.userSocketMap.get(userId) || [];
      userSockets.push(client.id);
      this.userSocketMap.set(userId, userSockets);

      // Join user's room
      client.join(userId);

      // Update user's online status
      await this.userRepository.update(userId, { isOnline: true });

      // Broadcast user's online status to others
      this.server.emit('user:status', { userId, isOnline: true });

      // Store userId in socket data
      client.data.userId = userId;
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (userId) {
      // Remove socket from map
      const userSockets = this.userSocketMap.get(userId) || [];
      const updatedSockets = userSockets.filter((id) => id !== client.id);

      if (updatedSockets.length === 0) {
        // User has no more active connections
        this.userSocketMap.delete(userId);

        // Update user's online status
        await this.userRepository.update(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        // Broadcast user's offline status to others
        this.server.emit('user:status', { userId, isOnline: false });
      } else {
        this.userSocketMap.set(userId, updatedSockets);
      }
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    client: Socket,
    payload: { conversationId: string; isTyping: boolean },
  ) {
    const userId = client.data.userId;

    if (userId && payload.conversationId) {
      // Broadcast to conversation room except sender
      client.to(payload.conversationId).emit('user:typing', {
        userId,
        conversationId: payload.conversationId,
        isTyping: payload.isTyping,
      });
    }
  }

  sendEvent(userId: string, event: string, data: any) {
    this.server.to(userId).emit(event, data);
  }

  sendToConversation(
    conversationId: string,
    event: string,
    data: any,
    excludeUserId?: string,
  ) {
    if (excludeUserId) {
      this.server.to(conversationId).except(excludeUserId).emit(event, data);
    } else {
      this.server.to(conversationId).emit(event, data);
    }
  }
}
