const passport = require("passport");
LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("./userSchema");

passport.use(new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    User.findOne({ email: username }, async (err, user) =>  {
        if(err) { return done(err) }
        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log("passport authenticated");
                return done(null, user);
            } else {
                console.log("not authenticated");
                return done(null, false, { message: "Email or Password Incorrect" })
            }
        } catch (error){
            return done(error);
        }
    })
}))

passport.serializeUser((user, done) => { return done(null, user.id)});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if(err) {
            return done(err);
        }
        console.log("deserializeUser: " + user);
        return done(null, user);
        }
    )
});

module.exports = passport;

