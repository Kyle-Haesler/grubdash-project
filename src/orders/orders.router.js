const router = require("express").Router();

// TODO: Implement the /orders routes needed to make the tests pass

module.exports = router;
const ordersRouter = require("express").Router()
const controller = require("./orders.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")


ordersRouter.route("/:orderId").get(controller.read)
ordersRouter.route("/").get(controller.list).post(controller.create)


module.exports = ordersRouter