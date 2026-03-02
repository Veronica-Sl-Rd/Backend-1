import express from 'express';
import http from 'http';
import { Server } from 'socket.io'
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { productRepository } from "./repositories/productRepository.js";
import { initMongoDB } from "./config/db-connection.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

initMongoDB()
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.log(err));

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
app.use('/api/carts', cartsRouter);//


// ---Sockets--- //
io.on("connection", (socket) => {
    console.log("Cliente conectado");
    socket.broadcast.emit("userConnected");
    socket.on("addProduct", async (data) => {
        try {
            await productRepository.create({
                title: data.title,
                price: Number(data.price)
            });
            const result = await productRepository.getAll({}, {
                limit: 100,
                page: 1,
                lean: true
            });
            io.emit("productsUpdated", result.docs);
            io.emit("productAdded");
        } catch (error) {
            console.error(error);
        }
    });

    socket.on("deleteProduct", async (id) => {
        try {
            await productRepository.delete(id);
            const result = await productRepository.getAll({}, {
                limit: 100,
                page: 1,
                lean: true
            });
            io.emit("productsUpdated", result.docs);
            io.emit("productDeleted");
        } catch (error) {
            console.error(error);
        }
    });
});


httpServer.listen(8080, () => console.log('Servidor escuchando en el puerto 8080'));