import passport from "passport";

const passportCall = (strategy, options = {}) => {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { ...options, session: false },
      (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        req.user = user;
        next();
      }
    )(req, res, next);
  };
};

export default passportCall;
