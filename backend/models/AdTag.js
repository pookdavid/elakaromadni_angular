module.exports = (sequelize, DataTypes) => {
    const AdTag = sequelize.define('AdTag', {
      ad_id: DataTypes.INTEGER,
      tag_id: DataTypes.INTEGER
    }, {
      timestamps: false
    });
  
    return AdTag;
  };