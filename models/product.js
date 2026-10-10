const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "identifiant unique a chaque produit"
    },
    product_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "nom du produit"
    },
    product_price: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
      defaultValue: 5000.00,
      comment: "prix du produit"
    },
    product_desc: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "description du produit"
    },
    product_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    product_details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "unq_product"
    },
    product_image: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    product_created_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: () => new Date().toISOString().split('T')[0]
    }
  }, {
    sequelize,
    tableName: 'product',
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
        name: "unq_product",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_slug" },
        ]
      },
      {
        name: "fk_product_categories",
        using: "BTREE",
        fields: [
          { name: "product_category" },
        ]
      },
    ]
  });
};
