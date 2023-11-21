document.getElementById("logInButton").addEventListener("click", loginUser);

async function loginUser() {
    // Collect user login information
    const un = document.getElementById("loginUserName").value;
    const up = document.getElementById("loginUserPassword").value;

    // Check username and password with database to ensure that they are valid
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: un, password: up })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem("userId", data.userID);
            localStorage.setItem("admin", data.admin);
            localStorage.setItem("userName", un);
            localStorage.setItem("loginStatus", "true");
            window.location.href = 'homepage.html';
        } else {
            alert("Incorrect username or password");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
