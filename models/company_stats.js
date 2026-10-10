const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('company_stats', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stat_label: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    stat_value: {
      type: DataTypes.STRING(16),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'company_stats',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
