const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");
const bodyDataHas = require("../utils/bodyDataHas")
// Validation middleware functions
// Dish property is valid
function dishPropertyIsValid(request, response, next){
    const {data: {dishes} = {}} = request.body
    if(!Array.isArray(dishes) || dishes.length === 0){
        return next({
            status: 400,
            message: "Order must include atleast one dish"
        })
    }
    response.locals.dishProperty = dishes
    next()
}
// Dish quantity property is valid
function dishQuantityisValid(request, response, next){
    const dishes = response.locals.dishProperty
    let message = ""
    for (let i = 0; i < dishes.length; i++){
        const quantity = dishes[i].quantity
        if(!quantity || quantity <= 0 || !Number.isInteger(quantity)){
            message = `Dish ${i} must have a quantity that is an integer greater than 0`
        }
    }
    if(message.length){
        return next({
            status: 400,
            message
        })
    }
    next()
}
// Order exists
function orderExists(request, response, next){
    const {orderId} = request.params
    const orderFound = orders.find((order) => order.id === orderId)
    if(orderFound){
        response.locals.order = orderFound
        response.locals.orderId = orderId
        return next()
    }
    next({
        status: 404,
        message: `Order id ${orderId} not found`
    })
}
// Order Id is valid if present
function orderIdIsValidIfPresent(request, response, next){
    const {orderId} = request.params
    const {data: {id} = {}} = request.body
    if(id){
        if(id === orderId){
            return next()
        } else {
         return next({
            status: 400,
            message: `Order id does not match route id. Dish: ${id}, Route: ${orderId}`
        })}
    }
    return next()
}
// Status property is valid
function statusPropertyIsValid(request, response, next){
    const {data: {status} = {}} = request.body
    const validStatusResponses = ["pending", "preparing", "out-for-delivery", "delivered"]
    if(!status || !validStatusResponses.includes(status)){
        return next({
            status: 400,
            message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
        })
    }
    if(status === "delivered"){
        return next({
            status: 400,
            message: "A delivered order cannot be changed"
        })
    }
    next()
}
// status property is valid for deletion
function statusValidForDeletion(request, response, next){
    const order = response.locals.order
    if(order.status !== "pending"){
        return next({
            status: 400,
            message: "An order cannot be deleted unless it is pending"
        })
    }
    next()
}
//CRUDL functions
// List function
function list(request, response, next){
    response.json({data: orders})
}

// Create function
function create(request, response, next){
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = request.body
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes,
    }
    orders.push(newOrder)
    response.status(201).json({data: newOrder})
}
// Read function
function read(request, response, next){
    response.json({data: response.locals.order})
}
// Update function
function update(request, response, next){
    const {data: {deliverTo, mobileNumber, status, dishes} = {}} = request.body
    const order = response.locals.order
    order.deliverTo = deliverTo
    order.mobileNumber = mobileNumber
    order.status = status
    order.dishes = dishes
    response.json({data: order})
}
// Destroy function
function destroy(request, response, next){
    const orderId = response.locals.orderId
    const order = response.locals.order
    const index = orders.findIndex((order) => order.id === orderId)
    const deletedOrder = orders.splice(index, 1)
    response.sendStatus(204)
}


// Exports

module.exports = {
    list,
    create: [
        bodyDataHas("deliverTo", "Order"),
        bodyDataHas("mobileNumber", "Order"),
        bodyDataHas("dishes", "Order"),
        dishPropertyIsValid,
        dishQuantityisValid,
        create
    ],
    read: [orderExists, read],
    update: [
        orderExists,
        orderIdIsValidIfPresent,
        bodyDataHas("deliverTo", "Order"),
        bodyDataHas("mobileNumber", "Order"),
        bodyDataHas("dishes", "Order"),
        statusPropertyIsValid,
        dishPropertyIsValid,
        dishQuantityisValid,
        update
    ],
    delete: [orderExists, statusValidForDeletion, destroy]
}