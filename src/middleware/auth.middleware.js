const authentication = (req, res, next) => {
  if (
    req.session.user.email !== "admin@outlook.com" ||
    !req.session.user.isAdmin
  ) {
    return res.status(401).send("Error de autenticación");
  }

  next();
};

export default { authentication };
