import { IsNotEmpty, IsString } from 'class-validator';

export class FormSubmitDto {
  @IsString()
  @IsNotEmpty()
  sessionId!: string;

  @IsString()
  @IsNotEmpty()
  fieldOne!: string;

  @IsString()
  @IsNotEmpty()
  fieldTwo!: string;
}
