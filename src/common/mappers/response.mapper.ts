import { DefaultResponseDto } from '../dtos/DefaultResponse.dto';

export class ResponseMapper {
  public static toAResponse(id: number, message: string): DefaultResponseDto {
    return new DefaultResponseDto(id, message);
  }
}
