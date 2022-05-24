const config = require("../config")
const generate_urlModels = require("../models/generate_url.schema")

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
    }
}

module.exports = redirectControllers