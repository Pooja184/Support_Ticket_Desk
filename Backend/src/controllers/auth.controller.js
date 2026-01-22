import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { tokenGenerator } from "../utils/tokenGenerator.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //   check if user fill all fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password is to short" });
    }

    //   check if user with same email already exist in DB
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exist" });
    }

    //   hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    //   create user in DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    //   generate token to validate user
    const token = tokenGenerator(newUser._id.toString());

    //   store token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist! please register.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = tokenGenerator(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        name: user.name,
        password: user.password,
      },
    });
  } catch (error) {
     res.status(500).json({success:false,message:error.message})
  }
};

export const getCurrentUser=async(req,res)=>{
  try {
    const userId=req.userId;

    const isUserExist=await User.findById(userId);
    if(!isUserExist){
      return res.status(400).json({
        success:false,
        message:"User doesn't exist"
      })
    }

    return res.status(201).json({
      success:true,
      message:"User Profile",
      user:{
        name:isUserExist.name,
        email:isUserExist.email,
      }
    })
  } catch (error) {
      console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  
  }
}

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true, 
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

