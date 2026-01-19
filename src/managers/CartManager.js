import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (!fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Error leyendo carritos');
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: uuidv4(),
                products: []};
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return newCart;
        } catch (error) {
            throw new Error('Error creando carrito');
        }
    }

    async getCartById(cid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);
        if (!cart) throw new Error('Carrito no encontrado');
        return cart;
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cid);
        if (cartIndex === -1) throw new Error('Carrito no encontrado');
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === pid);
        if (productIndex === -1) {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        } else {
            cart.products[productIndex].quantity++;
        }
        carts[cartIndex] = cart;
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return cart;
    }
}

export const cartManager = new CartManager('./src/data/carts.json');