const config = require("../config")
const generate_urlModels = require("../models/generate_url.schema")
const crypto = require("crypto")

const redirectControllers = {
    getUrl : async (req, res, next) => {
        try {
            const findUrlWithUniqueCode = await generate_urlModels.findOne({ uniqueCode:req.body.uniqueCode }).select({createdBy:0, createdAt:0,_id:0 })
            if(findUrlWithUniqueCode !== null) {
                config.response(res, 200, "success", findUrlWithUniqueCode)
                
            } else {
                config.response(res, 400, "failed, unique code is invalid")
            }
        } catch (error) {
            config.response(res, 400, error.message)
        }
    },

    generateAnonymous : async (req, res, next) => {
        try {
            const randomNumber = await config.randomNumber(2, 4)
            const unique = crypto.randomBytes(randomNumber).toString('hex')
            const findDuplicate = await generate_urlModels.findOne({ uniqueCode : unique })

            if(findDuplicate === null) {
                const generate = await generate_urlModels.create({
                    name        : "anonymous_link_"+unique,
                    longUrl     : req.body.longUrl,
                    shortUrl    : process.env.URL_REDIRECT+"/"+unique,
                    uniqueCode  : unique,
                    createdBy   : "anonymous_user_"+unique,
                    createdAt   : await config.timeNow()
                })
                config.response(res, 201, "success", generate)

            } else {
                config.response(res, 400, "failed, unique key is used", generate)
            }

        } catch (error) {
            config.response(res, 400, error.message)
        }
    }
}

module.exports = redirectControllers