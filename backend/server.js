const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());
app.use(express.json());


// ==========================
// ROUTES
// ==========================

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sosRoutes = require("./routes/sosRoutes");
const locationRoutes = require("./routes/locationRoutes");
const safetyZoneRoutes = require("./routes/safetyZoneRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const adminVolunteerRoutes = require("./routes/adminVolunteerRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/safety-zones", safetyZoneRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/admin/volunteers", adminVolunteerRoutes);


// ==========================
// MONGODB CONNECTION
// ==========================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.error(
            "MongoDB Connection Error:",
            error.message
        );
    });


// ==========================
// HOME ROUTE
// ==========================

app.get("/", (req, res) => {

    res.send(
        "Women Safety Platform Backend is Running!"
    );

});


// ==========================
// TEST API
// ==========================

app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "Women Safety API is working!"
    });

});


// ==========================
// START SERVER
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});