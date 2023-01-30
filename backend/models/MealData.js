const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const mealData = sequelize.define(
    "mealDatas",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },

      time: {
        type: DataTypes.STRING
      },

      eaten: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      temp: {
        type: DataTypes.INTEGER,
        validate: {
          min: 0,
          max: 5,
        },
      },
    },
    {
      timestamps: false,
    }
  );
  return mealData;
};
