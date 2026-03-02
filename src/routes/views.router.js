import { Router } from 'express';
import { productRepository } from "../repositories/productRepository.js";
import { cartRepository } from '../repositories/cartRepository.js';

const router = Router();

router.get('/', async (req, res) => {
    res.redirect('/products');
});

router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    let filter = {};
    let sortOption = {};
    if (query) filter.category = query;
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;
    const result = await productRepository.getAll(filter, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOption,
        lean: true
    });
    res.render("home", {
        payload: result.docs,
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
            ? `/products?page=${result.prevPage}`
            : null,
        nextLink: result.hasNextPage
            ? `/products?page=${result.nextPage}`
            : null
    });
});

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productRepository.getById(pid);
    if (!product) {
        return res.status(404).send("Producto no encontrado");
    }
    res.render('productDetail', { product });
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartRepository.getById(cid);
    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }
    res.render('cartDetail', { cart });
});

router.get('/realtimeproducts', async (req, res) => {
    const result = await productRepository.getAll({}, {
        limit: 100,
        page: 1,
        lean: true
    });
    res.render("realTimeProducts", { products: result.docs });
});

export default router;