const jwt = require("jsonwebtoken");
const config = require("../config")

const verifyToken = (req, res, next) => {
    const token = req.headers["token"];

    if (!token) {
        return config.response(res, 403, "Token is required for authentication")
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        return config.response(res, 401, "Token is invalid")
    }

    return next();
};

module.exports = verifyToken;