import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        try {
            if (!fs.existsSync(this.path)) return [];
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data)
        } catch (error) {
            throw new Error("Error leyendo productos", error)
        }
    }

    async createProducts(body) {
        try {
            const products = await this.getProducts();
            const product = { id: uuidv4(), ...body };
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return product;
        }
        catch (error) {
            throw error
        }
    }


    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find((p) => p.id === id);
            if (!product) throw new Error("Producto no encontrado");
            return product
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, body) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) throw new Error("Producto no encontrado");
            products[index] = {...products[index], ...body, id: products[index].id};
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return products[index];
        } catch (error) {
            throw new Error("Error en la actualización de producto");
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index === -1) { throw new Error('Producto no encontrado'); }
            const deletedProduct = products[index];
            products.splice(index, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return deletedProduct;
        } catch (error) { throw error; }
    }
}

export const productManager = new ProductManager('./src/data/products.json')