const express = require("express");

const app = express();

app.use(express.static('client'))

app.get("/", (req, res) => {
    res.sendFile("login.html", {root: 
        "client/views"});
})

app.get("/signup", (req,res) => {
    res.sendFile("signup.html", {root: 
        "client/views"});
})


app.listen(process.env.PORT || 3000, () => console.log("server running"));