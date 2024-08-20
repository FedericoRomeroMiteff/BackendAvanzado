import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();
const cartsFilePath = path.join(process.cwd(), "dao", "carts.json");

const readCartsFile = () => {
  try {
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeCartsFile = (data) => {
  try {
    fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error al escribir en el archivo de carritos");
  }
};

router.post("/", (req, res) => {
  const carts = readCartsFile();
  const newCart = {
    id: `${Date.now()}`,
    products: [],
  };

  carts.push(newCart);
  writeCartsFile(carts);
  res.status(201).json(newCart);
});

router.get("/:cid", (req, res) => {
  const carts = readCartsFile();
  const cart = carts.find((c) => c.id === req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

router.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const carts = readCartsFile();
  const cart = carts.find((c) => c.id === cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const productIndex = cart.products.findIndex((p) => p.product === pid);
  if (productIndex !== -1) {
    cart.products[productIndex].quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  writeCartsFile(carts);
  res.json(cart);
});

export default router;
