import multer from "multer";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `${__dirname}/public/uploads`);
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({
  storage,
  onError: function (error, next) {
    console.log(error);
    next();
  },
});

export { uploader };
