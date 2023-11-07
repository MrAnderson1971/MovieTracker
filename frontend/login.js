document.getElementById("logInButton").addEventListener("click", loginUser);

let userName = null
let userPassword = null
let loginStatus = null

function loginUser() {
    // Clear any prior login information stored
    localStorage.clear();

    // Collect user login information
    const un = document.getElementById("loginUserName").value;
    const up = document.getElementById("loginUserPassword").value;

    // Check username and password with database to ensure that they are valid

    const valid = true

    if(valid) {
        userName = un;
        userPassword = up;
        localStorage.setItem("userName", userName);
        localStorage.setItem("userPassword", userPassword);
        window.location.href = 'homepage.html'
    } else {
        alert("NAY")
    }
}
