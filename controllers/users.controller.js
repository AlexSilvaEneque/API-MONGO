const User = require("../models/user.model")
const { hashPassword } = require("../helpers/password-handler")
const { rToken } = require("../helpers/random-token")
const { verify_email } = require("../helpers/handler-send-email")
const { host } = require("../config")

class UserController {
    async readAll(req, res) {
        try {
            const usersList = await User.find().select('-passwordHash')
            const countUser = await User.countDocuments()
            if (!usersList) {
                throw new Error('Empty collection!')
            }
            return res.status(200).json({ usersList, countUser })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async readById(req, res) {
        try {
            const idUser = req.params.id
            const user = await User.findById(idUser)
            if (!user) {
                throw new Error('User not found!')
            }
            return res.status(200).json({ user, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async saveUser(req, res) {
        try {
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                passwordHash: hashPassword(req.body.password),
                street: req.body.street,
                apartment: req.body.apartment,
                city: req.body.city,
                country: req.body.country,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin,
                emailToken: rToken()
            })
        
            user = await user.save()

            //TODO: send email
            //FIXME: in development uses environment variable for host
            // const link = `${host}/api/v1/users/verify-email/${user.emailToken}`

            verify_email(user.email, link)

            if (!user) {
                throw new Error('The user cannot be created!')
            }
            return res.status(200).json({ user, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }
}

module.exports = UserController