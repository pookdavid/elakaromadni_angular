require('dotenv').config({ path: '.env.test' });
const { sequelize } = require('../models');

// Ensure database is clean before tests
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Close connection after all tests
afterAll(async () => {
  await sequelize.close();
});