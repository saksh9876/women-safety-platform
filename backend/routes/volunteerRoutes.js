const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Volunteer = require("../models/Volunteer");
const SOS = require("../models/SOS");

const volunteerAuthMiddleware =
    require("../middleware/volunteerAuthMiddleware");

// ==========================
// VOLUNTEER REGISTRATION
// ==========================

router.post("/register", async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingVolunteer =
            await Volunteer.findOne({ email });

        if (existingVolunteer) {
            return res.status(400).json({
                success: false,
                message: "Volunteer already registered."
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const volunteer =
            await Volunteer.create({
                name,
                email,
                phone,
                password: hashedPassword
            });

        res.status(201).json({
            success: true,
            message:
                "Volunteer registration successful. Waiting for admin approval.",
            volunteer: {
                id: volunteer._id,
                name: volunteer.name,
                email: volunteer.email,
                phone: volunteer.phone,
                status: volunteer.status,
                availability: volunteer.availability
            }
        });

    } catch (error) {

        console.error(
            "Volunteer Registration Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

// ==========================
// VOLUNTEER LOGIN
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
                message: "Email and password are required."
            });
        }

        const volunteer =
            await Volunteer.findOne({ email });

        if (!volunteer) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (volunteer.status !== "approved") {
            return res.status(403).json({
                success: false,
                message:
                    "Your volunteer account is not approved yet."
            });
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                volunteer.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: volunteer._id,
                email: volunteer.email,
                role: "volunteer"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            success: true,
            message: "Volunteer login successful.",
            token: token,
            volunteer: {
                id: volunteer._id,
                name: volunteer.name,
                email: volunteer.email,
                phone: volunteer.phone,
                status: volunteer.status,
                availability: volunteer.availability
            }
        });

    } catch (error) {

        console.error(
            "Volunteer Login Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

// ==========================
// GET ALL VOLUNTEERS
// ==========================

router.get("/", async (req, res) => {
    try {

        const volunteers =
            await Volunteer.find()
                .select("-password");

        res.json({
            success: true,
            volunteers
        });

    } catch (error) {

        console.error(
            "Volunteer Fetch Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

// ==========================
// VOLUNTEER PROFILE
// ==========================

router.get(
    "/profile",
    volunteerAuthMiddleware,
    async (req, res) => {
        try {

            const volunteer =
                await Volunteer.findById(
                    req.volunteer.id
                ).select("-password");

            if (!volunteer) {
                return res.status(404).json({
                    success: false,
                    message: "Volunteer not found."
                });
            }

            res.json({
                success: true,
                volunteer
            });

        } catch (error) {

            console.error(
                "Volunteer Profile Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error."
            });
        }
    }
);

// ==========================
// UPDATE VOLUNTEER AVAILABILITY
// ==========================

router.put(
    "/availability",
    volunteerAuthMiddleware,
    async (req, res) => {
        try {

            const {
                availability
            } = req.body;

            if (
                ![
                    "available",
                    "busy",
                    "offline"
                ].includes(availability)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid availability status."
                });
            }

            const volunteer =
                await Volunteer.findByIdAndUpdate(
                    req.volunteer.id,
                    {
                        availability
                    },
                    {
                        new: true
                    }
                ).select("-password");

            if (!volunteer) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Volunteer not found."
                });
            }

            res.json({
                success: true,
                message:
                    "Availability updated successfully.",
                availability:
                    volunteer.availability
            });

        } catch (error) {

            console.error(
                "Availability Update Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error."
            });
        }
    }
);

// ==========================
// GET ACTIVE SOS ALERTS
// ==========================

router.get(
    "/alerts",
    volunteerAuthMiddleware,
    async (req, res) => {
        try {

            const volunteer =
                await Volunteer.findById(
                    req.volunteer.id
                );

            if (!volunteer) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Volunteer not found."
                });
            }

            if (volunteer.status !== "approved") {
                return res.status(403).json({
                    success: false,
                    message:
                        "Volunteer account is not approved."
                });
            }

            const alerts =
                await SOS.find({
                    status: "active"
                })
                .populate(
                    "user",
                    "name email phone"
                )
                .sort({
                    createdAt: -1
                });

            res.json({
                success: true,
                alerts
            });

        } catch (error) {

            console.error(
                "Volunteer SOS Alerts Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error."
            });
        }
    }
);

// ==========================
// ACCEPT SOS ALERT
// ==========================

router.put(
    "/alerts/:id/accept",
    volunteerAuthMiddleware,
    async (req, res) => {
        try {

            const sos =
                await SOS.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        status: "active"
                    },
                    {
                        status: "accepted",
                        acceptedBy: req.volunteer.id
                    },
                    {
                        new: true
                    }
                );

            if (!sos) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Active SOS alert not found."
                });
            }

            res.json({
                success: true,
                message:
                    "SOS alert accepted successfully.",
                sos
            });

        } catch (error) {

            console.error(
                "Accept SOS Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error."
            });
        }
    }
);

// ==========================
// DECLINE SOS ALERT
// ==========================

router.put(
    "/alerts/:id/decline",
    volunteerAuthMiddleware,
    async (req, res) => {
        try {

            const sos =
                await SOS.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        status: "active"
                    },
                    {
                        status: "declined"
                    },
                    {
                        new: true
                    }
                );

            if (!sos) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Active SOS alert not found."
                });
            }

            res.json({
                success: true,
                message:
                    "SOS alert declined successfully.",
                sos
            });

        } catch (error) {

            console.error(
                "Decline SOS Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Server error."
            });
        }
    }
);

// ==========================
// EXPORT ROUTER
// ==========================

module.exports = router;
// ==========================
// GET VOLUNTEER ASSIGNED SOS
// ==========================

router.get("/assigned-alerts", volunteerAuthMiddleware, async (req, res) => {
    try {

        const alerts = await SOS.find({
            acceptedBy: req.volunteer.id
        })
        .populate("user", "name phone")
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            alerts
        });

    } catch (error) {

        console.error(
            "Assigned SOS Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }
});