import multer, { diskStorage } from "multer";
import { dirname } from "node:path";

const storage = diskStorage({
  destination: (req, file, callback) => {
    callback(null, dirname(__dirname) + "/public/img");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({
  storage,
});

export default uploader;
