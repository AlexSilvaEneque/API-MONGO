const bcryptjs = require('bcryptjs')

const hashPassword = (password) => {
    return bcryptjs.hashSync(password, 10)
}

const comparePassword = async(password, hash) => {
    return await bcryptjs.compare(password, hash)
}

module.exports = { hashPassword, comparePassword }