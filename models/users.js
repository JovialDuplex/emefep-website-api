import Sequelize from 'sequelize';

export default function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_full_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    user_phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: "unq_users_phone"
    },
    user_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    user_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: "unq_users_email"
    },
    user_date_register: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: () => new Date().toISOString().split('T')[0]
    },
    user_role: {
      type: DataTypes.ENUM('admin','client'),
      allowNull: false,
      defaultValue: "client"
    },
    user_firebase_uid: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: "unq_users_firebase_uid"
    },
    user_auth_provider: {
      type: DataTypes.ENUM('google','facebook','github','password'),
      allowNull: false,
      defaultValue: "password"
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "unq_users_email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_email" },
        ]
      },
      {
        name: "unq_users_firebase_uid",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_firebase_uid" },
        ]
      },
      {
        name: "unq_users_phone",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_phone" },
        ]
      },
    ]
  });
};
