//Purchase.js
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    }
  });

  Purchase.associate = models => {
    Purchase.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'buyer'
    });
    
    Purchase.belongsTo(models.Ad, {
      foreignKey: 'ad_id',
      as: 'ad'
    });
  };

  return Purchase;
};