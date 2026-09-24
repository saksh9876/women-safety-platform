const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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

        message: {
            type: String,
            default: "Emergency! I need help."
        },

        status: {
            type: String,
            enum: [
                "active",
                "accepted",
                "declined",
                "resolved"
            ],
            default: "active"
        },

        acceptedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Volunteer",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SOS", sosSchema);