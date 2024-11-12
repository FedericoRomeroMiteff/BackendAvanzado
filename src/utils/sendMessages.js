import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

import configObject from "../config/passport.config.js";

const { twilio_account_sid, twilio_auth_token, twilio_phone_number } =
  configObject;

const client = twilio(twilio_account_sid, twilio_auth_token);

export async function sendMessage() {
  return await client.messages.create({
    body: "Esto es un mensaje de prueba",
    from: twilio_phone_number,
    to: "+541164501997",
  });
}

export default sendMessage;
