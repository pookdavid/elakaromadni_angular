const { sequelize } = require('../models');
const { User, Ad, Tag, Message } = require('../models');

async function initialize() {
  try {
    await sequelize.sync({ force: true }); 
    
    await Tag.bulkCreate([
      { id: 1, name: 'Used' },
      { id: 2, name: 'Like New' }
    ]);

    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: 'admin'
    });

    console.log(' Database initialized');
  } catch (error) {
    console.error(' Initialization failed:', error);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  initialize();
}

module.exports = initialize;