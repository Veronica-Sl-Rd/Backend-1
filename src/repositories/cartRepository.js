import { CartModel } from "../models/cart.model.js";

class CartRepository {

    async create() {
        return await CartModel.create({ products: [] });
    }

    async getAll() {
    return await CartModel.find().populate("products.product").lean();
    }

    async getById(id) {
        return await CartModel.findById(id).populate("products.product").lean();
    }

    async addProduct(cid, pid) {
        const cart = await CartModel.findById(cid);
        const productIndex = cart.products.findIndex(
            p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        await cart.save();
        return cart;
    }

    async deleteProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Cart not found");
    cart.products = cart.products.filter(
        p => p.product.toString() !== pid
    );
    await cart.save();
    return cart;
    }

async updateCart(cid, products) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Cart not found");
    cart.products = products;
    await cart.save();
    return cart;
    }

async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Cart not found");
    const productInCart = cart.products.find(
        p => p.product.toString() === pid
    );
    if (!productInCart) throw new Error("Product not in cart");
    productInCart.quantity = quantity;
    await cart.save();
    return cart;
    }

async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Cart not found");
    cart.products = [];
    await cart.save();
    return cart;
}

}

export const cartRepository = new CartRepository();