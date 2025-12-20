import {
  HttpStatus,
  ParseFilePipeBuilder,
  UnprocessableEntityException,
  UploadedFile,
} from '@nestjs/common';

export const PictureUpload = (size = 10) => {
  return UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /image\/(jpeg|png)/,
      })
      .addMaxSizeValidator({
        maxSize: size * 1024 * 1024,
      })
      .build({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory: () => {
          return new UnprocessableEntityException(
            'Invalid picture format or size',
          );
        },
      }),
  );
};
