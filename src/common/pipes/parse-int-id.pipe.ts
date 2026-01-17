import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParseIntIdPipe implements PipeTransform {
  public transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type == 'param' && metadata.data == 'id') {
      const parsedValue = Number(value);
      if (isNaN(parsedValue) || parsedValue < 0) {
        throw new BadRequestException('Inavlid identifier');
      }
      return parsedValue;
    }
    return value;
  }
}
