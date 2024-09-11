import { Router } from "express";
import ProductManager from "../class/ProductManager.js";
import CartManager from "../class/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;

    const {
      docs: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
    } = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort,
      query: query,
    });

    res.render("products", {
      title: "Productos",
      products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage: prevPage > 0,
      hasNextPage: nextPage <= totalPages,
      prevLink: prevPage
        ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: nextPage
        ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const product = await productManager.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.render("cartDetail", { cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
