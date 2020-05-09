const controller = require("../controller");
const utils = require("../utils");

module.exports = (app) => {
    /** Entry point*/
    app.get("/", (req, res) => {
        res.render("index");
    })
    /** Login */
    app.get("/login", (req, res) => {
        res.render("login", {
            data: {},
            errors: {}
        });
    })
    app.post("/login", controller.authenticate, (req, res) => {
        res.render("login", {
            data: req.user_data,
            errors: req.user_errors
        })
    })

    /** Visualisation des données */

    /** Création des données */

    /**Post data */

    /*********************/
    /** SUPER ADMIN Only*/
    // app.post("/createUser", controller.createUser, utils.handleErrors);
    /*******************/
}