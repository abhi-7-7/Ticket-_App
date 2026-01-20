import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import { comparePassword } from '../utils/hash.js';

// Configure LocalStrategy
// Password verification uses bcrypt.compare via `comparePassword` helper.
passport.use(
  new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).exec();
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      // If user has no password set, reject (signup flow will set hashed password)
      if (!user.password) {
        return done(null, false, { message: 'No password set for this account.' });
      }

      const ok = await comparePassword(password, user.password);
      if (!ok) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize user id into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session by id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password').exec();
    done(null, user || null);
  } catch (err) {
    done(err);
  }
});

export default passport;
