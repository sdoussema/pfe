import express from "express";
import User from "../models/User.js"; // Ensure User.js has a default export
import bcryptjs from "bcryptjs";
import crypto from "crypto";



import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import { sendpaswordresetEmail } from "../mailtrap/emails.js";
import { sendRestSuccessEmail } from "../mailtrap/emails.js";


export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userAlreadyExists = await User.findOne({ email });
        console.log('user all ready :',userAlreadyExists);

        if (userAlreadyExists) {

            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);
        const verificationCode = generateVerificationCode();
        const newUser = new User({ name, email, password: hashedPassword , verificationToken: verificationCode , verificationTokenExpires: Date.now() + 24*60*60*1000 });  

        await newUser.save();

        //jwt 
        generateTokenAndSetCookie(res, newUser._id);
        sendVerificationEmail(newUser.email,verificationCode);
        res.status(201).json({success:true , message: "User registered successfully", user: {...newUser._doc,password:undefined} });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
export const verifyEmail = async (req, res) => {
    const { Code } = req.body;
    try {
        if (!Code) {
            return res.status(400).json({ message: "Code is required" });
        }

        const user = await User.findOne({ 
            verificationToken: Code, 
            verificationTokenExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid Code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();  

        // ✅ Await email before sending response
        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({ message: "Email verified successfully", user });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastlogin = new Date();
        await user.save();
        res.status(500).json({
            success : true , 
            message: "User logged in successfully", 
            user:{
                ...user._doc,
                password:undefined
            } });

    } catch (error) {
        res.status(500).json({
            success : false , 
            message: "Something went wrong"
    });
    }
};

export const logout = async (req, res) => {
 res.clearCookie("token");
 res.status(200).json({ message: "User logged out successfully" });
    
};

export const forgetpassword = async (req, res) => {         
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        //generate rest token 
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpires = Date.now() + 1*60*60*1000;
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();
        //send email
        sendpaswordresetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}
export const resetpassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const hashedPassword = await bcryptjs.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        await sendRestSuccessEmail(user.email);
        res.status(200).json({success:true ,
             message: "Password reset successfully" });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
        
    }



}
export const checkAuth = async (req, res) => {
try {
    
    console.log(req.userId);    
    const user = await User.findById(req.userId);
    if(!user){
        return res.status(401).json({success:false,message:"user not found"});
    }
    res.status(200).json({success:true,user:{
        ...user._doc,
        password:undefined}});
} catch (error) {
    console.error(error);
    return res.status(401).json({success:false,message:"check_auth failed"});
}
}