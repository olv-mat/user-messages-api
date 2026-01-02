export const makeRepositoryMock = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
});
