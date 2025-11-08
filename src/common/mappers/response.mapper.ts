import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ActionResponseDto } from '../dtos/ActionResponse.dto';
import { MessageResponseDto } from '../dtos/MessageResponse.dto';

@Injectable()
export class ResponseMapper {
  public toResponse<T>(
    cls: new (...args: any[]) => T,
    plain: object | object[],
  ): T | T[] {
    return plainToInstance(cls, plain, { excludeExtraneousValues: true });
  }

  public toActionResponse(id: number, message: string): ActionResponseDto {
    return new ActionResponseDto(id, message);
  }

  public toMessageResponse(message: string): MessageResponseDto {
    return new MessageResponseDto(message);
  }
}
