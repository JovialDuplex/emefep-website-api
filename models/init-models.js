const { dbConnector } = require("../config/config");
const { Sequelize } = require("sequelize");
const { deleteUploadedFile } = require("../utils/deleteUploadedFile");

var DataTypes = Sequelize.DataTypes;
var _categories = require("./categories");
var _company_infos = require("./company_infos");
var _company_stats = require("./company_stats");
var _members = require("./members");
var _product = require("./product");
var _projects = require("./projects");
var _service = require("./service");
var _users = require("./users");

/**
 * Initialise les modeles de la base de donnee 
 * @param {Sequelize} sequelize 
 * @returns 
 */
function initModels(sequelize) {
  var Category = _categories(sequelize, DataTypes);
  var CompanyInfo = _company_infos(sequelize, DataTypes);
  var CompanyStat = _company_stats(sequelize, DataTypes);
  var Member = _members(sequelize, DataTypes);
  var Product = _product(sequelize, DataTypes);
  var Project = _projects(sequelize, DataTypes);
  var Service = _service(sequelize, DataTypes);
  var User = _users(sequelize, DataTypes);

  Member.belongsTo(Category, { as: "member_category_category", foreignKey: "member_category" });
  Category.hasMany(Member, { as: "members", foreignKey: "member_category" });
  Product.belongsTo(Category, { as: "product_category_category", foreignKey: "product_category" });
  Category.hasMany(Product, { as: "products", foreignKey: "product_category" });
  Project.belongsTo(Category, { as: "project_category_category", foreignKey: "project_category" });
  Category.hasMany(Project, { as: "projects", foreignKey: "project_category" });
  Service.belongsTo(Category, { as: "service_category_category", foreignKey: "service_category" });
  Category.hasMany(Service, { as: "services", foreignKey: "service_category" });

  //supprime l'image si un  membre est supprime
  Member.afterDestroy(async (member)=>{
    await deleteUploadedFile(member.member_image)
  });

  //supprime une image si la category est supprimer 
  Category.afterDestroy(async (category) => {
    await deleteUploadedFile(category.category_image_preview);
  });

  //modifier le slug de la category avant de l'envoyer dans la base de donnee
  Category.beforeUpdate(async (category) => {
    if (category.changed('category_name')) {
      console.log("category_name has been changed");
      category.category_slug = "@" + category.category_name.toLowerCase().replace(/\s+/g, "-");
    }
  });

  // Si l'image de la category change, on supprime l'ANCIENNE image apres la mise a jour.
  // On utilise _previousDataValues pour acceder a la valeur AVANT modification,
  // car apres le save(), category_image_preview contient deja la nouvelle valeur.
  Category.afterUpdate(async (category) => {
    if (category.changed('category_image_preview')) {
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

module.exports = { ...models };
