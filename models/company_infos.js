import Sequelize from 'sequelize';

export default function(sequelize, DataTypes) {
  return sequelize.define('company_infos', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    company_location: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "localisation de l'entreprise"
    },
    company_call_phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: "le numero d'appel de la company"
    },
    company_whatsapp_phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "le numero whatsapp de l'entreprise"
    },
    company_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "EMEFEP"
    },
    company_desc: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "breve description globale de l'entreprise"
    },
    company_logo_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "logo de la company"
    },
    company_email: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    company_slogan: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'company_infos',
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
        name: "unq_company_infos",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "company_email" },
          { name: "company_location" },
        ]
      },
    ]
  });
};
