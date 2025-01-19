import { Router } from "express";
import { createUserController, forgetPassword, myProfile, resetPassword, signIn, updatePassword, updateProfile, verifyEmail } from "../controller/userController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

let createUserRoutes = Router();
createUserRoutes.route('/sign-up').post(createUserController);
createUserRoutes.route('/verifyEmail').post(verifyEmail);
createUserRoutes.route('/sign-in').post(signIn);
createUserRoutes.route('/profile').get(isAuthenticated,myProfile);
createUserRoutes.route('/update-profile').patch(isAuthenticated,updateProfile);
createUserRoutes.route('/update-password').patch(isAuthenticated,updatePassword);
createUserRoutes.route('/forget-password').post(forgetPassword);
createUserRoutes.route('reset-password').patch(isAuthenticated,resetPassword);

export default createUserRoutes;