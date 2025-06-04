import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from "@nestjs/websockets"
import type { Server, Socket } from "socket.io"
import { Logger } from "@nestjs/common"
import type { Notification } from "../entities/notification.entity"

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/notifications",
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(NotificationGateway.name)
  private userSockets = new Map<string, Set<string>>() // userId -> Set of socketIds

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)

    // Remove socket from user mapping
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id)
        if (sockets.size === 0) {
          this.userSockets.delete(userId)
        }
        break
      }
    }
  }

  @SubscribeMessage("join")
  handleJoin(data: { userId: string }, client: Socket) {
    const { userId } = data

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set())
    }

    this.userSockets.get(userId)!.add(client.id)
    client.join(`user:${userId}`)

    this.logger.log(`User ${userId} joined with socket ${client.id}`)

    client.emit("joined", { userId, message: "Successfully joined notification channel" })
  }

  @SubscribeMessage("leave")
  handleLeave(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    const { userId } = data

    client.leave(`user:${userId}`)

    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id)
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId)
      }
    }

    this.logger.log(`User ${userId} left with socket ${client.id}`)
  }

  async sendNotificationToUser(userId: string, notification: Notification) {
    const room = `user:${userId}`

    this.server.to(room).emit("notification", {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      status: notification.status,
      data: notification.data,
      createdAt: notification.createdAt,
    })

    this.logger.log(`Notification sent to user ${userId}: ${notification.title}`)
  }

  async sendBroadcastNotification(notification: Omit<Notification, "userId">) {
    this.server.emit("broadcast", {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      createdAt: notification.createdAt,
    })

    this.logger.log(`Broadcast notification sent: ${notification.title}`)
  }

  getConnectedUsers(): string[] {
    return Array.from(this.userSockets.keys())
  }

  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0
  }
}
