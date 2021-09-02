require("dotenv").config();
const express = require("express");
const loginValidation = require("./validation");
const router = express.Router();
const User = require("./userSchema");
const nodemailer = require("nodemailer");


//bcrypt settings
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport =require("./passport");
const flash = require("express-flash");



router.get("/", checkNotAuthenticated, (req, res) => {
    const error = req.flash().error;
    console.log(error);
    res.render("login", { error });
});

router.get("/dashboard", checkAuthenticated, (req, res) => {
    res.render("dashboard");
});

router.get("/signup", checkNotAuthenticated, (req, res) => {
    res.render("signup");
});

router.get("/signup/confirmed/", async (req, res) => {
    const email = req.query.email;
    const verified = await confirmEmailVerification(email, req.query.token);
    if(verified === true) {
        res.render("success");
    } else {
        res.render("failure", { email: req.query.email });
    }
});

router.get("/signup/resend", async (req, res) => {
    const email = req.query.email;
    const passwordResetToken = Math.floor(Math.random() * (9000 - 1000 + 1)) + 1000;
    await changeVerificationToken(email, passwordResetToken);
    sendVerificationEmail(email, passwordResetToken);
    res.render("check");
});

router.post("/auth/login", passport.authenticate("local", {
    failureFlash: true,
    successRedirect: "/dashboard",
    failureRedirect: "/"
}));
    
router.post("/auth/signup", checkNotAuthenticated, async (req, res) => {
    const formValidated = await loginValidation(req.body.email, req.body.password);
    if(formValidated === true) {
        const email = req.body.email;
        const exists = await userExists(email);
        if(exists) {
            res.render("login.handlebars", { error: "Signup failed: User already exists, please login" } )
        } else {
            addUser(email, req.body.password);
            res.render("check");
        }
    } else {
        console.error(formValidated);
    }
});


// FUNCTIONS ///

// add user to db
function addUser(email, password) {
    const passwordResetToken = Math.floor(Math.random() * (9000 - 1000 + 1)) + 1000;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) {
            console.error(err)
        } else {
            const newUser =  new User({
                email: email,
                password: hash,
                passwordResetToken: passwordResetToken
            })
            newUser.save();
        }
    })
    sendVerificationEmail(email, passwordResetToken);
}

// search if user exists in db
async function userExists(email) {
    let found = false;
    await User.findOne({ email: email }, (err, docs) => {
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

async function confirmEmailVerification(email, token) {
    let confirmed = false;
    await User.findOne({ email: email }, (err, docs) => {
        if(err) {
            console.error(err);
            return null;
        }
        if(docs["passwordResetToken"] === token) {
            confirmed = true; 
            console.log("user verifiction successfull");
        }
    })
    if(confirmed) {
        await User.findOneAndUpdate({ email: email }, { isVerified : true, passwordResetToken: null}, { new: true });
    }
    return confirmed;
}

// Send email with verification link
function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: "Halo.",
        to: email,
        subject: "Halo. Account Verification",
        html: `<h2>${email}, please click the below link to verify your Halo. account</h2><br>
        <a href="http://localhost:4000/signup/confirmed/?token=${token}&email=${email}">Verification Link</a>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.error(error);
        }
        console.log('Message sent: %s', info.messageId);
    })
}

async function changeVerificationToken(email, token) {
    await User.findOneAndUpdate({email: email}, {passwordResetToken: token});
}

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/");
    }
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect("/dashboard");
    } else {
        return next();
    }
}

module.exports = router;