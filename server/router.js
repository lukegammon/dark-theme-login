const express = require("express");
const loginValidation = require("./validation");
const router = express.Router();
const User = require("./userSchema");
const mongoose = require("mongoose");

//bcrypt settings
const bcrypt = require("bcrypt");
const saltRounds = 10;

// add user to db
const addUser = (email, password) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.error(err)
        } else {
            const newUser =  new User({
                email: email,
                password: hash
            })
            newUser.save();
        }
    })
}
// search if user exists in db
const userExists = async (email) => {
    let found = false;
    await User.findOne({email: email}, (err, docs) => {
        if(err) {
            console.error(err);
            return null;
        }
        if(docs) {
            found = true;
        }
    })
    return found;
}

router.get("/", (req, res) => {
    res.render("login.handlebars");
});

router.post("/auth/login", async (req, res) => {
    const formValidated = await loginValidation(req.body.email, req.body.password);
    if(formValidated === true) {
        res.render("dashboard", { name: req.body.email });
    } else {
        console.error(formValidated);
    }
})

router.post("/auth/signup", async (req, res) => {
    const formValidated = await loginValidation(req.body.email, req.body.password);
    if(formValidated === true) {
        const email = req.body.email;
        const exists = await userExists(email);
        if(exists) {
            // reload page and display user already exists error
            console.log("Redirect to user exists page");
        } else {
            addUser(email, req.body.password);
            // email verification
            // redirect to verify your email and login page
            // pass in please login message to login page
            res.sendFile("login.html", {root: "../client/views"});
        }
        
    } else {
        console.error(formValidated);
    }
})

router.get("/signup", (req,res) => {
    res.render("signup.handlebars");
});

module.exports = router;