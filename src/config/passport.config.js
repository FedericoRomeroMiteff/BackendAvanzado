import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UsersMongo } from "../dao/usersMongo.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const userService = new UsersMongo();

const initializePassport = () => {
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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userService.getUser({ _id: id });
    done(null, user);
  });
};

export { initializePassport };
