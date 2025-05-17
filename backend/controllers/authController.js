const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken");

exports.signupUser = async (req, res) => {
  let { fullName, email, password, role } = req.body;

  try {

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    if (!role) {
      role = 'user';
    }
    
    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email,
      password: hashed,
      role
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Server error, ${error}`
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined; // Remove password from response
    user.token = token;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };

    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "User Login Success",
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure Please Try Again",
    });
  }
};

exports.logoutUser = (req, res) => {
  try {
    res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production', 
  });


    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed, please try again',
    });
  }
};