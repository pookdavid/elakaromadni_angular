const { User, Ad, CarSpec, Category } = require('../models');

module.exports = {
  up: async () => {
    await Category.findOrCreate({
      where: { id: 1 },
      defaults: { name: 'Cars' }
    });

    const user = await User.create({
      username: 'test_seller',
      email: 'seller@example.com',
      password_hash: '$2b$10$QhW5k0uGHH7Ujzrca2HW6eDi2W8kjeuXtRWh2KvZXjVRezOql8P7u',
      role: 'seller'
    });

    const ad = await Ad.create({
      brand: 'Toyota',
      model: 'Corolla',
      price: 18500,
      seller_id: user.id,
      category_id: 1,
      location: 'Budapest',
      description: 'Low mileage, excellent condition'
    });

    await CarSpec.create({
      ad_id: ad.id,
      year: 2022,
      mileage: 15000,
      fuel_type: 'gasoline',
      images: ['car2.jpg']
    });
  }
};