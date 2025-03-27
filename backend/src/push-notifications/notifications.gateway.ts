import {
  WebSocketGateway,
  WebSocketServer,
  type OnGatewayInit,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from "@nestjs/websockets"
import type { Server, Socket } from "socket.io"
import { Logger } from "@nestjs/common"
import type { Notification } from "./entities/notification.entity"

@WebSocketGateway({
  cors: {
    origin: "*", // In production, specify your frontend URL
  },
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  private logger: Logger = new Logger("NotificationsGateway")
  private userSocketMap: Map<string, string[]> = new Map()

  afterInit(server: Server) {
    this.logger.log("Notifications WebSocket Gateway initialized")
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)

    // Remove client from userSocketMap
    this.userSocketMap.forEach((socketIds, userId) => {
      const index = socketIds.indexOf(client.id)
      if (index !== -1) {
        socketIds.splice(index, 1)
        if (socketIds.length === 0) {
          this.userSocketMap.delete(userId)
        }
      }
    })
  }

  // Client calls this method to register for notifications
  handleUserRegistration(client: Socket, userId: string) {
    if (!this.userSocketMap.has(userId)) {
      this.userSocketMap.set(userId, [])
    }

    const socketIds = this.userSocketMap.get(userId)
    if (!socketIds.includes(client.id)) {
      socketIds.push(client.id)
    }

    this.logger.log(`User ${userId} registered with socket ${client.id}`)
  }

  // Send notification to specific user
  sendNotificationToUser(userId: string, notification: Notification) {
    const socketIds = this.userSocketMap.get(userId)

    if (socketIds && socketIds.length > 0) {
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit("notification", notification)
      })
      this.logger.log(`Notification sent to user ${userId}`)
    }
  }

  // Send notification to all connected clients
  sendNotificationToAll(notification: Notification) {
    this.server.emit("notification", notification)
    this.logger.log("System-wide notification sent to all users")
  }
}

