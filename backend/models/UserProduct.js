const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const UserProduct = sequelize.define(
    "userProduct",
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
  return UserProduct;
};
