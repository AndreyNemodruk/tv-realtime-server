import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { IncomingMessage } from 'node:http';
import WebSocket from 'ws';
import { RealtimeService } from './realtime.service';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly realtimeService;
    constructor(realtimeService: RealtimeService);
    private readonly clientsByConnectionId;
    private readonly connectionIdByClient;
    handleConnection(client: WebSocket, request: IncomingMessage): Promise<void>;
    handleDisconnect(client: WebSocket): void;
    sendFormData(sessionId: string, payload: {
        fieldOne: string;
        fieldTwo: string;
        submittedAt: string;
    }): boolean;
    private getBaseUrl;
}
