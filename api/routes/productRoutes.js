import { Router } from "express";
import { createProduct, createProductReview, deleteProduct, deleteReviews, getAllProduct, getProductDetails, getproductReviews, updateProduct } from "../controller/ProductController.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

const productRouter = Router();
productRouter.route('/products').get(getAllProduct);
productRouter.route("/admin/product/new").post(isAuthenticated,authorizeRoles("admin"),createProduct);
productRouter.route("/review").put(isAuthenticated,createProductReview);
productRouter.route("/reviews").get(getproductReviews).delete(isAuthenticated,deleteReviews);


// Dynamic 

productRouter.route('/admin/product/:id').patch(isAuthenticated,authorizeRoles("admin"), updateProduct).delete(isAuthenticated,authorizeRoles("admin") ,deleteProduct);
productRouter.route("/product/:id").get(getProductDetails);




export default productRouter;