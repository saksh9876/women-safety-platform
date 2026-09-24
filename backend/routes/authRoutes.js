const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================
// REGISTER USER
// ==========================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;

        if (!name || !email || !password || !phone) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await User.create({
                name,
                email,
                password: hashedPassword,
                phone
            });

        res.status(201).json({

            success: true,

            message:
                "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// ==========================
// LOGIN USER
// ==========================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ==========================
        // CREATE JWT TOKEN
        // ==========================

        const token =
            jwt.sign(

                {
                    id: user._id,
                    role: user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }

            );


        res.json({

            success: true,

            message:
                "Login successful",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error"

        });

    }

});


// ==========================
// GET USER PROFILE
// ==========================

router.get(
    "/profile",
    authMiddleware,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.user.id
                ).select("-password");

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found"

                });

            }

            res.json({

                success: true,

                user: {

                    id: user._id,

                    name: user.name,

                    email: user.email,

                    phone: user.phone,

                    role: user.role

                }

            });

        } catch (error) {

            console.error(
                "Profile Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Server error"

            });

        }

    }
);


// ==========================
// EXPORT ROUTER
// ==========================

module.exports = router;