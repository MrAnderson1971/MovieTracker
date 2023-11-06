document.getElementById("loginForm").addEventListener("submit", loginUser);

function loginUser() {
    const username = document.getElementById("loginUserName").value;
    const password = document.getElementById("loginUserPassword").value;

    // send to database and validate

    // receive result

    const valid = true

    if(valid) {
        alert("YAY")
    } else {
        alert("NAY")
    }
}


