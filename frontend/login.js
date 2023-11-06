document.getElementById("loginForm").addEventListener("submit", loginUser);

function loginUser() {
    const username = document.getElementById("loginUserName").value;
    const password = document.getElementById("loginUserPassword").value;

    // Send username and password to database to check that they are valid

    // Get validity results

    const valid = true

    if(valid) {
        alert("YAY")
    } else {
        alert("NAY")
    }
}


