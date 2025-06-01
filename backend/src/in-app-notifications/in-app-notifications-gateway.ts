import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { InAppNotification } from "./entities/in-app-notification.entity";
import { Server } from "http";
import { Socket } from 'socket.io';


// in-app-notifications.gateway.ts
@WebSocketGateway({ cors: true })
export class InAppNotificationsGateway {
  @WebSocketServer()
  server: Server;

  private clients = new Map<number, Socket>();

  handleConnection(socket: Socket) {
    const userId = Number(socket.handshake.query.userId);
    this.clients.set(userId, socket);
  }

  handleDisconnect(socket: Socket) {
    const userId = Number(socket.handshake.query.userId);
    this.clients.delete(userId);
  }

  sendNotification(userId: number, notification: InAppNotification) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit('new-in-app-notification', notification);
    }
  }
}
