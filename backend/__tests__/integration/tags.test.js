const request = require('supertest');
const app = require('../../server');
const { Tag } = require('../../models');

describe('Tags API', () => {
  beforeAll(async () => {
    await Tag.bulkCreate([
      { id: 1, name: 'Used' },
      { id: 2, name: 'Like New' }
    ]);
  });

  test('GET /tags - should list all tags', async () => {
    const res = await request(app).get('/api/tags');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});