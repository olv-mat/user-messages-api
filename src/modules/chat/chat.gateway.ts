import { Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CredentialService } from 'src/common/modules/credential/credential.service';

/* 
  nest g ga <gateway> 
  npm i @nestjs/websockets @nestjs/platform-socket.io 
*/

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly credentialService: CredentialService) {}

  public sendMessage(recipient: number, message: string): void {
    this.server.to(`user:${recipient}`).emit('message', message);
  }

  public onModuleInit(): void {
    this.server.on('connection', async (socket) => {
      const id = socket.id;
      const user = await this.authenticate(socket);
      if (!user) {
        socket.disconnect();
        this.logger.error(`WebSocket ${id} connection refused`);
        return;
      }
      void socket.join(`user:${user.sub}`);
      this.logger.log(`WebSocket ${id} connected successfully`);
    });
  }

  private async authenticate(socket: Socket): Promise<UserInterface | null> {
    const token = socket.handshake.headers.authorization;
    if (!token) return null;
    try {
      return await this.credentialService.verify<UserInterface>(token);
    } catch {
      return null;
    }
  }
}
