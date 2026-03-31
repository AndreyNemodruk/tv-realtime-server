import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import * as QRCode from 'qrcode';

export interface SessionInitPayload {
  sessionId: string;
  formUrl: string;
  qrDataUrl: string;
}

@Injectable()
export class RealtimeService {
  private readonly sessionToSocket = new Map<string, string>();
  private readonly socketToSession = new Map<string, string>();

  async registerSession(
    socketId: string,
    baseUrl: string,
  ): Promise<SessionInitPayload> {
    const sessionId = randomUUID();
    const formUrl = `${baseUrl}/form?sessionId=${encodeURIComponent(sessionId)}`;
    const qrDataUrl = await QRCode.toDataURL(formUrl);

    this.sessionToSocket.set(sessionId, socketId);
    this.socketToSession.set(socketId, sessionId);

    return {
      sessionId,
      formUrl,
      qrDataUrl,
    };
  }

  unregisterSession(socketId: string): void {
    const sessionId = this.socketToSession.get(socketId);

    if (!sessionId) {
      return;
    }

    this.socketToSession.delete(socketId);
    this.sessionToSocket.delete(sessionId);
  }

  getSocketIdBySession(sessionId: string): string | undefined {
    return this.sessionToSocket.get(sessionId);
  }
}
