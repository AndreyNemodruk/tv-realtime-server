import type { Response } from 'express';
import { FormSubmitDto } from './dto/form-submit.dto';
import { RealtimeGateway } from './realtime.gateway';
export declare class RealtimeController {
    private readonly realtimeGateway;
    constructor(realtimeGateway: RealtimeGateway);
    getForm(response: Response): void;
    submitForm(dto: FormSubmitDto): {
        delivered: true;
    };
}
