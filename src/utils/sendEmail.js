import nodemailer from "nodemailer";
import configObject from "../config/passport.config.js";
const {createTransport} = nodemailer;

const transport = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: configObject.gmail_user,
    pass: configObject.gmail_pass,
  },
});

export async function sendEmail({ userClient = "", subject = "", html = "" }) {
  await transport.sendMail({
    from: `Coder test <${configObject.gmail_user}>`,
    to: userClient,
    subject,
    html,
    attachments: [
      {
        filename: "nodejs.png",
        path: "./src/utils/nodejs.png",
        cid: "nodejs",
      },
    ],
  });
}
export default sendEmail;
