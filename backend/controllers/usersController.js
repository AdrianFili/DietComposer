const db = require("../config/SeqdataBase");
const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");

const Op = Sequelize.Op;
const user = db.users;
const recipes = db.recipes;
let ActiveUserTokens = [];

exports.refreshToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!ActiveUserTokens.includes(token)) {
      return res
        .status(403)
        .send({ message: "Zaistniał problem z pobraniem tokenu!" });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, payload) => {
      if (err) {
        return res
          .status(403)
          .send({ message: "Token nie został zweryfikowany poprawnie!" });
      }
      const newToken = jwt.sign({ id: payload.id }, process.env.ACCESS_TOKEN, {
        expiresIn: "2h",
      });
      res.json({ token: newToken });
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.logout = (req, res) => {
  const { token } = req.body;
  ActiveUserTokens = ActiveUserTokens.filter((x) => x !== token);
  res.status(204).send({ message: "Wylogowano!" });
};

exports.deleteUser = async (req, res) => {
  try {
    await user
      .findOne({
        attributes:['id','userImage'],
        where: {
          id: jwt.decode(req.headers["x-access-token"]).id,
        },
      })
      .then(async (userData) => {
        if (userData.userImage != "defaultUser") {
          const path = "./images/" + userData.userImage + ".png";
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            user
              .destroy({
                where: {
                  id: userData.id,
                },
              })
              .then(
                res
                  .status(200)
                  .send({ message: "Konto użytkownika zostało usunięte" })
              );
          });
        } else {
          user
            .destroy({
              where: {
                id: userData.id,
              },
            })
            .then(
              res
                .status(200)
                .send({ message: "Konto użytkownika zostało usunięte" })
            );
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Nie znaleziono użytkownika" });
      });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    var fileName = crypto.randomBytes(20).toString("hex");

    const Engine = (Name) => {
      return multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./images");
        },
        filename: (req, file, cb) => {
          cb(null, Name + ".png");
        },
      });
    };

    const upload = multer({ storage: Engine(fileName) }).single("image");

    upload(req, res, async (err) => {
      const decodedPayload = jwt.decode(req.headers["x-access-token"]);
      if (err) {
        return res.send(
          "Przesyłanie pliku na serwer zaończyło się niepowodzeniem!"
        );
      }
      user.update(
        { userImage: fileName },
        {
          where: {
            id: decodedPayload.id,
          },
        }
      );
      res.status(201).send({ message: "Wysłano plik na serwer" });
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.downloadUserImage = async (req, res) => {
  try {
    const userImg = await user.findOne({
      attributes: ["userImage"],
      where: {
        id: jwt.decode(req.headers["x-access-token"]).id,
      },
    });
    if (!userImg.userImage)
      return res
        .status(402)
        .send({ message: "Nie udało się odnaleźć użytkownika o podanym id" });
    res.status(200).send({
      image: "http://localhost:3000/images/" + userImg.userImage + ".png",
      message: "Pobrano zdjęcie użytkownika",
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.BMI = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const { age, gender, weight, height, dietPurpose, physicalActivity } =
      req.body;
    const diet = {
      "spadek wagi": -300,
      "utrzymanie wagi": 0,
      "przyrost wagi": 300,
    };
    const PAL = {
      "brak ćwiczeń": 1.4,
      znikoma: 1.6,
      mała: 1.8,
      umiarkowana: 2,
      duża: 2.2,
      "bardzo duża": 2.4,
    };

    let BMI = (weight / Math.pow(parseFloat(height) * 0.01, 2)).toFixed(2);

    let cpm = 0.0;
    if (gender === "kobieta") {
      cpm = (
        (10 * weight + 6.25 * height - 5 * age - 161) *
          parseFloat(PAL[physicalActivity]) -
        diet[dietPurpose]
      ).toFixed(2);
    } else {
      cpm = (
        (10 * weight + 6.25 * height - 5 * age + 5) *
          parseFloat(PAL[physicalActivity]) -
        diet[dietPurpose]
      ).toFixed(2);
    }

    let proteins = ((cpm * 0.2) / 4).toFixed(1);
    let carbohydrates = ((cpm * 0.6) / 4).toFixed(1);
    let fats = ((cpm * 0.2) / 9).toFixed(1);
    user.update(
      {
        age: age,
        gender: gender,
        weight: weight,
        height: height,
        dietPurpose: dietPurpose,
        physicalActivity: physicalActivity,
        BMI: BMI,
        caloricDemand: cpm,
        proteinsDemand: proteins,
        fatsDemand: fats,
        carbohydratesDemand: carbohydrates,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    res.status(201).send({
      BMI: BMI,
      proteinsDemand: proteins,
      fatsDemand: fats,
      caloricDemand: cpm,
      carbohydratesDemand: carbohydrates,
    });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.All = async (req, res) => {
  try {
    const idFromToken = jwt.decode(req.headers["x-access-token"]).id;
    let getUserRecipes = await recipes.findAll({
      attributes: ["id", "image", "name"],
      where: {
        userId: idFromToken,
      },
    });
    await user
      .findOne({
        attributes: { exclude: ["password", "id"] },
        where: {
          id: idFromToken,
        },
      })
      .then((userData) => {
        userData.userImage =
          "http://localhost:3000/images/" + userData.userImage + ".png";
          getUserRecipes.forEach((array) => {
            JSON.stringify(array);
            array.image="http://localhost:3000/imagesRecipe/" + array.image + ".png";
          });
        res.status(200).send({ user: userData, recipes: getUserRecipes });
      })
      .catch((err) => {
        res.status(500).send({ message: "Nie znaleziono użytkownika" });
      });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};
