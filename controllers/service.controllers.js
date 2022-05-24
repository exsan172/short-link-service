const crypto = require("crypto")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const jwtDecode = require("jwt-decode")
const moment = require("moment-timezone")
const config = require("../config")
const generateUrlModels = require("../models/generate_url.schema")
const userModels = require("../models/user.schema")
const salt = 10

const serviceControllers = {
    login : async (req, res, next) => {
        try {
            const findEmail = await userModels.findOne({ email : req.body.email })
            if(findEmail !== null) {
                const verifyPassword = bcrypt.compareSync(req.body.password, findEmail.password) 
                if(verifyPassword) {
                    const generateJWT = await jwt.sign({
                        name : findEmail.name,
                        email : findEmail.email
                    }, process.env.SECRET_KEY)

                    config.response(res, 200, "success", {
                        name : findEmail.name,
                        token : generateJWT
                    })

                } else {
                    config.response(res, 400, "failed, email or password is not match")
                }

            } else {
                config.response(res, 400, "failed, email not register in our database")
            }

        } catch (error) {
            config.response(res, 400, error.message)
        }
    },

    register : async (req, res, next) => {
        try {
            const findEmail = await userModels.findOne({ email : req.body.email })
            if(findEmail === null) {
                const passwordHash = bcrypt.hashSync(req.body.password, salt)
                const createUser = await userModels.create({
                    name      : req.body.name,
                    email     : req.body.email,
                    password  : passwordHash,
                    createdAt : await config.timeNow()
                })
                config.response(res, 201, "success", createUser)

            } else {
                config.response(res, 400, "failed, email already used other account")
            }
            
        } catch (error) {
            config.response(res, 400, error.message)
        }
    },

    forgotPassword : async (req, res, next) => {
        try {
            const findEmail = await userModels.findOne({ email: req.body.email })
            if(findEmail !== null) {
                const signJwt = await jwt.sign({
                    name  : findEmail.name,
                    email : findEmail.email
                }, process.env.SECRET_KEY)

                const msgForgotPass = 
                    `<span>
                        Klik link berikut ini untuk melalukan perubahan password : <a href="${process.env.URL_REDIRECT}/forgot-pass/${signJwt}">Ganti Password</a>
                    </span>`

                config.mail(findEmail.email, "Verifikasi lupa password", msgForgotPass).then(() =>{
                    config.response(res, 200, "success, link verification sent.")
                }).catch(err => {
                    config.response(res, 400, err)
                })
            } else {
                config.response(res, 400, "failed, email is not register in our database.")
            }
            
        } catch (error) {
            config.response(res, 400, error.message)
        }
    },

    confirmPassword : async (req, res, next) => {
        try {
            const token     = jwtDecode(req.body.token)
            const findEmail = await userModels.findOne({ email: token.email })

            if(findEmail !== null) {
                const hashPassword = await bcrypt.hashSync(req.body.password, salt)
                const change = await userModels.updateOne({ _id: findEmail._id }, {
                    password : hashPassword
                })
                const msgConfirmPass = 
                    `<span>
                        Password sukses di perbarui pada <b>${moment(await config.timeNow()).format("D MMM YYYY. HH:mm")}(GMT+7)</b>, silakan login kembali ke akun anda.
                    <span>`

                config.mail(findEmail.email, "Password di perbarui", msgConfirmPass).then(() =>{
                    config.response(res, 200, "success, password change.", change)
                }).catch(err => {
                    config.response(res, 400, err)
                })

            } else {
                config.response(res, 400, "failed, email is not register in our database.")
            }
            
        } catch (error) {
            config.response(res, 400, error.message)
        }
    },

    changePassword : async (req, res, next) => {
        try {
            const findEmail = await userModels.findOne({ email: req.user.email })
            if(findEmail !== null) {
                const compareOldPassword = await bcrypt.compareSync(req.body.oldPassword, findEmail.password)
                if(compareOldPassword) {
                    const hashPassword = await bcrypt.hashSync(req.body.newPassword, salt)
                    const change = await userModels.updateOne({ _id: findEmail._id }, {
                        password : hashPassword
                    })
                    const msgConfirmPass = 
                        `<span>
                            Password sukses di perbarui pada <b>${moment(await config.timeNow()).format("D MMM YYYY. HH:mm")}(GMT+7)</b>, silakan login kembali ke akun anda.
                        <span>`

                    config.mail(findEmail.email, "Password di perbarui", msgConfirmPass).then(() =>{
                        config.response(res, 200, "success, password change.", change)
                    }).catch(err => {
                        config.response(res, 400, err)
                    })

                } else {
                    config.response(res, 400, "failed, old password is not match.")
                }
            } else {
                config.response(res, 400, "failed, email is not register in our database.")
            }
            
        } catch (error) {
            config.response(res, 400, error.message)
        }
    },



    generateLink : async (req, res, next) => {
        try {
            const randomNumber = await config.randomNumber(2, 4)
            const unique = crypto.randomBytes(randomNumber).toString('hex')
            const findDuplicate = await generateUrlModels.findOne({ uniqueCode : unique })

            if(findDuplicate === null) {
                const generate = await generateUrlModels.create({
                    name        : req.body.name,
                    longUrl     : req.body.longUrl,
                    shortUrl    : process.env.URL_REDIRECT+"/"+unique,
                    uniqueCode  : unique,
                    createdBy   : "orang",
                    createdAt   : await config.timeNow()
                })
                config.response(res, 201, "success", generate)

            } else {
                config.response(res, 400, "failed, unique key is used", generate)
            }

        } catch (error) {
            config.response(res, 400, error.message)
        }
    },

    getGenerateLink : async (req, res, next) => {
        try {
            const findByCreatedBy = await generateUrlModels.find()
            if(findByCreatedBy === null) {
                findByCreatedBy = []
            }

            config.response(res, 200, "success", findByCreatedBy)
            
        } catch (error) {
            config.response(res, 400, error.message)
        }
    },

    deleteGenerateLink : async (req, res, next) => {
        try {
            const findData = await generateUrlModels.findOne({ _id:req.params.id })
            if(findData !== null) {
                await generateUrlModels.deleteOne({ _id:req.params.id })
                config.response(res, 201, "success", findData)
            
            } else {
                config.response(res, 400, `failed, data with id ${req.params.id} is not found`)
            }
            
        } catch (error) {
            config.response(res, 400, error.message)
        }
    },

    updateGenerateLink : async (req, res, next) => {
        try {
            const findData = await generateUrlModels.findOne({ _id:req.body.id })
            if(findData !== null) {
                await generateUrlModels.updateOne({ id:req.body.id }, {
                    name        : req.body.name,
                    longUrl     : req.body.longUrl,
                })
                
                const getData = await generateUrlModels.findOne({ _id:req.body.id })
                config.response(res, 201, "success", getData)

            } else {
                config.response(res, 400, `failed, data with id ${req.body.id} is not found`)
            }
            
        } catch (error) {
            config.response(res, 400, error.message)
        }
    },
}

module.exports = serviceControllers