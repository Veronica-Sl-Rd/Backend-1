import { ProductModel } from "../models/product.model.js";

class ProductRepository {
    constructor(model) {
        this.model = model;
    }

    getAll = async (filter, options) => {
        return await this.model.paginate(filter, options);
    };

    getById = async (id) => {
        return await this.model.findById(id).lean();
    };

    create = async (data) => {
        return await this.model.create(data);
    };

    update = async (id, data) => {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    };

    delete = async (id) => {
        return await this.model.findByIdAndDelete(id);
    };
}

export const productRepository = new ProductRepository(ProductModel);