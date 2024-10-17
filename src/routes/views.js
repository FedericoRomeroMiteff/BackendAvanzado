import { Router } from "express";
import ProductManager from "../class/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    res.render("home", {
      title: "Bienvenidos a las vistas",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error fetching home products: ${error.message}` });
  }
});

router.get("/login", (req, res) => {
  res.status(200).render("login", {});
});

router.get("/register", (req, res) => {
  res.status(200).render("register", {});
});

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;
    const filter = query ? { category: String(query) } : {};
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
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

router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getProductById(id);
    res.render("productDetail", { product });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error fetching product details: ${error.message}` });
  }
});

export default router;
