const db = require("../config/SeqdataBase");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const snack = db.snackMealData;
const user = db.users;
const mealData = db.mealData;
const recipes = db.recipes;

exports.wholeSchedule = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    let meals = await mealData.findAll({
      attributes: {
        exclude: ["id", "userId"],
        //Query to return scheduele is like similar to INNNER JOIN so we need include a few specyfic column
        include: [
          [Sequelize.col("recipe.name"), "recipeName"],
          [Sequelize.col("recipe.image"), "recipeImage"],
          [Sequelize.col("recipe.calories"), "calories"],
          [Sequelize.col("recipe.fats"), "fats"],
          [Sequelize.col("recipe.proteins"), "proteins"],
          [Sequelize.col("recipe.carbohydrates"), "carbohydrates"],
        ],
      },
      include: [
        {
          model: recipes,
          attributes: []
        },
      ],
      where: {
        userId: userId,
      },
      order: [["temp", "ASC"]],
      raw: true,
    }).then(async (meals) => {
      JSON.stringify(meals);
        let 
            breakfast = {}, 
            secondBreakfast = {}, 
            lunch = {}, 
            tea = {}, 
            dinner = {};
        meals.forEach((array) => {
            switch(array.temp) {
                case 1:
                    breakfast = array;
                    break;
                case 2:
                    secondBreakfast = array;
                    break;
                case 3:
                    lunch = array;
                    break;
                case 4:
                    tea = array;
                    break;
                case 5:
                    dinner = array;
                    break;
            }
            array.recipeImage="http://localhost:3000/imagesRecipe/" + array.recipeImage + ".png";
          });
          let snacks = await snack.findAll({
            attributes:["id", "snackName", "calories", "fats", "proteins", "carbohydrates"],
            where:{
                userId: userId,
            }
          });
        res.status(200).send({ breakfast, secondBreakfast, lunch, tea, dinner, snacks });
      }).catch((err) => {
        res.status(402).send({
          message: err.message || "Wyst??pi?? b????d podczas pobierania harmonogramu",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "B????d wewn??trzny serwera!" });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    await user
      .findOne({
        where: {
          id: userId,
        },
      })
      .then(async () => {
        await mealData
          .destroy({
            where: {
              userId: userId,
            },
          })
          .then( async() => {
            await snack.destroy({
                where:{
                    userId:userId,
                }
            })
            res.status(200).send({ message: "Wyczyszczono harmonogram!" });
          });
      })
      .catch((err) => {
        res.status(402).send({
          message: err.message || "Nie uda??o si?? odnale???? u??ytkownika",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "B????d wewn??trzny serwera!" });
  }
};

exports.addToSchedule = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const { recipeId, time, type } = req.body;
    let temp;
    switch (type) {
      case "??niadanie":
        temp = 1;
        break;
      case "II ??niadanie":
        temp = 2;
        break;
      case "obiad":
        temp = 3;
        break;
      case "podwieczorek":
        temp = 4;
        break;
      case "kolacja":
        temp = 5;
        break;
    }

    await mealData
      .create({
        time: time,
        temp: temp,
        userId: userId,
        recipeId: recipeId,
      })
      .then(() => {
        res.status(200).send({ message: "Dodano przepis do harmonogramu!" });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Powsta?? nieokre??lony b????d podczas pr??by dodania przepisu do harmonogramu",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "B????d wewn??trzny serwera!" });
  }
};

exports.addSnack = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const { snackName, calories, fats, proteins, carbohydrates } = req.body;
    await snack
      .create({
        snackName: snackName,
        calories: calories,
        fats: fats,
        proteins: proteins,
        carbohydrates: carbohydrates,
        userId: userId,
      })
      .then(() => {
        res.status(200).send({ message: "Dodano przek??sk??!" });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Powsta?? nieokre??lony b????d podczas zapisu przek??ski",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "B????d wewn??trzny serwera!" });
  }
};

exports.delSnack = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const snackId = req.params.snackId;
    await user
      .findOne({
        where: {
          id: userId,
        },
      })
      .then(async () => {
        await snack
          .destroy({
            where: {
              id: snackId,
            },
          })
          .then(() => {
            res.status(200).send({ message: "Usuni??to przek??sk??!" });
          });
      })
      .catch((err) => {
        res.status(402).send({
          message: err.message || "Nie uda??o si?? odnale???? u??ytkownika",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "B????d wewn??trzny serwera!" });
  }
};

exports.deleteScheduleRecipe = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const { recipeId } = req.params;
    await user
      .findOne({
        where: {
          id: userId,
        },
      })
      .then(async () => {
        await mealData
          .destroy({
            where: {
              recipeId: recipeId,
            },
          })
          .then(() => {
            res
              .status(200)
              .send({ message: "Usuni??to przepis z harmonogramu!" });
          });
      })
      .catch((err) => {
        res.status(402).send({
          message: err.message || "Nie uda??o si?? odnale???? u??ytkownika",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "B????d wewn??trzny serwera!" });
  }
};

exports.eaten = async (req, res) => {
  try {
    const userId = jwt.decode(req.headers["x-access-token"]).id;
    const { recipeId } = req.params;
    await user
      .findOne({
        where: {
          id: userId,
        },
      })
      .then(async () => {
        await mealData
          .update(
            { eaten: true },
            {
              where: {
                recipeId: recipeId,
              },
            }
          )
          .then(() => {
            res.status(200).send({ message: "Zaktualizowano status potrawy!" });
          });
      })
      .catch((err) => {
        res.status(402).send({
          message: err.message || "Nie uda??o si?? odnale???? u??ytkownika",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "B????d wewn??trzny serwera!" });
  }
};
