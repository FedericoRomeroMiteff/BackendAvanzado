import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const productsFilePath = path.join(process.cwd(), "dao", "products.json");

const readProductsFile = () => {
  try {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeProductsFile = (data) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error al escribir en el archivo de productos");
  }
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

export default router;
