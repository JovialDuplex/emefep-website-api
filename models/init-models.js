const { dbConnector } = require("../config/config");
const { Sequelize } = require("sequelize");
const { deleteUploadedFile } = require("../utils/deleteUploadedFile");
const categories = require("./categories");
const company_infos = require("./company_infos");
const company_stats = require("./company_stats");
const members = require("./members");
const product = require("./product");
const projects = require("./projects");
const service = require("./service");
const users = require("./users");

const DataTypes = Sequelize.DataTypes;

function initModels(sequelize) {
  const Category = categories(sequelize, DataTypes);
  const CompanyInfo = company_infos(sequelize, DataTypes);
  const CompanyStat = company_stats(sequelize, DataTypes);
  const Member = members(sequelize, DataTypes);
  const Product = product(sequelize, DataTypes);
  const Project = projects(sequelize, DataTypes);
  const Service = service(sequelize, DataTypes);
  const User = users(sequelize, DataTypes);

  Member.belongsTo(Category, { as: "member_category_category", foreignKey: "member_category" });
  Category.hasMany(Member, { as: "members", foreignKey: "member_category" });
  Product.belongsTo(Category, { as: "product_category_category", foreignKey: "product_category" });
  Category.hasMany(Product, { as: "products", foreignKey: "product_category" });
  Project.belongsTo(Category, { as: "project_category_category", foreignKey: "project_category" });
  Category.hasMany(Project, { as: "projects", foreignKey: "project_category" });
  Service.belongsTo(Category, { as: "service_category_category", foreignKey: "service_category" });
  Category.hasMany(Service, { as: "services", foreignKey: "service_category" });

  Service.afterDestroy(async (serviceItem) => {
    await deleteUploadedFile(serviceItem.service_image);
  });

  Service.beforeUpdate(async (serviceItem) => {
    if (serviceItem.changed("service_image")) {
      await deleteUploadedFile(serviceItem._previousDataValues.service_image);
    }
  });

  Member.afterDestroy(async (member) => {
    await deleteUploadedFile(member.member_image);
  });

  Member.beforeUpdate(async (member) => {
    if (member.changed("member_image")) {
      const oldImage = member._previousDataValues.member_image;
      console.log(`[Hook beforeUpdate] Suppression de l'ancienne image : ${oldImage}`);
      await deleteUploadedFile(oldImage);
    }
  });

  Category.afterDestroy(async (category) => {
    await deleteUploadedFile(category.category_image_preview);
  });

  Category.beforeUpdate(async (category) => {
    if (category.changed("category_name")) {
      console.log("l'image de la category a ete modifiee");
      category.category_slug = "@" + category.category_name.toLowerCase().replace(/\s+/g, "-");
    }
  });

  Category.afterUpdate(async (category) => {
    if (category.changed("category_image_preview")) {
      const oldImage = category._previousDataValues.category_image_preview;
      console.log(`[Hook afterUpdate] Suppression de l'ancienne image : ${oldImage}`);
      await deleteUploadedFile(oldImage);
    }
  });

  return {
    Category,
    CompanyInfo,
    CompanyStat,
    Member,
    Product,
    Project,
    Service,
    User,
  };
}

const models = initModels(dbConnector);

const {
  Category,
  CompanyInfo,
  CompanyStat,
  Member,
  Product,
  Project,
  Service,
  User,
} = models;

module.exports = {
  Category,
  CompanyInfo,
  CompanyStat,
  Member,
  Product,
  Project,
  Service,
  User,
};
