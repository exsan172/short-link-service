const mongoose = require("mongoose")
const moment = require("moment-timezone")
const nodeMailer = require('nodemailer')

const response = (res, code, message, data=null) => {
    const jsonRes = {
        statusCode : code,
        message : message,
    }

    if(data !== null) {
        jsonRes["data"] = data
    }

    return res.json(jsonRes)
}

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Database connection success.")

    } catch(err) {
        console.log("Database connection failed.")
    }
}

const timeNow = async () => {
    return await moment().tz("Asia/Jakarta").utc(true)
}

const randomNumber = (min, max) => { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const mail = async (to, subject, html) => {
    const transporter = await nodeMailer.createTransport({
        host : process.env.HOST_SMTP,
        port : process.env.PORT_SMTP,
        secure : process.env.SECURE_SMTP,
        auth : {
            user : process.env.USER_SMTP,
            pass : process.env.PASS_SMTP
        }
    })

    const mailOption =  {
        from    : process.env.USER_SMTP,
        to      : to,
        subject : subject,
        html    : html
    }

    return transporter.sendMail(mailOption)
}

module.exports = { response, dbConnection, timeNow, randomNumber, mail }