// ==========================
// REGISTER
// ==========================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value;
        const message = document.getElementById("message");

        message.innerText = "Creating account...";

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        phone
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                message.innerText =
                    "Registration successful! Redirecting...";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);

            } else {

                message.innerText =
                    data.message || "Registration failed.";
            }

        } catch (error) {

            console.error("Register Error:", error);

            message.innerText =
                "Unable to connect to server.";
        }
    });
}


// ==========================
// LOGIN
// ==========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        message.innerText = "Logging in...";

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                // Save JWT token
                localStorage.setItem("token", data.token);

                message.innerText =
                    "Login successful! Redirecting...";

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1000);

            } else {

                message.innerText =
                    data.message ||
                    "Invalid email or password.";
            }

        } catch (error) {

            console.error("Login Error:", error);

            message.innerText =
                "Unable to connect to server.";
        }
    });
}


// ==========================
// EMERGENCY CONTACTS
// ==========================

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    // Load contacts when dashboard opens
    loadContacts();

    contactForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("contactName").value;

            const phone =
                document.getElementById("contactPhone").value;

            const relationship =
                document.getElementById(
                    "contactRelationship"
                ).value;

            const contactMessage =
                document.getElementById(
                    "contactMessage"
                );

            const token =
                localStorage.getItem("token");

            if (!token) {

                contactMessage.innerText =
                    "Please login first.";

                return;
            }

            contactMessage.innerText =
                "Adding contact...";

            try {

                const response = await fetch(
                    "http://localhost:5000/api/contacts",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            name,
                            phone,
                            relationship
                        })
                    }
                );

                const data =
                    await response.json();

                if (data.success) {

                    contactMessage.innerText =
                        "Emergency contact added successfully!";

                    contactForm.reset();

                    // Refresh contact list
                    loadContacts();

                } else {

                    contactMessage.innerText =
                        data.message ||
                        "Failed to add contact.";
                }

            } catch (error) {

                console.error(
                    "Contact Error:",
                    error
                );

                contactMessage.innerText =
                    "Unable to connect to server.";
            }
        }
    );
}


// ==========================
// LOAD EMERGENCY CONTACTS
// ==========================

async function loadContacts() {

    const contactsList =
        document.getElementById("contactsList");

    const token =
        localStorage.getItem("token");

    if (!contactsList) {
        return;
    }

    if (!token) {

        contactsList.innerText =
            "Please login first.";

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/contacts",
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

        if (data.success) {

            // No contacts
            if (data.contacts.length === 0) {

                contactsList.innerText =
                    "No emergency contacts added yet.";

                return;
            }

            // Clear old list
            contactsList.innerHTML = "";

            // Display every contact
            data.contacts.forEach(contact => {

                const contactDiv =
                    document.createElement("div");

                contactDiv.innerHTML = `
                    <p>
                        <strong>${contact.name}</strong><br>
                        Phone: ${contact.phone}<br>
                        Relationship: ${contact.relationship}
                    </p>

                    <button
                        onclick="deleteContact('${contact._id}')"
                    >
                        🗑️ Delete
                    </button>

                    <hr>
                `;

                contactsList.appendChild(contactDiv);
            });

        } else {

            contactsList.innerText =
                data.message ||
                "Unable to load contacts.";
        }

    } catch (error) {

        console.error(
            "Load Contacts Error:",
            error
        );

        contactsList.innerText =
            "Unable to connect to server.";
    }
}


// ==========================
// DELETE EMERGENCY CONTACT
// ==========================

async function deleteContact(contactId) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert("Please login first.");

        return;
    }

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this emergency contact?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/contacts/${contactId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        if (data.success) {

            alert(
                "Emergency contact deleted successfully!"
            );

            // Refresh contact list
            loadContacts();

        } else {

            alert(
                data.message ||
                "Failed to delete contact."
            );
        }

    } catch (error) {

        console.error(
            "Delete Contact Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );
    }
}