const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('service', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "identifiant du service"
    },
    service_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: "nom du service"
    },
    service_desc: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "description du service"
    },
    service_image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "image de presentation du service"
    },
    service_details: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "json_object('intervention_time','2 jours')",
      comment: "details sur le service"
    },
    service_created_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: () => new Date().toISOString().split('T')[0],
      comment: "date de publication du service"
    },
    service_category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    service_slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "unq_service"
    }
  }, {
    sequelize,
    tableName: 'service',
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
        name: "unq_service",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "service_slug" },
        ]
      },
      {
        name: "fk_service_categories",
        using: "BTREE",
        fields: [
          { name: "service_category" },
        ]
      },
    ]
  });
};
