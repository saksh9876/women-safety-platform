const express = require("express");

const router = express.Router();

const Volunteer = require("../models/Volunteer");


// ==========================================
// GET PENDING VOLUNTEERS
// ==========================================

router.get("/pending", async (req, res) => {

    try {

        const volunteers =
            await Volunteer.find({
                status: "pending"
            }).select("-password");


        res.json({
            success: true,
            volunteers
        });


    } catch (error) {

        console.error(
            "Pending Volunteers Error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Server error."
        });

    }

});


// ==========================================
// APPROVE VOLUNTEER
// ==========================================

router.put("/:id/approve", async (req, res) => {

    try {

        const volunteer =
            await Volunteer.findByIdAndUpdate(

                req.params.id,

                {
                    status: "approved"
                },

                {
                    returnDocument: "after"
                }

            ).select("-password");


        if (!volunteer) {

            return res.status(404).json({

                success: false,

                message: "Volunteer not found."

            });

        }


        res.json({

            success: true,

            message:
                "Volunteer approved successfully.",

            volunteer

        });


    } catch (error) {

        console.error(
            "Volunteer Approval Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

});


// ==========================================
// REJECT VOLUNTEER
// ==========================================

router.put("/:id/reject", async (req, res) => {

    try {

        const volunteer =
            await Volunteer.findByIdAndUpdate(

                req.params.id,

                {
                    status: "rejected"
                },

                {
                    returnDocument: "after"
                }

            ).select("-password");


        if (!volunteer) {

            return res.status(404).json({

                success: false,

                message: "Volunteer not found."

            });

        }


        res.json({

            success: true,

            message:
                "Volunteer rejected successfully.",

            volunteer

        });


    } catch (error) {

        console.error(
            "Volunteer Rejection Error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

});


module.exports = router;