import ProductModel from "../Mongo/models/product.model.js";

class ProductDao {
  constructor() {
    this.model = ProductModel;
  }

  get = async () => await this.model.find({});
  getBy = async (filter) => await this.model.findOne(filter);
  create = async (newProduct) => await this.model.create(newProduct);
}

export default ProductDao;
