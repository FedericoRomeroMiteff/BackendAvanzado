import Product from "../models/product.model.js";

export class ProductManager {
  async addProduct(product) {
    try {
      const existingProduct = await Product.findOne({ title: product.title });
      if (existingProduct) {
        throw new Error("El producto ya existe");
      }

      const newProduct = new Product(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw error;
    }
  }

  async getProducts(query = {}, options = {}) {
    try {
      const products = await Product.paginate(query, options);
      return products;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
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
