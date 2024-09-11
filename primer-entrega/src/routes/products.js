import { Router } from "express";
import ProductManager from "../class/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;

    const {
      docs: products,
      totalDocs,
      totalPages,
      prevPage,
      nextPage,
    } = await productManager.getProducts({
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort,
      query: query,
    });

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: prevPage > 0,
      hasNextPage: nextPage <= totalPages,
      prevLink: prevPage
        ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: nextPage
        ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const product = await productManager.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const productData = req.body;

    const newProduct = await productManager.addProduct(productData);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const productData = req.body;

    const updatedProduct = await productManager.updateProduct(
      productId,
      productData
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const deletedProduct = await productManager.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
