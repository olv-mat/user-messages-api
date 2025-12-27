export const makeRepositoryMock = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
});
