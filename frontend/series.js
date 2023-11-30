document.getElementById("searchShows").addEventListener("click", searchShows);
document.getElementById("refSeries").addEventListener("click", refSeries);


document.addEventListener("DOMContentLoaded", function () {
    const lS = localStorage.getItem("loginStatus");

    if(lS == null) {
        window.location.href = 'signup.html';
    } else {
        changeSeriesNavBar();

        if(localStorage.getItem("admin") == 1) {
            addAdminLink();
        }
    }
});

async function refSeries() {
    try {
        const response = await fetch("/get-series", {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
        });
        const data = await response.json();
        if (data.success) {
            const attr = ["Content ID", "Title", "Release Date", "Age Rating", "Age Restricted", "Number of Seasons",
                "Series Type", "Genre"]
            createTable(data.result, "searchSeries", "searchSeriesCon", attr);
        } else {
            alert(data.success);
        }
    } catch (err) {
        alert("Error");
    }
}

function createTable(results, mc, sc, attr) {
    resetTable(mc, sc);

    const con = document.querySelector("." + sc)

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');

    if(!Array.isArray(attr)) {
        /// TODO: ADD SOMETHING HERE JUST IN CASE
    }

    attr.forEach(text => {
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

function resetTable(mc, sc) {
    const con = document.querySelector("." + sc);
    con.remove();

    const mC = document.querySelector("." + mc);

    const newCon = document.createElement("div");
    newCon.className = sc;

    mC.append(newCon);
}

function addAdminLink() {
    const al = document.querySelector('.nav_links');

    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "admin.html";
    link.textContent = "ADMIN";

    listItem.appendChild(link);

    al.appendChild(listItem);
}

function changeSeriesNavBar() {
    const al = document.querySelector('.account_links');

    // Remove sign/signup links
    const linkElements = al.querySelectorAll("li");
    for (let i = 0; i < linkElements.length; i++) {
        linkElements[i].style.display = "none";
    }

    // Create a new sign-out link anchor
    const signOutLink = document.createElement("a");
    signOutLink.textContent = "SIGN OUT";
    signOutLink.href = 'homepage.html';

    // Add listener to clear local storage and redirect user to refreshed homepage upon signing out
    signOutLink.addEventListener("click", function () {
        localStorage.clear();
    });

    // Add link anchor to list item
    const liSO = document.createElement("li");
    liSO.append(signOutLink);

    // Add list item to list
    al.appendChild(liSO);
}

function resetShowsResults() {
    const con = document.querySelector(".searchSeriesContainer");
    con.remove();

    const newCon = document.createElement("div");
    newCon.className = "searchSeriesContainer";

    const mainCon = document.querySelector(".searchResults");
    mainCon.append(newCon);
}

async function searchShows() {
    resetShowsResults();

    const con = document.querySelector(".searchSeriesContainer");
    const seasonNum = document.getElementById("seasonsGreater").value;

    const response = await fetch('/count-shows-by-seasons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ seasonNumber: seasonNum })
    });

    const data = await response.json();

    if (!data.success) {
        alert("Invalid input");
    } else {
        con.append(createResultsTable(data.result));
    }
}

function createResultsTable(results) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['Number of Seasons', 'Number of Shows'].forEach(text => {
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
    return table;
}
