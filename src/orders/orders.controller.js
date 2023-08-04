const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// Validation middleware functions
//

//CRUDL functions
// List function
function list(request, response, next){
    response.json({data: orders})
}





// Exports

module.exports = {
    list,
}