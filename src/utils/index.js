module.exports = {
    handleErrors: (error, req, res) => {
        
        console.log("Error Handling : ", error)
        /**
         * ERROR LOGGING HERE
         */
        res.status(500).json({
            message: "Une erreur serveur interne est survenue"
        })
    }
}