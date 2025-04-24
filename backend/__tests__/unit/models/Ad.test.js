const { Ad } = require('../../../models');

describe('Ad Model Unit Tests', () => {
  test('should require title', async () => {
    await expect(
      Ad.create({ price: 100 })
    ).rejects.toThrow('notNull Violation: Title is required');
  });

  test('should validate price is positive', async () => {
    await expect(
      Ad.create({ title: 'Test', price: -100 })
    ).rejects.toThrow('Validation error: Price must be positive');
  });
});