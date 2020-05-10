const crypto = require("crypto");

module.exports = {
    createID: () => {
        var text = ":"+crypto.randomBytes(64).toString('base64')+":"+ (new Date().toString())
        var id = crypto.createHmac('sha1', process.env.HASHKEY).update(text).digest('hex')
        return id
    },
    hashPassword: (clearPassword) => {
        var password = crypto.createHmac('sha1', process.env.HASHKEY).update(clearPassword).digest('hex')
        return password
    }
}