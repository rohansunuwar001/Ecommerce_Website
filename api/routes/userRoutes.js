import { Router } from "express";
import { forgetPassword, LoginUser, logout, myProfile, resetPassword, updatePassword, updateProfile, userRegister, verifyEmail, getAllUser, getSingleUser, updateRole, deleteUser } from "../controller/userController.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js"

const UserRouter = Router();
UserRouter.route("/register").post(userRegister);
UserRouter.route("/login").post(LoginUser);
UserRouter.route('/verifyEmail').post(verifyEmail);
UserRouter.route('/password/forget').post(forgetPassword);
UserRouter.route('/password/reset/:token').patch(resetPassword);
UserRouter.route('/logout').get(logout);

UserRouter.route('/profile/:id').get(isAuthenticated, myProfile);
UserRouter.route('/update-profile/:id').patch(isAuthenticated, updateProfile);
UserRouter.route('/update-password/:id').patch(isAuthenticated, updatePassword);

UserRouter.route("/admin/users").get(isAuthenticated, authorizeRoles("admin"), getAllUser);
UserRouter.route("/admin/user/:id").get(isAuthenticated,authorizeRoles("admin"), getSingleUser).put(isAuthenticated,authorizeRoles("admin"),updateRole).delete(isAuthenticated,authorizeRoles("admin"),deleteUser);

export default UserRouter;