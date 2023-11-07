document.addEventListener("DOMContentLoaded", function () {
    const lS = localStorage.getItem("loginStatus");

    if(lS != null) {
        changeHomeNavBar();
        changeHomePage();
    }
});

function changeHomeNavBar() {
    const al = document.querySelector('.account_links');

    // Remove sign/signup links
    const linkElements = al.querySelectorAll("li");
    for (let i = 0; i < linkElements.length; i++) {
        linkElements[i].style.display = "none";
    }

    // Create a new sign-out link anchor
    const signOutLink = document.createElement("a");
    signOutLink.textContent = "SIGN OUT";

    // Add listener to clear local storage and redirect user to refreshed homepage upon signing out
    signOutLink.addEventListener("click", function () {
        localStorage.clear();
        window.location.href = 'homepage.html';
    });

    // Add link anchor to list item
    const liSO = document.createElement("li");
    liSO.append(signOutLink);

    // Add list item to list
    al.appendChild(liSO);
}

function changeHomePage() {
    // Remove 'Get started' button
    const gs = document.querySelector('.join');
    gs.style.display = 'none';

    // Add custom welcome message
    const loc = document.querySelector('.userDashboard');
    const header = document.createElement('h1');
    header.append("welcome, " + localStorage.getItem("userName"));
    loc.append(header);
}




