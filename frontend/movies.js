document.getElementById("searchGenre").addEventListener("click", searchGenreCount);
document.getElementById("searchMovies").addEventListener("click", searchMovies);

document.addEventListener("DOMContentLoaded", function () {
    const lS = localStorage.getItem("loginStatus");

    if(lS == null) {
        window.location.href = 'signup.html';
    } else {
        changeMoviesNavBar();

        if (localStorage.getItem("admin") === "1") {
            addAdminLink();
        }
    }
});

function addAdminLink() {
    const al = document.querySelector('.nav_links');

    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "admin.html";
    link.textContent = "ADMIN";

    listItem.appendChild(link);

    al.appendChild(listItem);
}


function changeMoviesNavBar() {
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

async function searchGenreCount() {
    const releaseDate = document.getElementById("dateGreater").value;

    const results = await fetch("/get-genre-count-average-runtime", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ releaseDate })
    });

    const data = await results.json();

    if (data.success) {
        createTable(data.result)
    } else {
        alert("Please enter a valid release date");
    }
}

function createTable(results) {
    resetTable();

    const con = document.querySelector(".genreCountsResultsCon")

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Genre', 'Count'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    results.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    con.append(table);
}

function resetTable() {
    const con = document.querySelector(".genreCountsResultsCon");
    con.remove();

    const mC = document.querySelector(".genreCountsResults");

    const newCon = document.createElement("div");
    newCon.className = "genreCountsResultsCon"

    mC.append(newCon);
}


async function searchMovies() {
    const title = document.getElementById("movieTitle").value;
    let contentID = document.getElementById("movieID").value;
    const ageRating = document.getElementById("movieAgeRating").value;
    let ageRestricted = document.getElementById("movieAgeRes").value;
    let releaseDate = document.getElementById("movieReleaseDate").value;
    const lengthType = document.getElementById("movieLengthType").value;
    let duration = document.getElementById("movieDuration").value;
    let and = 0;
    if (document.getElementById("movieSelectionType").value === "and") {
        and = 1;
    }

    const results = await fetch("/search-movies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ contentID, duration, lengthType, ageRating, title, releaseDate, ageRestricted, and })
    });

    const data = await results.json();

    if (data.success) {

        // Display results
    } else  if (results.status === 400){
        alert("Invalid input");
    } else {
        alert("Something went wrong. Try again.");
    }
}

