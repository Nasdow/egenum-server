const controllers = require("../controller");
const utils = require("../utils");

module.exports = (app) => {
    /** Entry point*/
    app.get("/welcome", controllers.entry, utils.handleErrors)

    /**Post data */

    /** */
}