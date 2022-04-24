const User = require("../models/user.model")
const bcryptjs = require('bcryptjs')

class UserController {
    async readAll(req, res) {
        try {
            const usersList = await User.find().select('-passwordHash')
            const countUser = await User.countDocuments()
            if (!usersList) {
                throw new Error('Empty collection!')
            }
            return res.status(200).json({ usersList, countUser })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async readById(req, res) {
        try {
            const idUser = req.params.id
            const user = await User.findById(idUser)
            if (!user) {
                throw new Error('User not found!')
            }
            return res.status(200).json({ user, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }

    async saveUser(req, res) {
        try {
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                passwordHash: bcryptjs.hashSync(req.body.password, 10),
                street: req.body.street,
                apartment: req.body.apartment,
                city: req.body.city,
                country: req.body.country,
                phone: req.body.phone,
                isAdmin: req.body.isAdmin
            })
        
            user = await user.save()
            if (!user) {
                throw new Error('The user cannot be created!')
            }
            return res.status(200).json({ user, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }
}

module.exports = UserController