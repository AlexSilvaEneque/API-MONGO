const crypto = require('crypto')

const rToken = () => {
    return crypto.randomBytes(64).toString('hex')
}

module.exports = { rToken }