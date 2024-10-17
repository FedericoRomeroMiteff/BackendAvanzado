import express from "express";
import appRouter from "./routes/index.js";
import { connectDB } from "./dao/connectDB.js";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.engine("handlebars", handlebars.engine());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(appRouter);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Servidor online en puerto: ${PORT}`);
});
