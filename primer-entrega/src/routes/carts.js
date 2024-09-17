import express from "express";
import CartManager from "../class/CartManager.js";

const router = express.Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.render("carts", { carts });
  } catch (error) {
    res.status(500).json({ error: `Error fetching carts: ${error.message}` });
  }
});

router.get("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cartId/products/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const updatedCart = await cartManager.addProductToCart(cartId, productId);
    res.status(200).json(updatedCart);
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

router.delete("/:cartId/products/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  try {
    const updatedCart = await cartManager.removeProductFromCart(
      cartId,
      productId
    );
    if (!updatedCart) {
      return res.status(404).json({ error: "Cart or product not found" });
    }
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    const result = await cartManager.deleteCart(cartId);
    if (!result) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json({ status: "success", message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cartId/products/:productId", async (req, res) => {
  const { cartId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartManager.updateProductQuantityInCart(
      cartId,
      productId,
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error al actualizar el carrito: ${error.message}` });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;
    const updatedCart = await cartManager.updateCart(cartId, req.body);
    if (!updatedCart) {
      return res.status(404).send("Carrito no encontrado");
    }
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
