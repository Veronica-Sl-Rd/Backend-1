import { Router } from "express";
import { cartController } from "../controllers/cartController.js";

const router = Router();

router.post("/", cartController.create);
router.get("/", cartController.getAll);
router.get("/:id", cartController.getById);
router.post("/:cid/products/:pid", cartController.addProduct);
router.delete("/:cid/products/:pid", cartController.deleteProduct);
router.put("/:cid", cartController.updateCart);
router.put("/:cid/products/:pid", cartController.updateProductQuantity);
router.delete("/:cid", cartController.clearCart);

export default router;