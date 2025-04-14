module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
      name: DataTypes.STRING
    });
  
    Tag.associate = models => {
      Tag.belongsToMany(models.Ad, {
        through: models.AdTag,
        foreignKey: 'tag_id',
        as: 'ads'
      });
    };
  
    return Tag;
  };