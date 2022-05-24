const express = require('express');
const router = express.Router();
const redirectControllers = require("../controllers/redirect.controllers")
const { body } = require("express-validator")
const validator = require("../middleware/validator.middleware")

router.post('/get-redirect-url', 
	body("uniqueCode").notEmpty().withMessage("uniqueCode is required"), validator, [
	redirectControllers.getUrl
]);

module.exports = router;
