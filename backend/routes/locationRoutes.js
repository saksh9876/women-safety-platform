const express = require("express");
const router = express.Router();

const Location = require("../models/Location");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// SAVE USER LOCATION
// ==========================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const { latitude, longitude } = req.body;

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required."
            });
        }

        const location = await Location.create({
            user: req.user.id,
            latitude,
            longitude
        });

        res.status(201).json({
            success: true,
            message: "Location saved successfully.",
            location
        });

    } catch (error) {

        console.error("Location Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});

module.exports = router;