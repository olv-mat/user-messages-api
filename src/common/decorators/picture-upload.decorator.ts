import {
  HttpStatus,
  ParseFilePipeBuilder,
  UnprocessableEntityException,
  UploadedFile,
} from '@nestjs/common';

export const PictureUpload = () => {
  return UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /image\/(jpeg|png)/,
      })
      .addMaxSizeValidator({
        maxSize: 10 * 1024 * 1024,
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
