const crypto = require("crypto");

module.exports = {
    handleErrors: (error, req, res) => {
        
        console.log("Error Handling : ", error)
        res.status(500).json({
            message: "Une erreur serveur interne est survenue"
        })
    },
    createID: () => {
        var text = ":"+crypto.randomBytes(64).toString('base64')+":"+ (new Date().toString())
        var id = crypto.createHmac('sha1', process.env.HASHKEY).update(text).digest('hex')
        return id
    },
    hashPassword: (clearPassword) => {
        var password = crypto.createHmac('sha1', process.env.HASHKEY).update(clearPassword).digest('hex')
        console.log("Hashed Password:", password);
        return password
    }
}