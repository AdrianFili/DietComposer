const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const RecipeProduct = sequelize.define(
    "recipeProduct",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      
      quantity: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
        },
      },
    },
    {
      timestamps: false,
    }
  );
  return RecipeProduct;
};
