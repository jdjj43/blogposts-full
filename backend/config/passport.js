const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'kuramanoestamuerto';

const strategy = new JwtStrategy(opts, (payload, done) => {
  User.findOne({ _id: payload.sub })
    .then((user) => {
      if(user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch(err => done(err, null));
});

passport.use(strategy);

module.exports = passport;
