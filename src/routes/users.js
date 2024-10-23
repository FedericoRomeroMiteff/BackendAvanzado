import { Router } from "express";
import UsersMongo from "../dao/usersMongo.js";
import { authTokenMiddleware } from "../utils/jwt.js";
import passportCall from "../utils/passportCall.js";

const router = Router();
const userService = new UsersMongo();

router
  .get("/", authTokenMiddleware, async (req, res) => {
    try {
      const users = await userService.getUsers();
      res.send({
        status: "success",
        payload: users,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  })
  .get("/:uid", async (req, res) => {
    res.send("users");
  })
  .get("/profile", passportCall("current", { session: false }), (req, res) => {
    res.send({
      status: "success",
      user: req.user,
    });
  })
  .post("/", async (req, res) => {
    const newUser = req.body;
    try {
      const result = await userService.createUser(newUser);
      res.send({
        status: "success",
        payload: result,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ status: "error", message: "Internal Server Error" });
    }
  })
  .put("/:uid", async (req, res) => {
    res.send("users");
  })
  .delete("/:uid", async (req, res) => {
    res.send("users");
  });

export default router;
