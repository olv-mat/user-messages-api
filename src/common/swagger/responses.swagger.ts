import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const SwaggerBadRequest = (message: string) =>
  ApiBadRequestResponse({
    schema: {
      example: {
        message: message,
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  });

export const SwaggerUnauthorized = (message: string) =>
  ApiUnauthorizedResponse({
    schema: {
      example: {
        message: message,
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  });

export const SwaggerForbidden = (message: string) =>
  ApiForbiddenResponse({
    schema: {
      example: {
        message: message,
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  });

export const SwaggerNotFound = (message: string) =>
  ApiNotFoundResponse({
    schema: {
      example: {
        message: message,
        error: 'Not Found',
        statusCode: 404,
      },
    },
  });

export const SwaggerConflict = (message: string) =>
  ApiConflictResponse({
    schema: {
      example: {
        message: message,
        error: 'Conflict',
        statusCode: 409,
      },
    },
  });

export const SwaggerInternalServerError = () =>
  ApiInternalServerErrorResponse({
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
  });
