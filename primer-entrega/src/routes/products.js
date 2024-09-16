import express from "express";
import ProductManager from "../class/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;

    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort:
        sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
      query: query ? { category: query } : {},
    };

    const result = await productManager.getProducts(options);
    res.render("products", {
      products: result.docs,
      title: "Lista de Productos",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productManager.getProductById(productId);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { product });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error al obtener el producto: ${error.message}` });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productManager.createProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await productManager.updateProduct(
      productId,
      req.body
    );

    if (!updatedProduct) {
      return res.status(404).send("Producto no encontrado");
    }

    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error al actualizar el producto: ${error.message}` });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await productManager.deleteProduct(productId);

    if (!result) {
      return res.status(404).send("Producto no encontrado");
    }

    res.json({ status: "success", message: "Producto eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error al eliminar el producto: ${error.message}` });
  }
});
export default router;
