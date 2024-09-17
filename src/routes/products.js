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

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}`
        : null,
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
    const {
      title,
      category,
      description,
      code,
      price,
      stock,
      thumbnail,
      status,
    } = req.body;

    const newProduct = await productManager.createProduct({
      title,
      category,
      description,
      code,
      price,
      stock,
      thumbnail,
      status,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      code,
      price,
      stock,
      thumbnail,
      status,
    } = req.body;
    if (
      !title ||
      !category ||
      !price ||
      !description ||
      !code ||
      !price ||
      !stock ||
      !thumbnail ||
      !status
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const existingProduct = await ProductModel.findOne({
      code,
      _id: { $ne: req.params.id },
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "El código ya está en uso por otro producto" });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ status: "success", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
