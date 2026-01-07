import { Readable } from 'stream';

export const makePicture = (): Express.Multer.File => ({
  fieldname: 'picture',
  originalname: 'test.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: 2000,
  buffer: Buffer.from('file content'),
  destination: '',
  filename: 'test.png',
  path: '',
  stream: Readable.from(Buffer.from('file content')),
});
