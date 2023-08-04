const dishesRouter = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

dishesRouter
  .route("/:dishId")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);
dishesRouter
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = dishesRouter;
