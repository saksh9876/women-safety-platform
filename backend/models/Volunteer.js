const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: true
        },

        location: {
            latitude: {
                type: Number
            },

            longitude: {
                type: Number
            }
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        availability: {
            type: String,
            enum: ["available", "busy", "offline"],
            default: "offline"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);