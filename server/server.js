const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config()
const router = require("./router");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.static("../client"));

app.use(helmet());
app.use(morgan("dev"));
app.use(router);
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    if(error) throw error;
    else console.log("connected to db");
});


app.listen(process.env.PORT, () => console.log(`server running on port: ${process.env.PORT}`));