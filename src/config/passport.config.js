import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pkg from "passport-jwt";
const { Strategy: JWTStrategy, ExtractJwt } = pkg;
import UsersMongo from "../dao/usersMongo.js";
import { createHash, isValidPassword } from "../utils/validatePassword.js";
import jwt from "passport-jwt";
import PRIVATE_KEY from "../utils/jwt.js";

const userService = new UsersMongo();

const initializePassport = () => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["token"];
    }
    return token;
  };
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name } = req.body;
        try {
          let userFound = await userService.getUser({ email: username });
          if (userFound) return done(null, false);
          let newUser = {
            first_name,
            last_name,
            email: username,
            password: createHash(password),
          };
          let result = await userService.createUser(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al crear un usuario: " + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await userService.getUser({ email: username });
          if (!user) return done(null, false);

          if (!isValidPassword(password, user.password))
            return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, _, __, done) => {
        const token = req.cookies["jwtToken"];
        if (!token) {
          return done(null, false, { message: "No token provided" });
        }
        try {
          const decoded = jwt.verify(token, "secretCoder");
          const user = await userService.getUser({ email: decoded.email });
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userService.getUser({ _id: id });
    done(null, user);
  });
};

export { initializePassport };
