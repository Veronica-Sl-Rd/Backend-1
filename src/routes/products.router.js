import { Router } from 'express';
import { productManager } from '../managers/ProductManager.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const product = await productManager.createProducts(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.updateProduct(id, req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.deleteProduct(id);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

export default router;