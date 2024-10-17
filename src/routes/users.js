import { Router } from "express";
import UsersMongo from "../dao/usersMongo.js"; // Asegúrate de que la extensión .js esté incluida
import { authTokenMiddleware } from "../utils/jwt.js"; // Asegúrate de que la extensión .js esté incluida

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
