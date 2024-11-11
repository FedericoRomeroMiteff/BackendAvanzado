import ProductDaoMongo from "../dao/Mongo/productsDao.Mongo.js";
import ProductRepository from "../repositories/products.repository.js";

const productService = new ProductRepository(new ProductDaoMongo());

export default {
  productService,
};
