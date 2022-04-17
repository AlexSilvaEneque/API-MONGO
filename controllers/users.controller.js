const User = require("../models/user.model")
const bcryptjs = require('bcryptjs')

class UserController {
    async readAll(req, res) {
        const usersList = await User.find().select('-passwordHash')
        if (!usersList) {
            return res.status(500).json({success: false})
        }
        return res.status(200).send(usersList)
    }

    async readById(req, res) {
        const idUser = req.params.id
        const user = await User.findById(idUser)
        if (!user) {
            return res.status(500).json({message: 'User not found!', success: false})
        }
        return res.status(200).send(user)
    }

    async saveUser(req, res) {
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

        try {
            user = await user.save()
            if (!user) {
                return res.status(500).json({message: 'The User cannot be created!'})
            }
            return res.status(200).send(user)
        } catch (error) {
            return res.status(400).json(error)
        }
    }
}

module.exports = UserController