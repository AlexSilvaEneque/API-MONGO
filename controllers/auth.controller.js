const User = require("../models/user.model")
const { tokenSign, decodeTokens, verifyTokens } = require("../helpers/token.helper")
const { send_email } = require("../helpers/handler-send-email")
const { comparePassword, hashPassword } = require("../helpers/password-handler")
const { host_frontend } = require("../config")

class AuthController {
    async login(req, res) {
        try {
            const user = await User.findOne({email: req.body.email})
            
            if (!user) {
                throw new Error('User not found with email sended!')
            }

            if (user && await comparePassword(req.body.password, user.passwordHash)) {
                if (!user.isVerified) {
                    throw new Error('Check your email and verify your account!')
                }

                const newToken = tokenSign(user)
                const infoDecoded = decodeTokens(newToken)
                user.expirationDate = infoDecoded.exp
                await user.save()
                return res.status(200).json({message: 'User Authenticated ... Welcome!', toke: newToken})

            } else {
                throw new Error("Password is wrong!")
            }
        } catch (error) {
            return res.status(500).json({error: error.message, success: false})
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

    async forgotPassword (req, res) {
        try {
            const { email }  = req.body

            if (!email) {
                throw new Error('Email is required!')
            }

            let user = await User.findOne({ email })

            if (!user) {
                throw new Error('Ups ! user not found')
            }

            const tokenReset = tokenSign(user)
            // TODO: enviar la ruta que lleva al front correspondiente ....
            const link = `${host_frontend}/new-password/${tokenReset}`
            const infoDecoded = decodeTokens(tokenReset)
            user.expirationDate = infoDecoded.exp
            await user.save()

            console.log(tokenReset)

            // TODO: send email
            send_email(user.email, link)

            // TODO: verificar que email y user, ver como manejar eso del token,, quizas sea necesario guardarlo en la bd,
            // la finalidad de este método es que si todo está bien enviar un email con la ruta que llevará al formulario
            // donde se hará la actualizacion del password
            
            return res.status(200).json({ message: 'Check your email for a link to reset your password', success: true })

            
        } catch (error) {
            return res.status(400).json({ message: error.message, success: false })
        }
    }

    async newPassword(req, res) {
        try {
            const { newPassword } = req.body
            const resetToken = req.headers.reset //TODO: agregar reset en headers
            
            if (!resetToken && !newPassword) {
                throw new Error('All the fields are required!')
            }

            let tokencito = verifyTokens(resetToken)
            
            let user = await User.findById(tokencito.userId)
            
            user.passwordHash = hashPassword(newPassword)
            await user.save()

            return res.status(200).json({ message: 'Password changed successfully!' })

        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }


    async verifyEmail(req, res) {
        try {
            const { token } = req.params

            let user = await User.findOne({ emailToken: token })
            
            if (!user) {
                throw new Error('Error not found!')
            }

            user.emailToken = null,
            user.isVerified = true

            await user.save()

            return res.send('Account successfully verified')

        } catch (error) {
            return res.status(400).json({ message: error.message, success: false })
        }
    }
}

module.exports = AuthController