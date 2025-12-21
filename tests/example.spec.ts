/*
  This Spec File Demonstrates The Basic Structure of Unit Tests
  It uses Jest, The Default Test Runner for NestJS
*/

// Test Suite
describe('Example', () => {
  beforeAll(() => {}); // Executed Once Before All Tests
  beforeEach(() => {}); // Executed Before Each Test

  // Test Case
  it('should double the value', () => {
    /* 
      Arrange: Define Test Settings And Dependencies
      Act: Execute The Method or Function Under Test
      Assert: Verify The Result Matches The Expected Outcome
    */
    const value = 4;
    const result = value * 2;
    expect(result).toBe(8);
  });

  // Group of Related Test Scenarios
  describe('when doubling a value', () => {
    it('should return the correct result', () => {
      // Arrange
      // Act
      // Assert
    });
  });

  afterAll(() => {}); // Executed Once After All Tests
  afterEach(() => {}); // Executed After Each Test
});
