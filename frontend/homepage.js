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
    const loc = document.querySelector('.userWelcome');
    const welcome = document.createElement('h1');
    welcome.append(localStorage.getItem("userName"));
    loc.append(welcome);

    // // # of Movies tracked
    // const movieCount = document.createElement('h1');
    // movieCount.append('Movies Tracked: 3');
    // loc.append(movieCount);
    //
    // // # of Series tracked
    // const seriesCount = document.createElement('h1');
    // seriesCount.append('Series Tracked: 33');
    // loc.append(seriesCount);
    //
    // // # of watchlists created
    // const watchlistCount = document.createElement('h1');
    // watchlistCount.append('Watchlists Created: 66');
    // loc.append(watchlistCount);
    //
    // // # of reviews written
    // const reviewCount = document.createElement('h1');
    // reviewCount.append('Reviews Written: 55');
    // loc.append(reviewCount);
    //
    // // most viewed genre
    // const favGenre = document.createElement('h1');
    // favGenre.append('Favourite Genre: Action');
    // loc.append(favGenre);
}




