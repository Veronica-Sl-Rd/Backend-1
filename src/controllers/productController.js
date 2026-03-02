import { productRepository } from "../repositories/productRepository.js";

class ProductController {
    constructor(repository) {
        this.repository = repository;
    }

    getAll = async (req, res, next) => {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            let filter = {};
            let sortOption = {};
            if (query) filter.category = query;
            if (sort === "asc") sortOption.price = 1;
            if (sort === "desc") sortOption.price = -1;
            const result = await this.repository.getAll(filter, {
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sortOption,
                lean: true
            });
            res.json({
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage
                ? `/api/products?page=${result.prevPage}`
                : null,
                nextLink: result.hasNextPage
                ? `/api/products?page=${result.nextPage}`
                : null
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req, res, next) => {
        try {
            const product = await this.repository.getById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    };

    create = async (req, res, next) => {
        try {
            const newProduct = await this.repository.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const updated = await this.repository.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.json(updated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const deleted = await this.repository.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.json({ message: "Product deleted" });
        } catch (error) {
            next(error);
        }
    };
}

export const productController = new ProductController(productRepository);