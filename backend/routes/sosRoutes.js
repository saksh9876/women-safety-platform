const express = require("express");
const SOS = require("../models/SOS");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================
// CREATE SOS ALERT
// ==========================
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { latitude, longitude, message } = req.body;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        const sos = await SOS.create({
            user: req.user.id,
            latitude,
            longitude,
            message: message || "Emergency! I need help."
        });

        res.status(201).json({
            success: true,
            message: "SOS alert created successfully",
            sos
        });

    } catch (error) {
        console.error("Create SOS Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ==========================
// GET MY SOS ALERTS
// ==========================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const alerts = await SOS.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            alerts
        });

    } catch (error) {
        console.error("Get SOS Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ==========================
// RESOLVE SOS ALERT
// ==========================
router.put("/:id/resolve", authMiddleware, async (req, res) => {
    try {
        const sos = await SOS.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                status: "resolved"
            },
            {
                new: true
            }
        );

        if (!sos) {
            return res.status(404).json({
                success: false,
                message: "SOS alert not found"
            });
        }

        res.json({
            success: true,
            message: "SOS alert resolved successfully",
            sos
        });

    } catch (error) {
        console.error("Resolve SOS Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


module.exports = router;