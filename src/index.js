import express from 'express';
import { productManager } from "./managers/ProductManager.js"
import { cartManager } from './managers/CartManager.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//--------------------PRODUCTOS--------------------------//

app.get('/api/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/products', async (req, res) => {
    try {
        const product = await productManager.createProducts(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.updateProduct(id, req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.deleteProduct(id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//---------------------CARRITO----------------------------------//

app.post('/api/carts', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.json(cart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.get('/api/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await productManager.getProductById(pid);
        const cart = await cartManager.addProductToCart(cid, pid);
        res.json(cart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


app.listen(8080, () => console.log('Servidor escuchando en el puerto 8080'));