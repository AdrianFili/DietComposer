const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const snackMealData = sequelize.define(
    "snackMealDatas",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },

      snackName: {
        type: DataTypes.STRING
      },

      calories: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
        },
      },

      fats: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
        },
      },
      proteins: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0,
        },
      },

      carbohydrates: {
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
  return snackMealData;
};
