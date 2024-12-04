import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import UsersMongo from "../dao/usersMongo.js";
import { createHash, isValidPassword } from "../utils/validatePassword.js";
import dotenv from "dotenv";
import UserDTO from "../dto/users.dto.js";

dotenv.config();

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
        secretOrKey: process.env.PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          const userDTO = new UserDTO(jwt_payload);
          return done(null, userDTO);
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
          if (userFound)
            return done(null, false, { message: "User already exists" });
          let newUser = {
            first_name,
            last_name,
            email: username,
            password: createHash(password),
          };
          let result = await userService.createUser(newUser);
          return done(null, new UserDTO(result));
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
          if (!user) return done(null, false, { message: "Incorrect email" });
          if (!isValidPassword(password, user.password))
            return done(null, false, { message: "Incorrect password" });
          return done(null, new UserDTO(user));
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.PRIVATE_KEY,
      },
      async (jwt_payload, done) => {
        try {
          const user = await userService.getUser({ email: jwt_payload.email });
          if (!user) return done(null, false);
          return done(null, new UserDTO(user));
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
    done(null, new UserDTO(user));
  });
};

export default initializePassport;
