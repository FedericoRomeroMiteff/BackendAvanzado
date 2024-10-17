import jwt from "jsonwebtoken";

const PRIVATE_KEY = "CoderSecretpara-lafirmA";

export const generateToken = (user) =>
  jwt.sign(user, PRIVATE_KEY, { expiresIn: "1h" });

export const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res
      .status(401)
      .send({ status: "error", error: "not authenticated" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, PRIVATE_KEY, (error, dataToken) => {
    if (dataToken.role !== "admin") {
      return res.send("chau");
    }
    req.user = dataToken;
    next();
  });
};
