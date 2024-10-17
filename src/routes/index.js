import { Router } from "express";
import userRouter from "./users.js";
import vistasRouter from "./views.js";
import sessionsRouter from "./sessions.js";
import { uploader } from "../utils/uploader.js";

const router = Router();

router.use("/", vistasRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/api/users", userRouter);
router.use("/api/products", () => {});
router.use("/api/carts", () => {});
router.post("/uploader", uploader.single("myFile"), (req, res) => {
  res.send("Imagen subida");
});

export default router;

