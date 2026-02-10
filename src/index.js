import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { productManager } from "./managers/ProductManager.js"


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

// ---Routers--- //
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


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



httpServer.listen(8080, () => console.log('Servidor escuchando en el puerto 8080'));