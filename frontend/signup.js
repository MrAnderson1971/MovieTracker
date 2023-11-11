document.getElementById("newUserForm").addEventListener("submit", collectUserSignUpInfo);

function collectUserSignUpInfo(event) {
    console.log("SIGNUP");
    let valid = true
    event.preventDefault(); // prevent default submission

    const username = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const birthdate = document.getElementById("userBirthDate").value;
    const password = document.getElementById("userPassword").value;
    const passwordCheck = document.getElementById("userPasswordCheck").value;
    console.log(birthdate);

    // Check simple fields
    if (username.length === 0) {
        alert("Please enter a valid username")
        valid = false
    } else if(email.length === 0) {
        alert("Please enter a valid email")
        valid = false
    } else if(birthdate.length === 0) {
        alert("Please enter a valid birth date")
        valid = false
    } else if (password.length === 0) {
        alert("Please enter a valid password")
        valid = false
    } else if (password !== passwordCheck) {
        alert("Passwords dont match")
        valid = false
    }

    if (valid) {
        const userData = {
            username: username,
            email: email,
            password: password,
            birthDate: birthdate
        };

        fetch('/insert-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "login_page.html";
                } else {
                    alert("There was a problem signing up.");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}
