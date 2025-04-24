const request = require('supertest');
const app = require('../../server');
const { Message, User, Ad } = require('../../models');
const { testUser, sampleAd, sampleMessage } = require('../testData');

describe('Messages API', () => {
  let authToken;
  let testAdId;

  beforeAll(async () => {
    const user = await User.create(testUser);
    const ad = await Ad.create({ ...sampleAd, seller_id: user.id });
    testAdId = ad.id;

    const res = await request(app)
      .post('/api/auth/login')
      .send(testUser);
    authToken = res.body.token;
  });

  test('POST /messages - should send message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ ...sampleMessage, ad_id: testAdId });
    
    expect(res.status).toBe(201);
    expect(res.body.content).toBe(sampleMessage.content);
  });

  test('GET /messages - should fetch conversations', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});