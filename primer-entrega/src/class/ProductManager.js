import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, "../dao/productos.json");
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo de productos:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find((product) => product.id === parseInt(id));
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      throw error;
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const existingProduct = products.find((p) => p.title === product.title);
      if (existingProduct) {
        throw new Error("El producto ya existe");
      }

      product.id = products.length + 1;
      products.push(product);
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return product;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id === parseInt(id));
      if (index === -1) {
        throw new Error("Producto no encontrado");
      }

      products[index] = { ...products[index], ...updatedProduct };
      await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.filter((p) => p.id !== parseInt(id));
      if (products.length === updatedProducts.length) {
        throw new Error("Producto no encontrado");
      }

      await fs.writeFile(
        this.filePath,
        JSON.stringify(updatedProducts, null, 2)
      );
      return { message: "Producto eliminado" };
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }
}

export default ProductManager;
