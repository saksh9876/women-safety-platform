const express = require("express");
const EmergencyContact = require("../models/EmergencyContact");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================
// ADD EMERGENCY CONTACT
// ==========================
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, phone, relationship } = req.body;

        if (!name || !phone || !relationship) {
            return res.status(400).json({
                success: false,
                message: "Name, phone and relationship are required"
            });
        }

        const contact = await EmergencyContact.create({
            user: req.user.id,
            name,
            phone,
            relationship
        });

        res.status(201).json({
            success: true,
            message: "Emergency contact added successfully",
            contact
        });

    } catch (error) {
        console.error("Add Contact Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ==========================
// GET MY EMERGENCY CONTACTS
// ==========================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const contacts = await EmergencyContact.find({
            user: req.user.id
        });

        res.json({
            success: true,
            contacts
        });

    } catch (error) {
        console.error("Get Contacts Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


// ==========================
// DELETE EMERGENCY CONTACT
// ==========================
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const contact = await EmergencyContact.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.json({
            success: true,
            message: "Emergency contact deleted successfully"
        });

    } catch (error) {
        console.error("Delete Contact Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;