import Sequelize from 'sequelize';

/**
 * 
 * @param {Sequelize} sequelize 
 * @param {Sequelize.DataTypes} DataTypes 
 * @returns 
 */
export default function (sequelize, DataTypes) {
  return sequelize.define('members', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      comment: "identifiant du membre de l'entreprise"
    },
    member_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    member_role: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    member_experience: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      comment: "annees d'experience"
    },
    member_bio: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    member_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    member_category: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    member_phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    member_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "unq_members"
    }
  }, {
    sequelize,
    tableName: 'members',
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
        name: "unq_members",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "member_email" },
        ]
      },
      {
        name: "fk_members_categories",
        using: "BTREE",
        fields: [
          { name: "member_category" },
        ]
      },
    ]
  });
};
