const bcrypt = require('bcryptjs')

const User = require("../models/User")
const generateToken = require('../utils/generateToken')


const register = async (req, res) => {
    try{
        const {name, email, password} = req.body
     if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
        }
    
    const existingUser = await User.findOne({email})

    if (existingUser){
        return res.status(400).json({
            success: false,
            message : "Email already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

} catch(error){
     res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}



const login  = async (req, res) => {
    try {

        const {email, password} = req.body

      if (!email || !password) {
        return res.status(400).json({
         success: false,
         message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate JWTtoken
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    } catch(error){
         res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}


module.exports = {
    register,
    login
}