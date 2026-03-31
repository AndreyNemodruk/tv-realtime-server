export interface SessionInitPayload {
    sessionId: string;
    formUrl: string;
    qrDataUrl: string;
}
export declare class RealtimeService {
    private readonly sessionToSocket;
    private readonly socketToSession;
    registerSession(socketId: string, baseUrl: string): Promise<SessionInitPayload>;
    unregisterSession(socketId: string): void;
    getSocketIdBySession(sessionId: string): string | undefined;
}
