const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../../../middlewares/auth');
const { User } = require('../../../models');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../../models');

describe('Auth Middleware Unit Tests', () => {
  const mockRequest = (token) => ({
    header: jest.fn().mockReturnValue(token ? `Bearer ${token}` : null)
  });
  const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  });
  const mockNext = jest.fn();

  test('should allow access with valid token', async () => {
    jwt.verify.mockReturnValue({ userId: 1 });
    User.findByPk.mockResolvedValue({ id: 1, username: 'testuser' });

    await authMiddleware(
      mockRequest('validtoken'),
      mockResponse(),
      mockNext
    );

    expect(mockNext).toHaveBeenCalled();
  });

  test('should block access with invalid token', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const res = mockResponse();
    await authMiddleware(
      mockRequest('invalidtoken'),
      res,
      mockNext
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid token'
    });
  });
});