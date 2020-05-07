module.exports = {
    entry: (req, res, next) => {
        try {

            console.log("Welcome to Egenum :)");
            res.json("Welcome to Egenum !")

        } catch (error) {
            next(error);
        }
    }
}