const controller = require("../controller");

module.exports = (app) => {
    /** Entry point*/
    app.get("/", controller.verifyCookie, controller.verifyUser, (req, res, next) => {
        res.render("index", {
            userData: JSON.parse(req.cookies.egenum)
        });
    })

    /** Login */
    app.get("/login", (req, res) => {
        res.render("login", {
            data: {},
            errors: {}
        });
    })
    app.post("/login", controller.authenticate, (req, res) => {
        if(req.user_data.id !== undefined) {
            res.cookie("egenum", JSON.stringify(req.user_data), {
                httpOnly: true,
                maxAge: 86400000
            })
            res.redirect("/");
        }
        else {
            res.render("login", {
                data: {},
                errors: req.user_errors
            })
        }
    })

    /** Logout */
    app.get("/logout", (req, res) => {
        res.cookie("egenum", "", {
            httpOnly: true,
            maxAge: 0
        })
        res.end()
    })

    /** Création des données */
    app.get("/create", (req, res) => {
        res.render("create", {
            result: undefined
        })
    })
    app.post("/create", controller.verifyCookie, controller.verifyUser, controller.createService, (req, res) => {
        res.render("create", {
            result: req.service_result
        })
    })

    /** Visualisation des données */
    app.get("/manage", controller.verifyCookie, controller.verifyUser, controller.getAllServices, (req, res) => {
        res.render("manage", {
            services: req.service_data,
            error: req.service_error
        })
    })

    /*********************/
    /** SUPER ADMIN Only*/
    // app.post("/createUser", controller.createUser, utils.handleErrors);
    /*******************/
}