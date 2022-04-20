const jwt = require('jsonwebtoken')
const { secret_string, prefix } = require('../config')

const verifyToken = (req, res, next) => {
    console.log(req.method)
    if (req.url === `${prefix}/users/login` || req.url === `${prefix}/users/register` || (req.url.includes(`${prefix}/products`) && req.method === 'GET') || (req.url.includes(`${prefix}/categories`) && req.method === 'GET')) {
        return next()
    }

    const token = req.header('auth-token')

    if (!token) {
        return res.status(403).json({message: "Access denied!", success: false})
    }

    try {
        const verified = jwt.verify(token,secret_string)
        next()
    } catch (error) {
        return res.status(400).json({message: "Invalid token!", success: false})
    }
}

module.exports = verifyToken