const jwt = require('jsonwebtoken')
const { secret_string } = require('../config')

const tokenSign = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            isAdmin: user.isAdmin
        },
        secret_string,
        {
            expiresIn: '3h'
        }
    )
}

const verifyTokens = (token) => {
    try {
        return jwt.verify(token, secret_string)
    } catch (error) {
        return error
    }
}

//TODO: hace lo mismo que el de arriba
const decodeTokens = (token) => {
    try {
        return jwt.decode(token)
    } catch (error) {
        return error
    }
}

module.exports = { tokenSign, verifyTokens, decodeTokens }