import mongoose from "mongoose";
import Cart from "../dao/models/cart.model.js";

class CartManager {
  constructor() {
    this.cartModel = Cart;
  }

  async getAllCarts() {
    try {
      return await this.cartModel.find().exec();
    } catch (error) {
      throw new Error(`Error al obtener todos los carritos: ${error.message}`);
    }
  }

  async getCartById(cartId) {
    try {
      return await this.cartModel.findById(cartId).exec();
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con ID ${cartId}: ${error.message}`
      );
    }
  }

  async createCart() {
    try {
      const newCart = new this.cartModel();
      return await newCart.save();
    } catch (error) {
      throw new Error(`Error al crear un nuevo carrito: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productInCart = cart.products.find(
        (p) => p.product.toString() === productId.toString()
      );
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async updateCart(cartId, updateData) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) return null;

      for (let item of updateData.items) {
        const productExists = await ProductModel.findById(item.productId);
        if (!productExists) {
          throw new Error(`Producto con ID ${item.productId} no existe`);
        }
      }
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productInCart = cart.products.find(
        (p) => p.product.toString() === productId.toString()
      );
      if (productInCart) {
        productInCart.quantity = quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        `Error al actualizar la cantidad del producto en el carrito: ${error.message}`
      );
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.cartModel.findById(cartId);
      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado`);
      }
      cart.products = cart.products.filter(
        (p) => p.product.toString() !== productId.toString()
      );
      return await cart.save();
    } catch (error) {
      throw new Error(
        `Error al eliminar el producto del carrito: ${error.message}`
      );
    }
  }

  async deleteCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error(`Carrito con ID ${cartId} no encontrado`);
      }

      await CartModel.deleteOne({ _id: cartId });
      return { message: `Carrito con ID ${cartId} eliminado correctamente` };
    } catch (error) {
      throw new Error("Error al eliminar el carrito: " + error.message);
    }
  }
}

export default CartManager;
