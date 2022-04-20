const User = require("../models/user.model")
const bcryptjs = require("bcryptjs")
const jwt = require('jsonwebtoken')
const { secret_string } = require("../config")

class AuthController {
    async login(req, res) {
        const user = await User.findOne({email: req.body.email})

        if (!user) {
            return res.status(500).json({message: 'User not found with email sended!'})
        }

        if (user && bcryptjs.compareSync(req.body.password, user.passwordHash)) {
            const newToken = jwt.sign(
                {
                    userId: user._id,
                    isAdmin: user.isAdmin,
                    name: user.name
                },
                    secret_string,
                {
                    expiresIn: '1d'
                }
            )
            return res.status(200).json({message: 'User Authenticated ... Welcome!', toke: newToken})
        } else {
            return res.status(500).json({message: "Password is wrong!"})
        }
    }
}

module.exports = AuthController