module.exports = {
    up: async (queryInterface) => {
      await queryInterface.bulkInsert('tags', [
        { name: 'Used' },
        { name: 'New' }
      ]);
    },
    down: async (queryInterface) => {
      await queryInterface.bulkDelete('tags', null, {});
    }
  };