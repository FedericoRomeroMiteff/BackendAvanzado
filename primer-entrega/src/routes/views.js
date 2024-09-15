import express from "express";
import ProductManager from "../class/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;
    const filter = query ? { category: String(query) } : {};
    const options = {
      limit: parseInt(1, 10),
      page: parseInt(1, 10),
      sort:
        sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
    };

    const result = await productManager.getProducts({
      ...options,
      query: filter,
    });

    res.render("products", {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error fetching products: ${error.message}` });
  }
});

export default router;
