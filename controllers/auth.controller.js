const User = require("../models/user.model")

class AuthController {
    async login(req, res) {
        const user = await User.findOne({email: req.body.email})

        if (!user) {
            return res.status(500).json({message: 'User not found with email sended!'})
        } else {
            
        }
    }
}

module.exports = AuthController