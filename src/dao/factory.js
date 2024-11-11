import { configObject, connectDB } from "../config";

let ProductDao;

switch (configObject.persistence) {
  case "FILESYSTEM":
    const ProductDaoFs = require("./FileSystem/productsDaoFs.js").default;
    ProductDao = ProductDaoFs;
    break;
  case "MEMORY":
    const ProductDaoMemory = require("./Memory/productsDaoMemory.js");
    ProductDao = ProductDaoMemory;
    break;

  default:
    connectDB();
    const ProductDao = require("./Mongo/productsDao.mongo.js");
    ProductDao = ProductDao;
    break;
}

export default {
  ProductDao,
};
