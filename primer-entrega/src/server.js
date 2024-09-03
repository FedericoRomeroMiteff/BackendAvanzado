import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import { fileURLToPath } from "url";
import ProductManager from "./class/ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine(
  "handlebars",
  engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    defaultLayout: "main",
    extname: ".handlebars",
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", async (req, res) => {
  const productManager = new ProductManager();
  try {
    const products = await productManager.getProducts();
    res.render("home", { title: "Lista de Productos", products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/real-time-products", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", async (product) => {
    const productManager = new ProductManager();
    try {
      await productManager.addProduct(product);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    const productManager = new ProductManager();
    try {
      await productManager.deleteProduct(productId);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  socket.on("modifyProduct", async (modifiedProduct) => {
    const productManager = new ProductManager();
    try {
      await productManager.updateProduct(modifiedProduct.id, modifiedProduct);
      const products = await productManager.getProducts();
      io.emit("updateProducts", products);
    } catch (error) {
      console.error("Error al modificar producto:", error);
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor online en puerto http://localhost:${PORT}`);
});
