import { Router } from "express";
import  verify  from "jsonwebtoken";
import PRIVATE_KEY from "../utils/jwt.js";

class RouterClass {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  applyCallbacks(callbacks) {
    return callbacks.map((callbacks) => async (...params) => {
      try {
        await callbacks.apply(this, params);
      } catch (error) {
        console.log(error);
        params[1].status(500).send(error);
      }
    });
  }

  generateCustomResponses(req, res, next) {
    res.sendSuccess = (payload) => res.send({ status: "success", payload });
    res.sendServerError = (error) => res.send({ status: "error", error });
    res.sendUserError = (error) => res.send({ status: "error", error });
    next();
  }

  handlePolicies = (policies) => (req, res, next) => {
    if (policies[0] === "PUBLIC") return next();
    const authHeaders = req.headers.authorization;
    if (!authHeaders)
      return res.status(401).send({ status: "error", error: "Unauthorized" });
    let token = authHeaders.split(" ")[1];
    console.log(token);
    let user = verify(token, PRIVATE_KEY);
    console.log(user);
    if (!policies.includes(user.role.toUpperCase()))
      return res
        .status(403)
        .send({ status: "error", error: "not permissions" });
    req.user = user;
    next();
  };

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
  post(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
  put(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
  delte(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.handlePolicies(policies),
      this.generateCustomResponses,
      this.applyCallbacks(callbacks)
    );
  }
}

export default RouterClass;
