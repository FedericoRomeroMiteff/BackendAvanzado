import express from "express";
import appRouter from "./routes/index.js";
import authRoutes from "./routes/authRoutes.js";
import productRouter from "./routes/products.js";
import UserRouter from "./routes/userClass.js";
import pruebaRouter from "./routes/pruebas.js";
import viewsRouter from "./routes/views.js";
import sessionsRouter from "./routes/sessions.js";
import logger from "morgan";
import { connectDB } from "./dao/connectDB.js";
import passport from "passport";
import dotenv from "dotenv";
import initializePassport from "./config/passport.config.js";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));
app.use(cors());

initializePassport();
app.use(passport.initialize()); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

connectDB();


app.use(appRouter);
app.use("/auth", authRoutes);
app.use("/", viewsRouter);
app.use("/pruebas", pruebaRouter);


app.use("/api/products", passport.authenticate('jwt', { session: false }), productRouter);
const userRouter = new UserRouter();
app.use("/api/users", passport.authenticate('jwt', { session: false }), userRouter.getRouter());
app.use("/api/sessions", sessionsRouter);

app.use((error, req, res, next) => {
  console.log(error.stack);
  res.status(500).send("error de server");
});

const httpServer = http.createServer(app);
const io = new Server(httpServer);

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

httpServer.listen(PORT, () => {
  console.log(`Servidor online en puerto: ${PORT}`);
});
