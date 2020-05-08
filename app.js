const path = require("path");
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const router = require("./src/router")

const PORT = process.env.PORT || 5000
var app = express();
var server = http.createServer(app);

const whiteList = ['http://localhost:5000', 'http://127.0.0.1:5000', 'https://egenum-admin.herokuapp.com']
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS : ' + origin))
        }
    },
    methods: "GET, HEAD, POST, PUT, DELETE"
}
app.use(cors(corsOptions))
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, "public")))

router(app)

server.listen(PORT, ()=> {
    console.log("Server listening on 5000...");
})