const User = require("../models/user.model")
const bcryptjs = require("bcryptjs")
const { tokenSign, decodeTokens } = require("../helpers/token.helper")

class AuthController {
    async login(req, res) {
        try {
            const user = await User.findOne({email: req.body.email})
            
            if (!user) {
                throw new Error('User not found with email sended!')
            }

            if (user && await bcryptjs.compare(req.body.password, user.passwordHash)) {
                const newToken = tokenSign(user)
                const infoDecoded = decodeTokens(newToken)
                user.expirationDate = infoDecoded.exp
                await user.save()
                return res.status(200).json({message: 'User Authenticated ... Welcome!', toke: newToken})
            } else {
                throw new Error("Password is wrong!")
            }
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }

    async logout(req, res) {
        try {
            const { currentUser } = req
            const user = await User.findById(currentUser)            
            if (user) {
                user.expirationDate = Math.floor(new Date().getTime()/1000)
                await user.save()
                return res.status(200).json({ message: 'Sesión cerrada!' })
            }
            throw new Error('Error al cerrar sesion!')
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = AuthController