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

app.engine("handlebars", engine({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", async (req, res) => {
  const productManager = new ProductManager();
  try {
    const products = await productManager.getAll();

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

  socket.on("new-product", async (product) => {
    const productManager = new ProductManager();
    try {
      const products = await productManager.getAll();

      products.push(product);

      await productManager.saveProducts(products);

      io.emit("update-products", products);
    } catch (error) {
      console.error("Error al manejar el nuevo producto:", error);
    }
  });

  socket.on("delete-product", async (productId) => {
    const productManager = new ProductManager();
    try {
      const products = await productManager.getAll();

      const updatedProducts = products.filter((p) => p.id !== productId);

      await productManager.saveProducts(updatedProducts);

      io.emit("update-products", updatedProducts);
    } catch (error) {
      console.error("Error al manejar la eliminación del producto:", error);
    }
  });
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Servidor online en puerto http://localhost:${PORT}`);
});
