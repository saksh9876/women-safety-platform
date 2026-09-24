const mongoose = require("mongoose");

const safetyZoneSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        },

        radius: {
            type: Number,
            required: true
        },

        description: {
            type: String
        },

        status: {
            type: String,
            enum: ["safe", "danger"],
            default: "safe"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SafetyZone", safetyZoneSchema);