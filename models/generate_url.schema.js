const mongose = require("mongoose")
const generateUrl = mongose.Schema({
    name : {
        type : String,
        require : true
    },
    longUrl : {
        type : String,
        require : true
    },
    shortUrl : {
        type : String,
        require : true
    },
    uniqueCode : {
        type : String,
        require : true
    },
    createdBy : {
        type : String,
        require : true
    },
    createdAt : {
        type : Date,
        require : true
    }
})

module.exports = mongose.model("generate_url", generateUrl)