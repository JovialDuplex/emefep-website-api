const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('categories', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    category_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    category_slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: "unq_categories_slug"
    },
    category_desc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category_image_preview: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    category_created_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: () => new Date().toISOString().split('T')[0]
    }
  }, {
    sequelize,
    tableName: 'categories',
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
      {
        name: "unq_categories_slug",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "category_slug" },
        ]
      },
    ]
  });
};
