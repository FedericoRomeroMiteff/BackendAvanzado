import { Router } from "express";
import fork from "child_process";
import sendEmail from "../utils/sendEmail.js";
import sendMessage from "../utils/sendMessages.js";

const router = Router();

router.get("/sms", async (req, res) => {
  const first_name = "Usuario";
  const last_name = "123";
  await sendMessage();
  res.send("sms enviado");
});
router.get("/email", async (req, res) => {
  const first_name = "Usuario";
  const last_name = "123";
  await sendEmail({
    userClient: "fromeromiteff@gmail.com",
    subject: "Mail de prueba",
    html: `
            <div>
                <h1>Bienvenido ${first_name} ${last_name}</h1>
            </div>
        `,
  });
  res.send("email enviado");
});

export default router;
