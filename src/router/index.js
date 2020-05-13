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
            services: '[{"website":"https://proprconsulting.com","categories":["NOURRITURE","VETEMENTS"],"contact":{"mail":"nassim.benelhadj@gmail.com","phone":"0659047087"},"createdAt":"2020-5-13 16:37:18","address":{"zip":"92160","number":"43","city":"ANTONY","street":"rue de Massy","coords":{"lng":"2.3","lat":"47.8"}},"hours":{"sunday":{"isClosed":false,"value":["14:00","19:00"]},"saturday":{"isClosed":false,"value":["12:00","16:00"]},"tuesday":{"isClosed":"true"},"wednesday":{"isClosed":"true"},"thursday":{"isClosed":"true"},"friday":{"isClosed":"true"},"monday":{"isClosed":"true"}},"id":"cb868dfe6bbddc199588616b5d5ef9e170f9eb4e","createdBy":"Super Admin","name":"Nassim-AIDES"}, {"website":"https://proprconsulting.com","categories":["NOURRITURE","VETEMENTS"],"contact":{"mail":"nassim.benelhadj@gmail.com","phone":"0659047087"},"createdAt":"2020-5-13 16:37:18","address":{"zip":"92160","number":"43","hours":{"sunday":{"isClosed":false,"value":["14:00","19:00"]},"saturday":{"isClosed":false,"value":["12:00","16:00"]},"tuesday":{"isClosed":"true"},"wednesday":{"isClosed":"true"},"thursday":{"isClosed":"true"},"friday":{"isClosed":"true"},"monday":{"isClosed":"true"}},"city":"ANTONY","street":"rue de Massy","coords":{"lng":"2.3","lat":"47.8"}},"id":"2","createdBy":"Super Admin","name":"Nassim-AIDES"}]',//JSON.stringify(req.service_data),
            error: req.service_error
        })
    })

    app.delete("/delete/:id", controller.verifyCookie, controller.verifyCookie, controller.removeService);

    /*********************/
    /** SUPER ADMIN Only*/
    // app.post("/createUser", controller.createUser, utils.handleErrors);
    /*******************/
}