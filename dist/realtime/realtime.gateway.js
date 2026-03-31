"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const node_crypto_1 = require("node:crypto");
const ws_1 = __importDefault(require("ws"));
const realtime_service_1 = require("./realtime.service");
let RealtimeGateway = class RealtimeGateway {
    realtimeService;
    constructor(realtimeService) {
        this.realtimeService = realtimeService;
    }
    clientsByConnectionId = new Map();
    connectionIdByClient = new WeakMap();
    async handleConnection(client, request) {
        const connectionId = (0, node_crypto_1.randomUUID)();
        this.clientsByConnectionId.set(connectionId, client);
        this.connectionIdByClient.set(client, connectionId);
        const initPayload = await this.realtimeService.registerSession(connectionId, this.getBaseUrl(request));
        client.send(JSON.stringify({
            type: 'session.init',
            payload: initPayload,
        }));
    }
    handleDisconnect(client) {
        const connectionId = this.connectionIdByClient.get(client);
        if (!connectionId) {
            return;
        }
        this.connectionIdByClient.delete(client);
        this.clientsByConnectionId.delete(connectionId);
        this.realtimeService.unregisterSession(connectionId);
    }
    sendFormData(sessionId, payload) {
        const socketId = this.realtimeService.getSocketIdBySession(sessionId);
        if (!socketId) {
            return false;
        }
        const client = this.clientsByConnectionId.get(socketId);
        if (!client || client.readyState !== ws_1.default.OPEN) {
            return false;
        }
        client.send(JSON.stringify({
            type: 'form.submitted',
            payload,
        }));
        return true;
    }
    getBaseUrl(request) {
        const host = request.headers.host ?? 'localhost:3002';
        const forwardedProto = request.headers['x-forwarded-proto'];
        const protocol = typeof forwardedProto === 'string' && forwardedProto.length > 0
            ? forwardedProto
            : 'http';
        return `${protocol}://${host}`;
    }
};
exports.RealtimeGateway = RealtimeGateway;
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        path: '/ws',
    }),
    __metadata("design:paramtypes", [realtime_service_1.RealtimeService])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map