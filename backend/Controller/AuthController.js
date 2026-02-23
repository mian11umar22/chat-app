const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already registered"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const userdata = await User.create({
            name,
            email,
            password: hashPassword
        });

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: userdata._id,
                name: userdata.name,
                email: userdata.email
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}
const searchUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    try {
        const users = await User.find(keyword).find({ _id: { $ne: req.user.id } }).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { Signup, Login, searchUsers };
