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
                httpOnly: false,
                maxAge: 21600000
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
    app.get("/create", controller.verifyCookie, controller.verifyUser, (req, res) => {
        res.render("create", {
            userData: req.cookies.egenum,
            result: undefined
        })
    })
    app.post("/create", controller.verifyCookie, controller.verifyUser, controller.createService, (req, res) => {
        res.render("create", {
            userData: req.cookies.egenum,
            result: req.service_result
        })
    })

    /** Visualisation des données */
    app.get("/manage", controller.verifyCookie, controller.verifyUser, /*controller.getAllServices,*/ (req, res) => {
        res.render("manage", {
            userData: req.cookies.egenum,
            services: JSON.stringify(req.service_data),
            error: req.service_error
        })
    })

    app.delete("/delete/:id", controller.verifyCookie, controller.verifyCookie, controller.removeService);

    /*********************/
    /** SUPER ADMIN Only*/
    // app.post("/createUser", controller.createUser, utils.handleErrors);
    /*******************/
}