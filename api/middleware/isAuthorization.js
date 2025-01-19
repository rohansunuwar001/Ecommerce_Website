import createUserModel from "../model/userModel.js";

export let isAuthorization = (roles) => {
    return async(req, res, next) => {
        try {
            let id = req._id;
            let result = await createUserModel.findById(id);
            let tokenRole = result.role;
            if (roles.includes(tokenRole)) {
                next();
            } else {
                res.status(403).json({
                    success: false,
                    message: "User not allowed"
                });
            }
        } catch (error) {
            res.status(403).json({
                success: false,
                message: "User not allowed"
            });
        }

    }
}