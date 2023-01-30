const db = require("../config/SeqdataBase");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");

const products = db.products;
const user = db.users;
const userProduct = db.userProducts;
const Op = Sequelize.Op;

exports.createProduct = async (req, res) => {
  try {
    const { id, quantity} = req.body;
    const idFromToken = jwt.decode(req.headers["x-access-token"]).id;
    const User = await user.findOne({
      where: {
        id: idFromToken,
      },
    });
    const Product = await products.findOne({
      where: {
        id: id,
      },
    });
    await userProduct.create({
      quantity: quantity,
      userId: User.id,
      productId: Product.id,
    });
    res.status(201).send({ message: "Dodano produkt" });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.deleteUserProduct = async (req, res) => {
  try {
    const idFromToken = jwt.decode(req.headers["x-access-token"]).id;
    const idProduct = req.params.productId;
    await userProduct.destroy({
      where: {
        [Op.and]: [{ userId: idFromToken, productId: idProduct }],
      },
    });
    res.status(200).send({ message: "Produkt użytkownika został usunięty" });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.deleteUserProducts = async (req, res) => {
  try {
    const idFromToken = jwt.decode(req.headers["x-access-token"]).id;
    await userProduct.destroy({
      where: { userid: idFromToken },
    });
    res.status(200).send({ message: "Produkty użytkownika zostały usunięte" });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.getAllUserProducts = async (req, res) => {
  try {
    const idFromToken = jwt.decode(req.headers["x-access-token"]).id;
    const userProducts = await userProduct.findAll({
      attributes: {exclude: ['productId','userId']},
      include: {
        model: products,
      },
      where: {
        userId: idFromToken,
      },
    });
    res.status(200).send({ Products: userProducts });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const allProducts = await products.findAll();
    res.status(201).send({ data: { allProducts } });
  } catch (error) {
    res.status(500).send({ message: "Błąd wewnętrzny serwera!" });
  }
};
