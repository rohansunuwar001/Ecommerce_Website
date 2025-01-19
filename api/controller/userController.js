import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secretKey } from "../utils/constant.js";
import { sendEmail } from "../utils/sendMail.js";
import createUserModel from "../model/userModel.js"

export let createUserController = async (req, res, next) => {
    try {
        // Getting data from frontEnd
        const { username, email, password } = req.body;


        // Checking whether username is  already existed or not.
        const checkExistingUsername = await createUserModel.findOne({ username });
        if (checkExistingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            })
        }
        // Checking whether email is already registered or not
        const checkExistingEmail = await createUserModel.findOne({ email });
        if (checkExistingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered"
            })
        }


        // hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);


        const userData = {
            username,
            email,
            password: hashedPassword,
            role,
            isVerified: false
        }

        let result = createUserModel.create(userData);





        // For JSON WEB TOKEN

        const infoObj = {
            id: result._id
        };

        const expiryInfo = {
            expiresIn: '1d'
        };

        const token = jwt.sign(infoObj, secretKey, expiryInfo);

// For sending Mail 
        await sendEmail({
            to: email,
            subject: "Account Registration",
            html: `<h1>Your account has been created successfully</h1>
                   <a href="http://localhost:5173/verify-email?token=${token}">
                   Please Check here. To Verify your email</a>`,
        });


        res.status(200).json({
            success: true,
            message: "User register Successfully, Please check your email for email Verification",
            data: result,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export let verifyEmail = async (req,res,next) => {
  try {
    // Get token
    const tokenString = req.headers.Authorization;
    const token = tokenString.split(" ")[1];

    // Verify token
    let infoObj = await jwt.verify(token,secretKey);
    let userId = infoObj._id;

    let result = await createUserModel.findByIdAndUpdate(userId,{
        isVerified: true,
    });

    res.status(200).json({
        success:true,
        message:"Email Verified Successfully",
        data:result
    })
  } catch (error) {
    res.status(500).json({
        success:false,
        message:error.message
    })
  }
}


export let signIn = async (req,res,next) => {
  try {
    const {email,password} = req.body;
    // for email exist or not 
    let user = await createUserModel.findOne({email:email})
    //  for user is exists or not
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found. Please signup first to became our user."
        })
    }
    // check if user is verified or not
    if(!user.isVerified){
        return res.status(401).json({
            success:false,
            message:"Email isn't verified. Please verify your email first."
        })
    }

    let isValidPassword = await bcrypt.compare(password,user.password);

    // if password is matched or not
    if(!isValidPassword){
        return res.status(401).json({
            success:false,
            message:"Password is incorrect. Please check your password. "
        })
    }

     // For JSON WEB TOKEN (JWT needs 3 things (id,secretkey,expiryInfo))

     let infoObj = {
        id : user._id
     }
     let expiryInfo={
         expiresIn:'1d'
     }
    //  generating the token from jwt
    let token = await jwt.sign(infoObj,secretKey,expiryInfo);


    res.status(200).json({
        success:true,
        message:"User Login Successfully",
        data:user,
        token:token
    })
  } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
  }
}

export let myProfile = async (req,res,next) => {
  try {
    let id = req._id;
    let result = await createUserModel.findById(id);
    res.status(200).json({
        success:true,
        message:'User Profile read Successfully',
        data:result,
    })
  } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
  }
}

export let updateProfile = async (req,res,next) => {
  try {
    let id = req._id;
    let data= req.body;
    delete data.email;
    delete data.password;

    let result = await createUserModel.findByIdAndUpdate(id,data,{new:true});
    res.status(200).json({
        success:true,
        message:'Username Update successfully',
        data:result
    })
  } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
  }
}


export let updatePassword = async (req,res,next) => {
  try {
    let id = req._id;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let data = await createUserModel.findById(id);
    
    let hashedPassword = data.password;

    let isValidPassword = await bcrypt.compare(oldPassword,hashedPassword);

    if(isValidPassword){
        let newhashedPassword = await bcrypt.hash(newPassword,10);
        let result = await createUserModel.findByIdAndUpdate(id,{password:newhashedPassword},{new:true});

        res.status(200).json({
            success:false,
            message:"Password Updated Successfully",
            data:result
        })
    }
  } catch (error) {
    res.status(400).json({
        success: false,
        message: error.message,
    })
  }
}





export let forgetPassword = async (req,res,next) => {
  try {
    const {email} = req.body;
    const result = await createUserModel.findOne({email:email});
    if(result){
        let infoObj = {
            id:result._id
        }
        let expiryInfo={
            expiresIn:'1d'
        }
        
        const token = await jwt.sign(infoObj, secretKey, expiryInfo);

        await sendEmail({
            to: email,
            subject: "Reset your Password",
            html: `<h1>Please click this link to reset your password</h1>
    
            <a href="http://localhost:5173/reset-password?token=${token}"> 
            http://localhost:5173/reset-password?token=${token}
            </a>
            `,
        });

        res.status(200).json({
            success:true,
            message:'Password reset link has been sent to your email successfully '
        })
    }
  } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
  }
}

export let resetPassword = async (req,res,next) => {
  try {
    const {password} = req.body;
    const id = req._id;
    let hashedPassword = await bcrypt.hash(password,10);
    let result = await createUserModel.findByIdAndUpdate(id,{password:hashedPassword},{new:true});

    res.status(200).json({
        success:true,
        message:'Password reset Successfully',
        data:result
    })
  } catch (error) {
    res.status(400).json({
        success:false,
        message:error.message
    })
  }
}
