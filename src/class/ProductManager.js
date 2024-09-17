import Product from "../models/product.model.js";

class ProductManager {
  async createProduct(productData) {
    try {
      const {
        title,
        description,
        price,
        category,
        code,
        stock,
        thumbnail,
        status,
      } = productData;
      if (
        !title ||
        !description ||
        !price ||
        !category ||
        !code ||
        !stock ||
        !thumbnail ||
        !status
      ) {
        throw new Error("Todos los campos son obligatorios");
      }
      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        throw new Error("El código ya existe");
      }

      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  async getProducts({ limit = 4, page = 1, sort = {}, query = {} }) {
    try {
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        lean: true,
      };

      const filter = query.category ? { category: query.category } : {};

      return await Product.paginate(filter, options);
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }
  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });
      if (!updatedProduct) {
        throw new Error("Producto no encontrado");
      }
      return updatedProduct;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new Error("Producto no encontrado");
      }
      return deletedProduct;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  }
}

export default ProductManager;
