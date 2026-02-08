import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'

import { productManager } from "./managers/ProductManager.js"
import { cartManager } from './managers/CartManager.js';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// ---Middlewares--- //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

// ---Handlebars--- //
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars')

// --- Vistas --- //
app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
})

// ---Sockets--- //
io.on("connection", socket => {
    console.log ('Cliente conectado');
    socket.broadcast.emit('userConnected');

    socket.on('addProduct', async data => {
        await productManager.createProducts(data);
        const products = await productManager.getProducts();
        io.emit('productsUpdated', products);
        io.emit('productAdded');
    });

    socket.on('deleteProduct', async id => {
        await productManager.deleteProduct(id);
        const products = await productManager.getProducts();
        io.emit('productsUpdated', products);
        io.emit('productDeleted');
    });
});


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


httpServer.listen(8080, () => console.log('Servidor escuchando en el puerto 8080'));