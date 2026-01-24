import { ApiParam } from '@nestjs/swagger';

export const UserIdParam = () => {
  return ApiParam({ name: 'id', description: 'Unique user identifier' });
};
