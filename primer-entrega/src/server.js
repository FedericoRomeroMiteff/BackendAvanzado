const express = require("express");
const app = express();
const products = require("./products");
const cart = require("./cart");

app.use(express.json());

app.use("/api/products", products);
app.use("/api/cart", cart);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor online en puerto http://localhost:${PORT}`);
});
