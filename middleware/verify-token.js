const { verifyTokens } = require('../helpers/token.helper')
const User = require('../models/user.model')

const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error(['Access denied!',403])
        }

        const token = req.headers.authorization.split(' ').pop()

        const tokenData = verifyTokens(token)

        const userFind = await User.findById(tokenData.userId)

        if (tokenData.userId && tokenData.exp === userFind.expirationDate) {
            req.currentUser = tokenData.userId
            next()
        } else {
            throw new Error(['Invalid token!',400])
        }
    } catch (error) {
        let message = error.message.split(',')[0]
        let status = error.message.split(',')[1]
        return res.status(status).json({message, success: false})
    }
}

module.exports = verifyToken