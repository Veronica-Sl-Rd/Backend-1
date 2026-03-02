import { cartRepository } from "../repositories/cartRepository.js";

class CartController {

    create = async (req, res) => {
    try {
        const cart = await cartRepository.create();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
    };

    getAll = async (req, res) => {
    try {
        const carts = await cartRepository.getAll();
        res.json(carts);
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
    };

    getById = async (req, res) => {
    try {
        const cart = await cartRepository.getById(req.params.id);
        res.json(cart);
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
    };

    addProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartRepository.addProduct(cid, pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
    };

    deleteProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartRepository.deleteProduct(cid, pid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
    };

    updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body;
        const result = await cartRepository.updateCart(cid, products);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
    };

    updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const result = await cartRepository.updateProductQuantity(cid, pid, quantity);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
    };

    clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartRepository.clearCart(cid);
        res.send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

}

export const cartController = new CartController();