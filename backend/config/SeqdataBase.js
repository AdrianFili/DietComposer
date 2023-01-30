require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.password,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    omitNull: true,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 0,
    },
  }
);

const db = {};
try {
  sequelize.authenticate();
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.users = require("../models/User.js")(sequelize, Sequelize);
  db.products = require("../models/Product.js")(sequelize, Sequelize);
  db.userProducts = require("../models/UserProduct.js")(sequelize, Sequelize);
  db.recipeProducts = require("../models/RecipeProduct.js")(
    sequelize,
    Sequelize
  );
  db.recipes = require("../models/Recipe.js")(sequelize, Sequelize);
  db.recipeSteps = require("../models/RecipeStep.js")(sequelize, Sequelize);
  db.mealData = require("../models/MealData.js")(sequelize, Sequelize);
  db.snackMealData = require("../models/SnackMealData.js")(sequelize, Sequelize);

  //wiele do wielu(użytkownicy/produkty)
  db.users.belongsToMany(db.products, { through: db.userProducts });
  db.products.belongsToMany(db.users, { through: db.userProducts });
  db.users.hasMany(db.userProducts);
  db.userProducts.belongsTo(db.users);
  db.products.hasMany(db.userProducts);
  db.userProducts.belongsTo(db.products);

  //jeden do wielu przepis / kroki postępowania
  db.recipes.hasMany(db.recipeSteps, {onUpdate: 'CASCADE', onDelete: 'CASCADE'});
  db.recipeSteps.belongsTo(db.recipes, { foreignKey: 'recipeId', as: 'recipeStep' });

  //wiele do wielu(produkty/przepisy)
  db.recipes.belongsToMany(db.products, { through: db.recipeProducts });
  db.products.belongsToMany(db.recipes, { through: db.recipeProducts });
  db.recipes.hasMany(db.recipeProducts);
  db.recipeProducts.belongsTo(db.recipes, { foreignKey: 'recipeId', as: 'products' });
  db.products.hasMany(db.recipeProducts);
  db.recipeProducts.belongsTo(db.products);

  //jeden do wielu (użytkownik/przepis)
  db.users.hasMany(db.recipes, {onUpdate: 'CASCADE', onDelete: 'CASCADE'});
  db.recipes.belongsTo(db.users);

  //wiele do wielu użytkownik -> harmonogram -> przepis
  db.users.belongsToMany(db.recipes, { through: db.mealData });
  db.recipes.belongsToMany(db.users, { through: db.mealData });
  db.users.hasMany(db.mealData);
  db.mealData.belongsTo(db.users);
  db.recipes.hasMany(db.mealData);
  db.mealData.belongsTo(db.recipes);

  //jeden do wielu (użytkownik/przekąski)
  db.users.hasMany(db.snackMealData, {onUpdate: 'CASCADE', onDelete: 'CASCADE'});
  db.snackMealData.belongsTo(db.users, {foreignKey: 'userId', as: 'snacks'});

  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

module.exports = db;
