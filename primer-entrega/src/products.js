const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const productsFilePath = path.join(__dirname, "products.json");

const readProductsFile = () => {
  if (!fs.existsSync(productsFilePath)) {
    return [];
  }
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
};

const writeProductsFile = (data) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

router.get("/", (req, res) => {
  const { limit } = req.query;
  let products = readProductsFile();
  if (limit) {
    products = products.slice(0, parseInt(limit));
  }
  res.json(products);
});

router.get("/:pid", (req, res) => {
  const products = readProductsFile();
  const product = products.find((p) => p.id === req.params.pid);
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const products = readProductsFile();
  const newProduct = {
    id: `${Date.now()}`,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);
  writeProductsFile(products);
  res.status(201).json(newProduct);
});

router.put("/:pid", (req, res) => {
  const products = readProductsFile();
  const index = products.findIndex((p) => p.id === req.params.pid);
  if (index === -1)
    return res.status(404).json({ error: "Producto no encontrado" });

  const updatedProduct = {
    ...products[index],
    ...req.body,
    id: products[index].id,
  };
  products[index] = updatedProduct;
  writeProductsFile(products);
  res.json(updatedProduct);
});

router.delete("/:pid", (req, res) => {
  let products = readProductsFile();
  products = products.filter((p) => p.id !== req.params.pid);
  writeProductsFile(products);
  res.send("Producto eliminado");
});

module.exports = router;
