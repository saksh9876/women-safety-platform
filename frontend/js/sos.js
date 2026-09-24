// ==========================
// SEND SOS WITH LOCATION
// ==========================

async function sendSOS() {

    const messageElement =
        document.getElementById("message");

    if (!navigator.geolocation) {

        messageElement.innerText =
            "GPS is not supported by your browser.";

        return;
    }

    messageElement.innerText =
        "📍 Getting your location...";

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            const token =
                localStorage.getItem("token");

            if (!token) {

                messageElement.innerText =
                    "Please login first.";

                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:5000/api/sos",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            latitude: latitude,
                            longitude: longitude,
                            message:
                                "Emergency! I need help."
                        })
                    }
                );

                const data =
                    await response.json();

                if (data.success) {

                    messageElement.innerText =
                        "🚨 SOS Alert Sent Successfully!";

                } else {

                    messageElement.innerText =
                        data.message ||
                        "Failed to send SOS.";
                }

            } catch (error) {

                console.error(
                    "SOS Error:",
                    error
                );

                messageElement.innerText =
                    "Unable to connect to server.";
            }
        },

        (error) => {

            console.error(
                "Location Error:",
                error
            );

            messageElement.innerText =
                "⚠️ Please allow location permission.";
        }
    );
}