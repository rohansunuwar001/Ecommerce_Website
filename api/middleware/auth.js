import jwt from "jsonwebtoken";
import { secretKey } from "../utils/constant.js";
import ErrorHandler from "../utils/errorhandler.js";
import createUserModel from "../model/userModel.js";

export let isAuthenticated = async (req, res, next) => {
    try {

        const { token } = req.cookies;
        // console.log(token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please Login to Access this resources"
            })
        }

        const decodedData = jwt.verify(token, secretKey);
        // console.log(decodedData);

        req.user = await createUserModel.findById(decodedData.id);
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export let authorizeRoles =(...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `${req.user.role} is not allowed to access this resources`
                })
            }
            next();
        } catch (error) {
             res.status(403).json({
                    success: false,
                    message: " is not allowed to access this resources"
                })
        }
    }

}
