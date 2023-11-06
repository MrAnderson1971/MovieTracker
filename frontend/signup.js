document.getElementById("newUserForm").addEventListener("submit", collectUserSignUpInfo);

function collectUserSignUpInfo() {
    const username = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const birthdate = document.getElementById("userBirthDate").value;
    const password = document.getElementById("userPassword").value;
    const passwordCheck = document.getElementById("userPasswordCheck").value;

    // Check password is not empty
    if(password.length == 0) {
        alert("Please enter a valid password")
    }

    // Check passwords match
    if (password != passwordCheck) {
        alert("Passwords dont match")
    }

    // Send data to database
}