
document.getElementById("chooseRelation").addEventListener("click", test);

document.addEventListener("DOMContentLoaded", function () {
    const lS = localStorage.getItem("loginStatus");

    if(lS == null) {
        window.location.href = 'signup.html';
    } else {
        changeAdminNavBar();
    }
});

function changeAdminNavBar() {
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

function test() {
    const aS = document.querySelector('.attributeSelection');

    // --- Get selector value
    const rS = document.getElementById('relationSelector');

    const relationSelected = rS.value;

    const relations = [
        "Review_1",
        "Review_2",
        "User_1",
        "User_2",
        "User_3",
        "Content_1",
        "Content_2",
        "Movie_1",
        "Movie_2",
        "TVShow_1",
        "TVShow_2",
        "Watchlist",
        "Language",
        "Genre",
        "Country",
        "StreamingService",
        "Episode",
        "TranslatedAs",
        "Collects",
        "CategorizedAs",
        "Has",
        "AvailableIn"
    ];

    const rIndex = relations.indexOf(relationSelected);

    alert(rIndex);
}

