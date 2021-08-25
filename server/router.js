const express = require("express");
require("dotenv").config();
const loginValidation = require("./validation");
const router = express.Router();
const User = require("./userSchema");
const nodemailer = require("nodemailer");


//bcrypt settings
const bcrypt = require("bcrypt");
const saltRounds = 10;

// add user to db
const addUser = (email, password) => {
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
const userExists = async (email) => {
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

const confirmEmailVerification = async (email, token) => {
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
const sendVerificationEmail = (email, token) => {
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

const changeVerificationToken = async (email, token) => {
    await User.findOneAndUpdate({email: email}, {passwordResetToken: token});
}

const loginUser = async (email, password) => {
    try {
        const user = await User.findOne({email: email}).exec();
        if(bcrypt.compareSync(password, user.password)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error)
    }
}
    

router.get("/", (req, res) => {
    res.render("login.handlebars");
});

router.post("/auth/login", async (req, res) => {
    const formValidated = await loginValidation(req.body.email, req.body.password);
    const passwordValidated = await loginUser(req.body.email, req.body.password);
    console.log("password validated: ", passwordValidated);
    if(formValidated === true) {
        if(passwordValidated === true){
            // set JWT token ??
            res.render("dashboard");
        } else {
            res.render("login", { error: "username or password incorrect"});
        }
    } else {
        res.render("login", { error: formValidated });
    }
})

router.post("/auth/signup", async (req, res) => {
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
})

router.get("/signup", (req,res) => {
    res.render("signup.handlebars");
});

router.get("/signup/confirmed/", async (req, res) => {
    const email = req.query.email;
    const verified = await confirmEmailVerification(email, req.query.token);
    if(verified === true) {
        res.redirect("/signup/validated");
    } else {
        res.redirect(`/signup/failure?email=${email}`);
    }
})

router.get("/signup/validated", (req, res) => {
    // dont allow route to be accessible outside of signup
    res.render("success");
});

router.get("/signup/resend", async (req, res) => {
    const email = req.query.email;
    const passwordResetToken = Math.floor(Math.random() * (9000 - 1000 + 1)) + 1000;
    await changeVerificationToken(email, passwordResetToken);
    sendVerificationEmail(email, passwordResetToken);
    res.redirect("/signup/check");
});

router.get("/signup/failure/", (req, res) => {
    res.render("failure", {email: req.query.email});
});

router.get("/signup/check", (req, res) => {
    res.render("check");
})



module.exports = router;