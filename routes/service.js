const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const validator = require("../middleware/validator.middleware")
const serviceControllers = require("../controllers/service.controllers")
const auth = require("../middleware/jwt.middleware")

router.post('/login', 
	body("email").notEmpty().withMessage("email is required").isEmail().withMessage("please use email format"),
	body("password").notEmpty().withMessage("password is required").isLength({min:8}).withMessage("min length password is 8"), validator, [
	serviceControllers.login
]);
router.post('/register',
	body("name").notEmpty().withMessage("name is required"),
	body("email").notEmpty().withMessage("email is required").isEmail().withMessage("please use email format"),
	body("password").notEmpty().withMessage("password is required").isLength({min:8}).withMessage("min length password is 8"), validator, [
	serviceControllers.register
]);
router.post('/forgot-password', 
	body("email").notEmpty().withMessage("email is required").isEmail().withMessage("please use email format"), validator,[
	serviceControllers.forgotPassword
]);
router.post('/confirm-password', 
	body("token").notEmpty().withMessage("token is required"),
	body("password").notEmpty().withMessage("password is required").isLength({min:8}).withMessage("min length password is 8"), validator, [
	serviceControllers.confirmPassword
]);
router.post('/change-password', 
	body("oldPassword").notEmpty().withMessage("oldPassword is required").isLength({min:8}).withMessage("min length password is 8"),
	body("newPassword").notEmpty().withMessage("newPassword is required").isLength({min:8}).withMessage("min length password is 8"), validator, auth, [
	serviceControllers.changePassword
]);


router.post('/generate-url', 
	body("name").notEmpty().withMessage("name is required"),
	body("longUrl").notEmpty().withMessage("longUrl is required"), validator, auth, [
		serviceControllers.generateLink
]);
router.put('/generate-url', 
	body("id").notEmpty().withMessage("id is required"),
	body("name").notEmpty().withMessage("name is required"),
	body("longUrl").notEmpty().withMessage("longUrl is required"), validator, auth, [
		serviceControllers.updateGenerateLink
]);
router.delete('/generate-url/:id', auth, [
	serviceControllers.deleteGenerateLink
]);
router.get('/generate-url', auth, [
	serviceControllers.getGenerateLink
]);

module.exports = router;
