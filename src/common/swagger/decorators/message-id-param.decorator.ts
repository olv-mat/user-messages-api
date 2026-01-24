import { ApiParam } from '@nestjs/swagger';

export const MessageIdParm = () => {
  return ApiParam({ name: 'id', description: 'Unique message identifier' });
};
