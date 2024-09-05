import fs from "fs/promises";
import path from "path";

class ProductManager {
  constructor() {
    this.productsFilePath = path.resolve("dao/productos.json");
  }

  async ensureFileExists() {
    try {
      await fs.access(this.productsFilePath);
    } catch (error) {
      await fs.writeFile(this.productsFilePath, "[]");
    }
  }

  async getProducts() {
    await this.ensureFileExists();
    const data = await fs.readFile(this.productsFilePath, "utf-8");
    return JSON.parse(data);
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      console.log("Productos antes de agregar:", products);

      const exists = products.some((p) => p.title === product.title);
      if (exists) {
        throw new Error("El producto ya existe");
      }

      product.id = Date.now();
      products.push(product);
      console.log("Productos después de agregar:", products);

      await fs.writeFile(productFilePath, JSON.stringify(products, null, 2));
      console.log("Producto guardado exitosamente.");

      return product;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  async deleteProduct(productId) {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter((p) => p.id !== productId);
      await fs.writeFile(
        productFilePath,
        JSON.stringify(filteredProducts, null, 2)
      );
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }

  async updateProduct(productId, updatedProduct) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex === -1) {
        throw new Error("Producto no encontrado");
      }
      products[productIndex] = { ...products[productIndex], ...updatedProduct };
      await fs.writeFile(productFilePath, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error("Error al modificar el producto:", error);
    }
  }
}

export default ProductManager;
