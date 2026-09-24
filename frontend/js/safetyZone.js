// ==========================
// LOAD SAFETY ZONES
// ==========================

async function loadSafetyZones() {

    const message =
        document.getElementById("safetyZoneMessage");

    const list =
        document.getElementById("safetyZonesList");

    const token =
        localStorage.getItem("token");

    if (!token) {

        message.innerText =
            "Please login first.";

        return;
    }

    message.innerText =
        "📍 Loading safety zones...";

    list.innerHTML = "";

    try {

        const response = await fetch(
            "http://localhost:5000/api/safety-zones",
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        console.log(
            "Safety Zones API:",
            data
        );

        if (!data.success) {

            message.innerText =
                data.message ||
                "Unable to load safety zones.";

            return;
        }

        if (!data.zones || data.zones.length === 0) {

            message.innerText =
                "No safety zones available.";

            list.innerHTML =
                "<p>No safety zones found.</p>";

            return;
        }

        message.innerText =
            "✅ Safety zones loaded successfully!";

        data.zones.forEach((zone) => {

            const zoneElement =
                document.createElement("div");

            zoneElement.innerHTML = `
                <hr>

                <h3>🛡️ ${zone.name}</h3>

                <p>
                    <strong>Status:</strong>
                    ${zone.status}
                </p>

                <p>
                    <strong>Latitude:</strong>
                    ${zone.latitude}
                </p>

                <p>
                    <strong>Longitude:</strong>
                    ${zone.longitude}
                </p>

                <p>
                    <strong>Radius:</strong>
                    ${zone.radius} meters
                </p>

                <p>
                    <strong>Description:</strong>
                    ${zone.description || "No description"}
                </p>

                <a
                    href="https://www.google.com/maps?q=${zone.latitude},${zone.longitude}"
                    target="_blank"
                >
                    🗺️ Open in Google Maps
                </a>
            `;

            list.appendChild(zoneElement);

        });

    } catch (error) {

        console.error(
            "Safety Zone Error:",
            error
        );

        message.innerText =
            "❌ Unable to connect to server.";

    }
}