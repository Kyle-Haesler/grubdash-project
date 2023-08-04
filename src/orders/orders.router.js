const router = require("express").Router();

// TODO: Implement the /orders routes needed to make the tests pass

module.exports = router;
const ordersRouter = require("express").Router()
const controller = require("./orders.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")


ordersRouter.route("/:orderId").get(controller.read).put(controller.update).delete(controller.delete).all(methodNotAllowed)
ordersRouter.route("/").get(controller.list).post(controller.create).all(methodNotAllowed)


module.exports = ordersRouter