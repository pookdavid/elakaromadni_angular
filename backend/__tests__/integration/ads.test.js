const request = require('supertest');
const app = require('../../server');
const { Ad, Tag } = require('../../models');
const { testUser, sampleAd } = require('../testData');

describe('Ads API', () => {
  let authToken;

  beforeAll(async () => {
    await Tag.bulkCreate([{ id: 1, name: 'Used' }, { id: 2, name: 'Like New' }]);
    
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    authToken = res.body.token;
  });

  test('POST /ads - should create ad with tags', async () => {
    const res = await request(app)
      .post('/api/ads')
      .set('Authorization', `Bearer ${authToken}`)
      .send(sampleAd);
    
    expect(res.status).toBe(201);
    expect(res.body.tags.length).toBe(2);
  });

  test('GET /ads/search - should filter by price', async () => {
    const res = await request(app)
      .get('/api/ads/search?maxPrice=20000');
    
    expect(res.status).toBe(200);
    expect(res.body.every(ad => ad.price <= 20000)).toBe(true);
  });
});