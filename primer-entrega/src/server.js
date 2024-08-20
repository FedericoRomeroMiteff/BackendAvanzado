const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const exphbs = require("express-handlebars");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let products = [];

app.get("/", (req, res) => {
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { products });
});

app.post("/products", (req, res) => {
  const { name } = req.body;
  products.push(name);
  io.emit("productList", products);
  res.redirect("/realtimeproducts");
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.emit("productList", products);

  socket.on("newProduct", (product) => {
    products.push(product);
    io.emit("productList", products);
  });

  socket.on("deleteProduct", (index) => {
    products.splice(index, 1);
    io.emit("productList", products);
  });
});

server.listen(8080, () => {
  console.log("Servidor online en puerto http://localhost:8080");
});
