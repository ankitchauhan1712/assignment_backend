const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let account = await Account.findOne({ where: { email: profile.emails[0].value } });
        if (!account) {
            account = await Account.create({
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.emails[0].value,
                password: '', // Since we are using OAuth, password is not needed
            });
        }

         // Generate JWT token
         const token = jwt.sign({ userId: account.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
       
        // Pass token along with user info
        done(null, { account , token });
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.account.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Account.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
