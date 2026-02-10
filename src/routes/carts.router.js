import { Router } from 'express';
import { cartManager } from '../managers/CartManager.js';
import { productManager } from '../managers/ProductManager.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.json(cart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await productManager.getProductById(pid);
        const cart = await cartManager.addProductToCart(cid, pid);
        res.json(cart);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;