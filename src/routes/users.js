import { Router } from "express";
import passportCall from "../middleware/passport/passportCall.js";
import UsersController from "../controllers/users.controller.js";

const router = Router();

function auth(req, res, next) {
  req.user = {
    name: "Usuario1",
    role: "Administrador",
  };
  if (req.user.role !== "Administrador") {
    return res.send("No es administrador");
  }
  next();
}

const { getUser, getUsers, createUser, updateUser, deleteUser } =
  new UsersController();

router.get("/", passportCall("jwt"), getUsers);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:uid", updateUser);
router.delete("/:uid", deleteUser);
export default router;
