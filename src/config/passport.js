const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./database');

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          name: true,
          profileImage: true,
        },
      });

      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Check if user with this email exists
          user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value },
          });

          if (user) {
            // Update existing user with Google ID
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId: profile.id,
                profileImage: profile.photos[0]?.value,
              },
            });
          } else {
            // Create new user
            user = await prisma.user.create({
              data: {
                email: profile.emails[0].value,
                name: profile.displayName,
                googleId: profile.id,
                profileImage: profile.photos[0]?.value,
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

module.exports = passport;
