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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeController = void 0;
const common_1 = require("@nestjs/common");
const node_path_1 = require("node:path");
const form_submit_dto_1 = require("./dto/form-submit.dto");
const realtime_gateway_1 = require("./realtime.gateway");
let RealtimeController = class RealtimeController {
    realtimeGateway;
    constructor(realtimeGateway) {
        this.realtimeGateway = realtimeGateway;
    }
    getForm(response) {
        response.sendFile((0, node_path_1.join)(process.cwd(), 'public', 'form.html'));
    }
    submitForm(dto) {
        const delivered = this.realtimeGateway.sendFormData(dto.sessionId, {
            fieldOne: dto.fieldOne,
            fieldTwo: dto.fieldTwo,
            submittedAt: new Date().toISOString(),
        });
        if (!delivered) {
            throw new common_1.NotFoundException('Active websocket session not found');
        }
        return { delivered: true };
    }
};
exports.RealtimeController = RealtimeController;
__decorate([
    (0, common_1.Get)('form'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RealtimeController.prototype, "getForm", null);
__decorate([
    (0, common_1.Post)('form/submit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [form_submit_dto_1.FormSubmitDto]),
    __metadata("design:returntype", Object)
], RealtimeController.prototype, "submitForm", null);
exports.RealtimeController = RealtimeController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [realtime_gateway_1.RealtimeGateway])
], RealtimeController);
//# sourceMappingURL=realtime.controller.js.map