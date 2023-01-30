const router = require("express").Router();
const usersController = require("../controllers/usersController");

router.post("/refreshToken", usersController.refreshToken);
router.delete("/logout", usersController.logout);
router.post("/uploadImage", usersController.uploadImage);
router.get("/downloadUserImage", usersController.downloadUserImage);
router.post("/BodyMassIndex", usersController.BMI);
router.get("/All", usersController.All);
router.delete("/", usersController.deleteUser);

module.exports = router;
