require("dotenv").config();
const { DataTypes } = require("sequelize");
const useBcrypt = require("sequelize-bcrypt");
const {products} = require("../models/Product.js");
const {userProducts} = require("../models/UserProduct.js");
const {recipes} = require("../models/Recipe.js");
const {mealData} = require("../models/MealData.js");
const {snackMealData} = require("../models/SnackMealData.js");

module.exports = (sequelize, Sequelize) => {
  const options = {
    field: "password",
    rounds: parseInt(process.env.ROUNDS),
    compare: "authenticate",
  };

  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userImage: {
        type: DataTypes.STRING,
        defaultValue: 'defaultUser',
      },
      userName: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: /^[a-zA-Z0-9]{5,30}$/i,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
        },
      },
      password: {
        type: DataTypes.STRING,
        unique: true,
      },
      age: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["kobieta", "mężczyzna", "-"],
      },
      weight: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      height: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      dietPurpose: {
        type: DataTypes.ENUM,
        values: ["spadek wagi", "utrzymanie wagi", "przyrost wagi", "-"],
      },
      physicalActivity: {
        type: DataTypes.ENUM,
        values: [
          "brak ćwiczeń", "znikoma", "mała", "umiarkowana",
          "duża", "bardzo duża", "-",],
      },
      BMI: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      caloricDemand: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      proteinsDemand: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      fatsDemand: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      carbohydratesDemand: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    }
  );
  useBcrypt(User, options);
  return User;
};
/*



  //User.associate = ({ Company }) => {
  //  User.belongsTo(Company)
  //}
  User.associate = ({products}) => {
    User.belongsToMany(products, { through: userProducts })
  }
  User.associate = ({userProducts}) => {
    User.hasMany(userProducts)
  }
  User.associate = ({recipes}) => {
    User.hasMany(recipes, {onUpdate: 'CASCADE', onDelete: 'CASCADE'})
  }
  User.associate = ({recipes}) => {
    User.belongsToMany(recipes, { through: mealData })
  }
  User.associate = ({mealData}) => {
    User.hasMany(mealData)
  }
  User.associate = ({snackMealData}) => {
    User.hasMany(snackMealData, {onUpdate: 'CASCADE', onDelete: 'CASCADE'})
  }
*/




/*require("dotenv").config();
const { DataTypes } = require("sequelize");
const useBcrypt = require("sequelize-bcrypt");

module.exports = (sequelize, Sequelize) => {
  const options = {
    field: "password",
    rounds: parseInt(process.env.ROUNDS),
    compare: "authenticate",
  };

  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userImage: {
        type: DataTypes.STRING,
        defaultValue: 'defaultUser',
      },
      userName: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: /^[a-zA-Z0-9]{5,30}$/i,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          is: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
        },
      },
      password: {
        type: DataTypes.STRING,
        unique: true,
      },
      age: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["kobieta", "mężczyzna", "-"],
      },
      weight: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      height: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      dietPurpose: {
        type: DataTypes.ENUM,
        values: ["spadek wagi", "utrzymanie wagi", "przyrost wagi", "-"],
      },
      physicalActivity: {
        type: DataTypes.ENUM,
        values: [
          "brak ćwiczeń",
          "znikoma",
          "mała",
          "umiarkowana",
          "duża",
          "bardzo duża",
          "-",
        ],
      },
      BMI: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      caloricDemand: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      proteinsDemand: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      fatsDemand: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      carbohydratesDemand: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    }
  );
  useBcrypt(User, options);
  return User;
};
*/