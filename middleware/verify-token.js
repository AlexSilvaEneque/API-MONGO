const { verifyTokens } = require('../helpers/token.helper')

const verifyToken = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error(['Access denied!',403])
        }

        const token = req.headers.authorization.split(' ').pop()

        const tokenData = verifyTokens(token)

        if (tokenData.userId) {
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