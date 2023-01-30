const SequelizeMock = require("sequelize-mock");
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const UserModel = require("../models/User");
const { User } = require("../seeders/fakerUserData");

const newUserMock = new SequelizeMock();
const userModel = newUserMock.define("User", User());
let user = {};

beforeAll(() => {
  user = userModel.build();
  return user;
});

describe("User model unit tests", () => {
  describe("Unit testing for user sequelize model", () => {
    const User = UserModel(sequelize, dataTypes);
    describe("Check validate the model name", () => {
      checkModelName(User)("user");
    });
    const user = new User();
    describe("properties model", () => {[
        "id","userImage",
        "userName","email",
        "password","age",
        "gender","weight",
        "height",
        "dietPurpose",
        "physicalActivity",
        "BMI",
        "caloricDemand",
        "proteinsDemand",
        "fatsDemand",
        "carbohydratesDemand",
      ].forEach(checkPropertyExists(user));
    });
  });
  
  test("User id should be string and not null", () => {
    expect(typeof user.id).toBe("string");
    expect(user.id).not.toBeNull();
  });
  test("User Image should be string and not null", () => {
    expect(typeof user.userImage).toBe("string");
    expect(user.userImage).not.toBeNull();
  });
  test("User name should be string and not null", () => {
    expect(typeof user.userImage).toBe("string");
    expect(user.userImage).not.toBeNull();
  });
  test("User email should be string and not null", () => {
    expect(typeof user.email).toBe("string");
    expect(user.emial).not.toBeNull();
  });
  test("User password should be string and not null", () => {
    expect(typeof user.password).toBe("string");
    expect(user.password).not.toBeNull();
  });
  test("User age should be number, not null and bettwen 1-99", () => {
    expect(typeof user.age).toBe("number");
    expect(user.age).not.toBeNull();
    expect(user.age).toBeGreaterThanOrEqual(1);
    expect(user.age).toBeLessThan(99);
  });
  test("User gender should be set and male or female", () => {
    expect(typeof user.gender).toBe("string");
    expect(user.gender).not.toBeNull();
  });
  test("User weight should be set and greater than 0", () => {
    expect(typeof user.weight).toBe("number");
    expect(user.weight).toBeGreaterThanOrEqual(0);
    expect(user.weight).not.toBeNull();
  });
  test("User height should be set and greater than 0", () => {
    expect(typeof user.height).toBe("number");
    expect(user.height).toBeGreaterThanOrEqual(0);
    expect(user.height).not.toBeNull();
  });
  test("User dietPurpose should be set", () => {
    expect(typeof user.dietPurpose).toBe("string");
    expect(user.dietPurpose).not.toBeNull();
  });
  test("User activity should be set", () => {
    expect(typeof user.physicalActivity).toBe("string");
    expect(user.physicalActivity).not.toBeNull();
  });
  test("User BMI should be set and greater than 0", () => {
    expect(typeof user.BMI).toBe("number");
    expect(user.BMI).toBeGreaterThanOrEqual(0);
    expect(user.BMI).not.toBeNull();
  });
  test("User caloricDemand should be set and greater than 0", () => {
    expect(typeof user.caloricDemand).toBe("number");
    expect(user.caloricDemand).toBeGreaterThanOrEqual(0);
    expect(user.caloricDemand).not.toBeNull();
  });
  test("User proteinsDemand should be set and greater than 0", () => {
    expect(typeof user.proteinsDemand).toBe("number");
    expect(user.proteinsDemand).toBeGreaterThanOrEqual(0);
    expect(user.proteinsDemand).not.toBeNull();
  });
  test("User fatsDemand should be set and grater than 0", () => {
    expect(typeof user.fatsDemand).toBe("number");
    expect(user.fatsDemand).toBeGreaterThanOrEqual(0);
    expect(user.fatsDemand).not.toBeNull();
  });
  test("User carbohydratesDemand should be set and grater than 0", () => {
    expect(typeof user.carbohydratesDemand).toBe("number");
    expect(user.carbohydratesDemand).toBeGreaterThanOrEqual(0);
    expect(user.carbohydratesDemand).not.toBeNull();
  });
  /*
  describe('Associations tests', () => {
    const Recipes = 'some dummy company'
    const User = UserModel(sequelize, dataTypes);
    console.log("to są asocjacja: ", User.associate);
    beforeAll(() => {
      User.associate({ Recipes })
    })

    it('defined a belongsTo association with Company', () => {
      expect(User.hasMany).toBeCalledWith(Recipes);
    })
  })*/
});