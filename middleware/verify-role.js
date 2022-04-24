const { verifyTokens } = require("../helpers/token.helper")
const User = require('../models/user.model')

const verifyRole = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ').pop()

        if (!token) {
            throw new Error('Access denied!')
        }
    
        const tokenData = verifyTokens(token)
        const userData = await User.findById(tokenData.userId).select('-passwordHash')
        
        if (userData.isAdmin) {
            next()
        } else {
            throw new Error("You don't have permissions")
        }
    } catch (error) {
        return res.status(403).json({ message: error.message, success: false })
    }
}

module.exports = verifyRole