import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class cartManager {
  constructor() {
    this.filePath = path.join(__dirname, "../dao/carts.json");
  }

  async createCart() {
    try {
      const carts = await this.getAllCarts();
      const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: [],
      };
      carts.push(newCart);
      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }

  async getAllCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo de carritos:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getAllCarts();
      return carts.find((cart) => cart.id === parseInt(id));
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find((cart) => cart.id === parseInt(cartId));
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const products = await this.getAllProducts();
      const product = products.find((p) => p.id === parseInt(productId));
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.id === parseInt(productId)
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ id: product.id, quantity });
      }

      await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const data = await fs.readFile(this.productsFilePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo de productos:", error);
      throw error;
    }
  }
}

export default cartManager;
