const router = require("express").Router();
const productsController = require("../controllers/productsController");

router.post("/user/add", productsController.createProduct);
router.delete("/user/delete/:productId", productsController.deleteUserProduct);
router.delete("/user/all/delete", productsController.deleteUserProducts);
router.get("/user/all", productsController.getAllUserProducts);
router.get("/all", productsController.getAll);

module.exports = router;
