import dotenv from "dotenv";
import program from "../utils/commander.js";
import MongoSingleton from "../utils/mongoSingleton.js";

const { mode } = program.opts();
dotenv.config({
  path: mode === "development" ? "./.env.development" : "./.env.production",
});

console.log("variable nombre: ", process.env.NOMBRE);

export const configObject = {
  port: process.env.PORT || 8080,
  private_key: process.env.PRIVATE_KEY,
  persistence: process.env.PERSISTENCE,
  gmail_user: process.env.GMAIL_USER,
  gmail_pass: process.env.GMAIL_PASS,
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
};

export async function connectDB() {
  return await MongoSingleton.getInstance();
}
