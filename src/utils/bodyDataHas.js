function bodyDataHas(propertyName, resource){
    return function (request, response, next){
        const {data = {}} = request.body
        if(data[propertyName]){
            return next()
        }
        next({
            status: 400,
            message: `${resource} must include a ${propertyName}`
        })
    }
}


module.exports = bodyDataHas