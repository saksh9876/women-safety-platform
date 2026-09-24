async function shareLocation() {

    const message = document.getElementById("locationMessage");
    const details = document.getElementById("locationDetails");
    const token = localStorage.getItem("token");

    if (!token) {
        message.innerText = "Please login first.";
        return;
    }

    if (!navigator.geolocation) {
        message.innerText = "❌ GPS is not supported by your browser.";
        return;
    }

    message.innerText = "📍 Getting your location...";
    details.innerHTML = "";

    navigator.geolocation.getCurrentPosition(

        async function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            try {

                const response = await fetch(
                    "http://localhost:5000/api/location",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            latitude: latitude,
                            longitude: longitude
                        })
                    }
                );

                const data = await response.json();

                console.log("Location API:", data);

                if (data.success) {

                    message.innerText =
                        "✅ Location saved successfully!";

                    details.innerHTML = `
                        <p>
                            <strong>Latitude:</strong>
                            ${latitude}
                        </p>

                        <p>
                            <strong>Longitude:</strong>
                            ${longitude}
                        </p>

                        <a
                            href="https://www.google.com/maps?q=${latitude},${longitude}"
                            target="_blank"
                        >
                            🗺️ Open Location in Google Maps
                        </a>
                    `;

                } else {

                    message.innerText =
                        data.message || "❌ Failed to save location.";
                }

            } catch (error) {

                console.error("Location API Error:", error);

                message.innerText =
                    "❌ Unable to connect to server.";
            }
        },

        function (error) {

            console.error("Location Error:", error);

            if (error.code === 1) {
                message.innerText =
                    "⚠️ Location permission denied.";
            } else if (error.code === 2) {
                message.innerText =
                    "⚠️ Location unavailable.";
            } else if (error.code === 3) {
                message.innerText =
                    "⚠️ Location request timed out.";
            } else {
                message.innerText =
                    "⚠️ Unable to get your location.";
            }
        }
    );
}