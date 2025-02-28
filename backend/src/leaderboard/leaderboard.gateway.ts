import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class LeaderboardGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(LeaderboardGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('websockets initialized');
  }

  handleConnection(client: any) {
    this.logger.log(`client id: ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`client id: ${client.id} disconnected`);
  }

  sendLeaderboardUpdate(data: any) {
    this.io.emit('leaderboardUpdate', data);
  }
}
