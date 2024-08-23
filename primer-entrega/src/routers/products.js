import { Router } from "express";
import fs from "fs";
import path from "path";
import { io } from "../server.js";

const router = Router();
const productsFilePath = path.join(process.cwd(), "dao", "productos.json");

const readProductsFile = () => {
  try {
    const data = fs.readFileSync(productsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo de productos:", error);
    return [];
  }
};

const writeProductsFile = (products) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error al escribir en el archivo de productos:", error);
  }
};

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

  io.emit("updateProducts", newProduct);
  res.status(201).json(newProduct);
});

router.delete("/:pid", (req, res) => {
  let products = readProductsFile();
  const product = products.find((p) => p.id === req.params.pid);
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });

  products = products.filter((p) => p.id !== req.params.pid);
  writeProductsFile(products);

  io.emit("removeProduct", req.params.pid);
  res.send("Producto eliminado");
});

export default router;
