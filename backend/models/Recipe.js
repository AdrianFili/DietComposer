const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Recipe = sequelize.define(
    "recipe",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      image: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      cookingTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      portions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      level: {
        type: DataTypes.ENUM,
        values: ["łatwy", "średni", "trudny"],
      },
      dietType: {
        type: DataTypes.ENUM,
        values: ["wysokobiałkowa", "bezglutenowa", "ketogeniczna", "wegańska", "wegetariańska", "inna"],
      },
      category: {
        type: DataTypes.ENUM,
        values: ["śniadanie", "II śniadanie", "obiad", "podwieczorek", "kolacja"],
      },
      calories: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      fats: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      proteins: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      carbohydrates: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    },
    {
      timestamps: true,
    }
  );
  return Recipe;
};
