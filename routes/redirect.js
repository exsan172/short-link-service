const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const validator = require("../middleware/validator.middleware")
const redirectControllers = require("../controllers/redirect.controllers")

router.post('/get-redirect-url', 
	body("uniqueCode").notEmpty().withMessage("uniqueCode is required"), validator, [
	redirectControllers.getUrl
]);

router.post('/anonymous-generate-url',
	body("longUrl").notEmpty().withMessage("Please insert longUrl!"), validator, [
	redirectControllers.generateAnonymous
]);

module.exports = router;
