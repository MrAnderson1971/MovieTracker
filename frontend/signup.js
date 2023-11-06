document.getElementById("newUserForm").addEventListener("submit", collectUserSignUpInfo);

function collectUserSignUpInfo() {
    let valid = true

    const username = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const birthdate = document.getElementById("userBirthDate").value;
    const password = document.getElementById("userPassword").value;
    const passwordCheck = document.getElementById("userPasswordCheck").value;

    // Check simple fields
    if (username.length == 0) {
        alert("Please enter a valid username")
        valid = false
    } else if(email.length == 0) {
        alert("Please enter a valid email")
        valid = false
    } else if(birthdate.length == 0) {
        alert("Please enter a valid birth date")
        valid = false
    } else if (password.length == 0) {
        alert("Please enter a valid password")
        valid = false
    } else if (password != passwordCheck) {
        alert("Passwords dont match")
        valid = false
    }

    // Send data to database

    // Validate user details

    if (valid) {
        this.action = "login_page.html"; // Change the form's action URL
    }

}