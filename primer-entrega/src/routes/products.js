import express from "express";
import ProductManager from "../class/ProductManager.js";

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;

    const limitValue = parseInt(limit, 10) || 10;
    const pageValue = parseInt(page, 10) || 1;
    const sortValue = sort === "asc" || sort === "desc" ? sort : "";
    const queryValue = typeof query === "string" ? query : "";

    const options = {
      limit: limitValue,
      page: pageValue,
      sort: sortValue ? { price: sortValue === "asc" ? 1 : -1 } : {},
      query: queryValue,
    };

    const result = await productManager.getProducts(options);

    res.render("home", {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.prevPage > 0,
      hasNextPage: result.nextPage <= result.totalPages,
      prevLink: result.prevPage
        ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: result.nextPage
        ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}`
        : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
