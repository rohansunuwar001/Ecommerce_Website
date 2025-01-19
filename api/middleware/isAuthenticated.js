import jwt from "jsonwebtoken";
import { secretKey } from "../utils/constant.js";

export let isAuthenticated = async(req, res, next) => {
    try {
        let tokenString = req.headers.authorization;
        let tokenArray = tokenString.split(" ");
        let token = tokenArray[1];

        let user = await jwt.verify(token, secretKey);
        req._id = user.id;
        // console.log(user);
        next();
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "token is not valid"
        })
    }
}