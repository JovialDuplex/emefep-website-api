import { dbConnector } from "../config/config.js";
import { Sequelize } from "sequelize";
import { deleteUploadedFile } from "../utils/deleteUploadedFile.js";
import _categories from "./categories.js";
import _company_infos from "./company_infos.js";
import _company_stats from "./company_stats.js";
import _members from "./members.js";
import _product from "./product.js";
import _projects from "./projects.js";
import _service from "./service.js";
import _users from "./users.js";

var DataTypes = Sequelize.DataTypes;

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
  
  // lorsqu'on met a jour un membre si le photo est changer on supprime l'ancien
  Member.afterDestroy(async (member)=>{
    if(member.changed("member_image")){
      console.log("l'image de profile a ete modifie ")
    }
  });

  //supprime une image si la category est supprimer 
  Category.afterDestroy(async (category) => {
    await deleteUploadedFile(category.category_image_preview);
  });

  //modifier le slug de la category avant de l'envoyer dans la base de donnee
  Category.beforeUpdate(async (category) => {
    if (category.changed('category_name')) {
      console.log("l'image de la category a ete modifiee");
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

export const { Category, CompanyInfo, CompanyStat, Member, Product, Project, Service, User } = models;
