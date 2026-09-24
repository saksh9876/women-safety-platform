const express = require("express");
const router = express.Router();

const SafetyZone = require("../models/SafetyZone");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// GET ALL SAFETY ZONES
// ==========================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const zones = await SafetyZone.find();

        res.json({
            success: true,
            zones
        });

    } catch (error) {

        console.error("Safety Zone Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});


// ==========================
// ADD SAFETY ZONE
// ==========================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const {
            name,
            latitude,
            longitude,
            radius,
            description,
            status
        } = req.body;

        if (
            !name ||
            latitude === undefined ||
            longitude === undefined ||
            radius === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, latitude, longitude and radius are required."
            });
        }

        const zone = await SafetyZone.create({
            name,
            latitude,
            longitude,
            radius,
            description,
            status
        });

        res.status(201).json({
            success: true,
            message: "Safety zone added successfully.",
            zone
        });

    } catch (error) {

        console.error("Safety Zone Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});


module.exports = router;