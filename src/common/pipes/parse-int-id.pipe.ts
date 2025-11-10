import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParseIntIdPipe implements PipeTransform {
  public transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type == 'param' && metadata.data == 'id') {
      const parsedValue = Number(value);
      if (isNaN(parsedValue)) {
        throw new BadRequestException(
          'The identifier must be a numeric string',
        );
      }
      if (parsedValue < 0) {
        throw new BadRequestException('The identifier must be greater than 0');
      }
      return parsedValue;
    }
    return value;
  }
}
