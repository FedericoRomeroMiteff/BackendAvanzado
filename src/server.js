import express from "express";
//import userRouter from "./routes/users.js"
import appRouter from "./routes/index.js";
import authRoutes from "./routes/authRoutes.js";
import productRouter from "./routes/products.js";
import UserRouter from "./routes/userClass.js";
import pruebaRouter from "./routes/pruebas.js";
import viewsRouter from "./routes/views.js";
import sessionsRouter from "./routes/sessions.js";
import logger from "morgan";
import uploader from "./utils/multer.js";
import { connectDB } from "./dao/connectDB.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const PORT = 8080;

connectDB();
initializePassport();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(appRouter);
app.use("/auth", authRoutes);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Servidor online en puerto: ${PORT}`);
});

const { Server } = require("socket.io");

const httpServer = app.listen(PORT, () => {
  console.log("escuchando en el puerto: ", PORT);
});

const io = new Server(httpServer);

const ioMiddleware = (io) => (req, res, next) => {
  req.io = io;
  next();
};

app.use(ioMiddleware(io));

console.log(__dirname + "/public");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(logger("dev"));
app.use(cors());
app.use(cookieParser("palabrasecreta"));

initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

connectDB();

const userRouter = new UserRouter();
app.use("/", viewsRouter);
app.use("/pruebas", pruebaRouter);
// app.use('/api/users', userRouter)
app.use("/api/users", userRouter.getRouter());
app.use("/api/products", productRouter);
app.use("/api/sessions", sessionsRouter);

app.use((error, req, res, next) => {
  console.log(error.stack);
  res.status(500).send("error de server");
});

// chatSocket(io)

const productsSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("nuevo cliente conectado");

    const { getProducts, createProduct } = new ProductsManagerFs();
    const products = await getProducts();
    socket.emit("productsList", products);

    socket.on("addProduct", async (data) => {
      await createProduct(data);
    });
  });
};

productsSocket(io);
