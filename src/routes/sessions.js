import { Router } from "express";
import UsersMongo from "../dao/usersMongo.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import passportCall from "../utils/passportCall.js";

const router = Router();
const usersService = new UsersMongo();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  console.log(first_name, last_name, email, password);
  if (!first_name || !email || !password) {
    return res.status(400).send({
      status: "success",
      message: "Debes llenar todos los campos requeridos",
    });
  }

  const userFound = await usersService.getUser({ email });
  console.log(userFound);

  if (userFound) {
    return res.status(401).send({
      status: "error",
      message: "El usuario con ese email ya existe",
    });
  }

  const newUser = {
    first_name,
    last_name,
    email,
    password: createHash(password),
  };

  let result = await usersService.createUser(newUser);

  res.send({
    status: "success",
    data: result,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: "success",
      message: "Deben venir todos los campos requeridos",
    });
  }

  const userFound = await usersService.getUser({ email });
  if (!userFound) {
    return res.status(401).send({
      status: "error",
      message: "No se encuentra el usuario con ese email",
    });
  }

  if (!isValidPassword(password, userFound.password)) {
    return res.send({
      status: "error",
      message: "Las credenciales no coinciden",
    });
  }

  const token = generateToken({
    id: userFound._id,
    email: userFound.email,
    role: userFound.role === "admin",
  });
  res.cookie("token", token, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  res.send({
    status: "success",
    message: "Logged",
    token,
  });
});
router.post("/changepass", async (req, res) => {
  const { email, password } = req.body;

  const userFound = await userServise.getUser({ email });

  if (!userFound) {
    return res.send({ stauts: "error", error: "no existe el usuario" });
  }
  res.send("se a cambiado correctamente la contraseña");
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send({ status: "error", error });
  });
  res.send("logout");
});
router.get("/current", passportCall("jwt"), (req, res) => {
  res.send({ dataUser: req.user, message: "Datos sensibles" });
});

router.post("/logout", (req, res) => {
  res.send("Logout");
});

export default router;
