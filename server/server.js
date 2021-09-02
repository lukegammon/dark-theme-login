const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("./passport");
const flash = require("express-flash");

require("dotenv").config()
const router = require("./router");
const exphbs = require("express-handlebars");

const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "../client/views")
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("../client"));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(morgan("dev"));
app.use(flash())
app.use(router);

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});


const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true }, (error) => {
    if(error) throw error;
    else console.log("connected to db");
});


app.listen(process.env.PORT, () => console.log(`server running on port: ${process.env.PORT}`));