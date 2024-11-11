const accountSid = "AC37e5f7a7a15b944334a6cc0883cf3a4f";
const authToken = "7ecd20e101fe49e65dd10b4e76de132d";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
  .services("VAc8b211b2c1c9d419010d201456eeab51")
  .verificationChecks.create({ to: "+541164501997", code: "[566137]" })
  .then((verification_check) => console.log(verification_check.status));
/*
      {
        "status": "approved",
        "payee": null,
        "date_updated": "2024-11-11T21:59:01Z",
        "account_sid": "AC37e5f7a7a15b944334a6cc0883cf3a4f",
        "to": "+541164501997",
        "amount": null,
        "valid": true,
        "sid": "VE0f2a0338498eb8c899a7054ee7317d44",
        "date_created": "2024-11-11T21:58:46Z",
        "service_sid": "VAc8b211b2c1c9d419010d201456eeab51",
        "channel": "sms"
      }
*/
