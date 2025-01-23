import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secretKey } from "../utils/constant.js";
import { sendEmail } from "../utils/sendMail.js";
import createUserModel from "../model/userModel.js"
import { sendToken } from '../utils/jwtToken.js';
import crypto from "crypto";
import ErrorHandler from '../utils/errorhandler.js';

export let userRegister = async (req, res, next) => {
    try {
        // Getting data from frontEnd
        const { name, email, password } = req.body;



        // Checking whether email is already registered or not
        const checkExistingEmail = await createUserModel.findOne({ email });
        if (checkExistingEmail) {
            return next(new ErrorHandler("Email is already registered", 400));
        }

        let user = await createUserModel.create({
            name,
            email,
            password,
            role: "user",
            isVerification: false,
            avatar: {
                public_id: "This is a sample id",
                url: "profilepicURl"
            },
        });



        sendToken(user, 201, res);

        // For JSON WEB TOKEN

        // const token = user.getJWTToken();

        // For sending Mail 
        // await sendEmail({
        //     to: email,
        //     subject: "Account Registration",
        //     html: `<h1>Your account has been created successfully</h1>
        //            <a href="http://localhost:5173/verify-email?token=${token}">
        //            Please Check here. To Verify your email</a>`,
        // });


        // res.status(200).json({
        //     success: true,
        //     message: "User register Successfully, Please check your email for email Verification",
        //     data: user,
        //     token: token
        // })


    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export let verifyEmail = async (req, res, next) => {
    try {
        // Get token
        let tokenString = req.headers.authorization;
        // console.log(tokenString)
        let tokenArray = tokenString.split(" ");
        let token = tokenArray[1];

        let user = await jwt.verify(token, secretKey);
        // console.log(user)
        req._id = user.id;

        let result = await createUserModel.findByIdAndUpdate(req._id, {
            isVerification: true
        });

        res.status(200).json({
            success: true,
            message: "Email Verified Successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export let LoginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: !email && !password
                    ? "Please enter email and password."
                    : !email
                        ? "Please enter your email."
                        : "Please enter your password.",
            });
        }

        // Find the user by email and include the password field
        let user = await createUserModel.findOne({ email }).select("+password");

        // Check if user exists
        if (!user) {
            return next(new ErrorHandler("User not found. Please sign up to create an account.", 404));
        }

        // Check if the user's email is verified
        if (!user.isVerification) {
            return res.status(401).json({
                success: false,
                message: "Your email is not verified. Please verify your email before logging in.",
            });
        }

        // Compare the provided password with the hashed password in the database
        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        // Send token if login is successful
        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred during login.",
            error: error.message,
        });
    }
};


export let logout = async (req, res, next) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export let myProfile = async (req, res, next) => {
    try {
        ;
        let id = req.user._id;
        // console.log(id);
        let user = await createUserModel.findById(id);
        // console.log(result);
        res.status(200).json({
            success: true,
            message: 'User Profile read Successfully',
            data: user,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export let updateProfile = async (req, res, next) => {
    try {
        let id = req.user._id;
        let data = {
            name: req.body.name,
            email: req.body.email,
            isVerification: false
        };
        delete data.password;

        let user = await createUserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true, userFindAndModify: false });



        sendToken(user, 200, res);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const id = req.user._id;
        // Validate input
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please provide both old and new passwords.", 400));
        }

        // Fetch user with password field explicitly included
        const user = await createUserModel.findById(id).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Compare the provided old password with the hashed password
        const isValidPassword = await user.comparePassword(oldPassword);

        if (!isValidPassword) {
            return next(new ErrorHandler("Old password is incorrect", 401));
        }
        // Checking new and confirm password
        if (newPassword !== confirmPassword) {
            return next(new ErrorHandler("Password does not match", 400));
        }

        // Check if the new password is different from the old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return next(new ErrorHandler("New password must be different from the old password.", 400));
        }

        // Update the user's password and save changes
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
    } catch (error) {
        console.error("Error updating password:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export let forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await createUserModel.findOne({ email });

        if (!user) {
            return next(new ErrorHandler("user not found", 404));
        }

        // Generate Reset Password Token
        const resetToken = user.getResetPasswordToken();

        // Save the user document without validation
        await user.save({ validateBeforeSave: false });

        // Construct the reset password URL
        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\nIf you did not request this email, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Link",
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully.`,
            });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            res.status(500).json({
                success: false,
                message: "Failed to send the reset password email.",
                error: emailError.message,
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export let resetPassword = async (req, res, next) => {
    try {
        // Hash the token from the request
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        // Find the user with the matching token and valid expiry time
        const user = await createUserModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset Password Token is invalid or has expired.",
            });
        }

        // Check if passwords match
        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // Update the password and clear reset token fields
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
// Get all user -admin
export let getAllUser = async (req, res, next) => {
    try {
        const user = await createUserModel.find();
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Get single USer -admin
export let getSingleUser = async (req, res, next) => {
    try {
        const user = await createUserModel.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler(`User doesnot exist with id: ${req.params.id}`, 404))
        }

        res.status(200).json({
            success: true,
            message: "User found",
            user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}

// Update user role - admin

export let updateRole = async (req, res, next) => {
    try {
        let id = req.params.id;
        let data = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };

        let user = await createUserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true, userFindAndModify: false });

        if (!user) {
            return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 404))
        }
        res.status(200).json({
            success: true,
            message: "User Role updated successfully",
            user
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

// Delete User -admin
export let deleteUser = async (req, res, next) => {
    try {
        const user = await createUserModel.findByIdAndDelete(req.params.id);

        // checking whether user exist or not
        if (!user) {
            return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400))
        }

        res.status(200).json({
            success: true,
            message: "User remove successfully"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

