const request = require('supertest');
const app = require('../../server');
const { User } = require('../../models');
const { testUser, adminUser } = require('../testData');

describe('Auth API', () => {
  beforeAll(async () => {
    await User.create(adminUser);
  });

  // REGISTER
  describe('POST /register', () => {
    test('should register new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
    });

    test('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, username: 'different' });
      
      expect(res.status).toBe(409);
    });
  });

  // LOGIN
  describe('POST /login', () => {
    test('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    test('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
    });
  });
});