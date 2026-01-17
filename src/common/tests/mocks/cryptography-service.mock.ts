export const makeCryptographyServiceMock = () => ({
  hash: jest.fn(),
  compare: jest.fn(),
});
