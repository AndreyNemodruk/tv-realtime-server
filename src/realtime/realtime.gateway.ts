import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import WebSocket from 'ws';
import { RealtimeService } from './realtime.service';

@WebSocketGateway({
  path: '/ws',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly realtimeService: RealtimeService) {}

  private readonly clientsByConnectionId = new Map<string, WebSocket>();
  private readonly connectionIdByClient = new WeakMap<WebSocket, string>();

  async handleConnection(client: WebSocket, request: IncomingMessage): Promise<void> {
    const connectionId = randomUUID();
    this.clientsByConnectionId.set(connectionId, client);
    this.connectionIdByClient.set(client, connectionId);

    const initPayload = await this.realtimeService.registerSession(
      connectionId,
      this.getBaseUrl(request),
    );

    client.send(
      JSON.stringify({
        type: 'session.init',
        payload: initPayload,
      }),
    );
  }

  handleDisconnect(client: WebSocket): void {
    const connectionId = this.connectionIdByClient.get(client);

    if (!connectionId) {
      return;
    }

    this.connectionIdByClient.delete(client);
    this.clientsByConnectionId.delete(connectionId);
    this.realtimeService.unregisterSession(connectionId);
  }

  sendFormData(
    sessionId: string,
    payload: { fieldOne: string; fieldTwo: string; submittedAt: string },
  ): boolean {
    const socketId = this.realtimeService.getSocketIdBySession(sessionId);

    if (!socketId) {
      return false;
    }

    const client = this.clientsByConnectionId.get(socketId);

    if (!client || client.readyState !== WebSocket.OPEN) {
      return false;
    }

    client.send(
      JSON.stringify({
        type: 'form.submitted',
        payload,
      }),
    );
    return true;
  }

  private getBaseUrl(request: IncomingMessage): string {
    const host = request.headers.host ?? 'localhost:3002';
    const forwardedProto = request.headers['x-forwarded-proto'];
    const protocol =
      typeof forwardedProto === 'string' && forwardedProto.length > 0
        ? forwardedProto
        : 'http';

    return `${protocol}://${host}`;
  }
}
