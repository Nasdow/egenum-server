const controllers = require("../controller");
const utils = require("../utils");

module.exports = (app) => {
    /** Entry point*/
    app.get("/", (req, res) => {
        res.render("index");
    })

    app.get("/login", (req, res) => {
        res.render("login", {
            data: {},
            errors: {}
        });
    })
    /**Middlewares: check input validity, check auth with AWS */
    app.post("/login", (req, res) => {
        res.render("login", {
            data: req.body,
            errors: {
                userName: {
                    msg: "Le nom d'utilisateur est incorrect !"
                },
                password: {
                    msg: "Le mot de passe est incorrect !"
                }
            }
        })
    })

    /**Post data */

    /** */
}