module.exports = (sequelize, DataTypes) => {
    const QuestionAnswer = sequelize.define('QuestionAnswer', {
      question: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      tableName: 'questions_answers',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [{
        fields: ['ad_id', 'user_id']
      }]
    });
  
    QuestionAnswer.associate = (models) => {
      QuestionAnswer.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      QuestionAnswer.belongsTo(models.Ad, {
        foreignKey: 'ad_id',
        as: 'ad'
      });
    };
  
    return QuestionAnswer;
  };