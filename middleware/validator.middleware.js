const { validationResult } = require("express-validator")
const config = require("../config")

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = ""
        const errorArray = errors.array()
        const coma = errorArray.length>1 ? ", " : ""

        for(const i in errorArray) {
            error += errorArray[i].msg+`${parseInt(i)+1 < errorArray.length ? coma : ""}`
        }

        return config.response(res, 400, error)
    }

    return next()
}

module.exports = validator