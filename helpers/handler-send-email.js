"use strict"
const nodemailer = require("nodemailer");
const { email_user, email_psswd } = require("../config");

const verify_email = async (email, link) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: email_user,
            pass: email_psswd
        }
    })

    await transporter.sendMail({
        from: '"Verify Email 🚀♻🚀 AMSEDEV"',
        to: email,
        subject: "Verify Email 🚀♻🚀 AMSEDev",
        html: `
            <b>${email} Thanks for registering on our site.</b>
            <br>
            <b>Please click on the following link to verify your account.</b>
            <br>
            <a href="${link}" target="_blank">${link}</a>
        `
    })
}

const send_email = async (email, link) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: email_user,
            pass: email_psswd
        }
    })

    await transporter.sendMail({
        from: '"Reset password 🚀♻🚀 AMSEDEV"',
        to: email,
        subject: "Reset password 🚀♻🚀 AMSEDev",
        html: `
            <b>Please click on the following link for your reset password:</b>
            <br>
            <a href="${link}" target="_blank">${link}</a>
        `
    })
}

module.exports = { send_email, verify_email }