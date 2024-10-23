import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/profile",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.send({
      status: "success",
      user: req.user,
    });
  }
);

export default router;
