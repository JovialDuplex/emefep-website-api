import Sequelize from 'sequelize';
/**
 * 
 * @param {Sequelize} sequelize 
 * @param {import('sequelize').DataTypes} DataTypes 
 * @returns 
 */
export default function(sequelize, DataTypes) {
  
  return sequelize.define('service', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
      type: DataTypes.JSON,
      allowNull: true,
      comment: "details sur le service"
    },
    service_category: {
      type: DataTypes.UUID,
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
