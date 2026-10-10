const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('projects', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    project_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    project_desc: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    project_client_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    project_demo_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    project_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    project_end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "NULL = projet en cours"
    },
    project_slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "unq_projects"
    },
    project_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'projects',
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
        name: "unq_projects",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "project_slug" },
        ]
      },
      {
        name: "fk_projects_categories",
        using: "BTREE",
        fields: [
          { name: "project_category" },
        ]
      },
    ]
  });
};
