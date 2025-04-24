module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
      },
      payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'payments',
      underscored: true,
      timestamps: false
    });
  
    Payment.associate = (models) => {
      Payment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'buyer'
      });
      Payment.belongsTo(models.Ad, {
        foreignKey: 'ad_id',
        as: 'ad'
      });
    };
  
    return Payment;
  };