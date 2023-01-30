const router = require("express").Router();
const scheduleController = require("../controllers/scheduleController");

router.get("/", scheduleController.wholeSchedule);
router.delete("/", scheduleController.deleteSchedule);
router.post("/", scheduleController.addToSchedule);
router.post("/snack", scheduleController.addSnack);
router.delete("/snack/:snackId", scheduleController.delSnack);
router.delete("/recipe/:recipeId", scheduleController.deleteScheduleRecipe);
router.post("/update/:recipeId", scheduleController.eaten);



module.exports = router;
