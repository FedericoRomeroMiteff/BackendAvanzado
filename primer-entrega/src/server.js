import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { engine } from "express-handlebars";
import path from "path";
import productsRouter from "./routers/products.js";
import cartsRouter from "./routers/carts.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __dirname = path.resolve();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.put("/api/products/:id", (req) => {
  req.params.id;
});

app.get("/", (res) => {
  res.render("home", { title: "Lista de Productos" });
});

app.get("/realtimeproducts", (res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", (product) => {
    io.emit("updateProducts", product);
  });

  socket.on("deleteProduct", (productId) => {
    io.emit("removeProduct", productId);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor online en puerto http://localhost:${PORT}`);
});

export { io };
