import { Router } from "express";
import { createProduct, deleteProduct, getAllProduct, getProductDetails, updateProduct } from "../controller/ProductController.js";

const productRouter = Router();
productRouter.route('/').get(getAllProduct);
productRouter.route("/new").post(createProduct);


// Dynamic 

productRouter.route('/:id').patch(updateProduct);
productRouter.route('/:id').delete(deleteProduct);
productRouter.route('/:id').get(getProductDetails);



export default productRouter;