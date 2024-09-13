import express from "express";
import CartManager from "../class/CartManager.js";

const router = express.Router();

const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    if (!updatedCart) {
      return res.status(404).json({ error: "Cart or product not found" });
    }
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: "Cart or product not found" });
    }
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartManager.deleteCart(cid);
    if (!result) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json({ status: "success", message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
