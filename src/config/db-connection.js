import { connect } from "mongoose";

export const initMongoDB = async () => {
    try {
        await connect(process.env.MONGO_URL);
        console.log("Mongo conectado");
    } catch (error) {
        throw new Error(error);
    }
};