import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Res,
} from '@nestjs/common';
import { join } from 'node:path';
import type { Response } from 'express';
import { FormSubmitDto } from './dto/form-submit.dto';
import { RealtimeGateway } from './realtime.gateway';

@Controller()
export class RealtimeController {
  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  @Get('form')
  getForm(@Res() response: Response): void {
    response.sendFile(join(process.cwd(), 'public', 'form.html'));
  }

  @Post('form/submit')
  submitForm(@Body() dto: FormSubmitDto): { delivered: true } {
    const delivered = this.realtimeGateway.sendFormData(dto.sessionId, {
      fieldOne: dto.fieldOne,
      fieldTwo: dto.fieldTwo,
      submittedAt: new Date().toISOString(),
    });

    if (!delivered) {
      throw new NotFoundException('Active websocket session not found');
    }

    return { delivered: true };
  }
}
