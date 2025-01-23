
// creating token and saving in cookie

// import { cookieExpires } from "./constant.js";

import { cookieExpires } from "./constant.js";

export const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    // Default cookie expiration if not defined
    const expiresInDays = cookieExpires || 7;

    // Options for cookie
    const options = {
        expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict", // Prevent CSRF attacks
    };

    // Exclude sensitive fields from the user object
    const { password, ...safeUser } = user._doc;

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user: safeUser,
        token,
    });
};


