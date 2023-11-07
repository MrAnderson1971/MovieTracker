document.getElementById("logInButton").addEventListener("click", loginUser);

function loginUser() {
    // Collect user login information
    const un = document.getElementById("loginUserName").value;
    const up = document.getElementById("loginUserPassword").value;

    // Check username and password with database to ensure that they are valid
    // Dummy test
    let loginStatus = (un == "user1"  && up == "password1");

    if(loginStatus) {
        localStorage.setItem("userName", un);
        localStorage.setItem("userPassword", up);
        localStorage.setItem("loginStatus", "true");

        window.location.href = 'homepage.html'
    } else {
        alert("Incorrect username or password")
    }
}
