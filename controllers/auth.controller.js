const User = require("../models/user.model")
const bcryptjs = require("bcryptjs")
const { tokenSign } = require("../helpers/token.helper")

class AuthController {
    async login(req, res) {
        try {
            const user = await User.findOne({email: req.body.email})
        // as
        if (!user) {
            throw new Error('User not found with email sended!')
        }

        if (user && await bcryptjs.compare(req.body.password, user.passwordHash)) {
            const newToken = tokenSign(user)
            return res.status(200).json({message: 'User Authenticated ... Welcome!', toke: newToken})
        } else {
            throw new Error("Password is wrong!")
        }
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
}

module.exports = AuthController