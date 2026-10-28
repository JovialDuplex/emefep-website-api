import Sequelize from 'sequelize';

export default function (sequelize, DataTypes) {
  return sequelize.define('categories', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
  }, {
    sequelize,
    tableName: 'categories',
    timestamps: true,
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
