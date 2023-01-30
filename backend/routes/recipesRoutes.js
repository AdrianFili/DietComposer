const router = require("express").Router();
const recipesController = require("../controllers/recipesController");

router.post("/", recipesController.addRecipes);
router.post("/update", recipesController.updateRecipes);
router.delete("/:recipeId", recipesController.deleteRecipes);
router.get("/:recipeId", recipesController.getRecipeToUpdate);


module.exports = router;
