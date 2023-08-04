const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Validation Middleware Functions 
// General Body Data Validation
function bodyDataHas(propertyName){
    return function (request, response, next){
        const {data = {}} = request.body
        if(data[propertyName]){
            return next()
        }
        next({
            status: 400,
            message: `Dish must include a ${propertyName}`
        })
    }
}
// Price is valid
function priceIsValid(request, response, next){
    const {data: {price} = {}} = request.body
    if(price <= 0 || !Number.isInteger(price)){
        return next({
            status: 400,
            message: `Dish must have a price that is an integer greater than 0`
        })
    }
    next()
}
// list function
function list(request, response, next){
    response.json({data: dishes})
}
// create function
function create(request, response, next){
    const {data: {name, description, price, image_url} = {}} = request.body
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url
    }
    dishes.push(newDish)
    response.status(201).json({data: newDish})
}




module.exports = {
    list,
    create: [
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        priceIsValid,
        create
    ]
}
