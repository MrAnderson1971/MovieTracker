document.getElementById("refWatchList").addEventListener("click", refWatchList);
document.getElementById("refContent").addEventListener("click", refContent);

document.getElementById("alterContentWatchlist").addEventListener("click", alterContentWatchlist);

document.addEventListener("DOMContentLoaded", function () {
    const lS = localStorage.getItem("loginStatus");

    if(lS == null) {
        window.location.href = 'signup.html';
    } else {
        changeWatchlistsNavBar();

        if(localStorage.getItem("admin") == 1) {
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


document.getElementById("updateWatchList").addEventListener('click', async function() {
    const id = document.getElementById('watchlistUpdateID').value;
    const name = document.getElementById('watchlistUpdateName').value;
    const userId = document.getElementById('watchlistUpdateUserID').value;

    try {
        const response = await fetch('/update-watchlist', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({watchlistID: id, name, userId})
        });
        const data = await response.json();
        if (data.success) {
            alert("Watchlist updated successfully");
        } else {
            alert("Failed to update watchlist.");
        }
    } catch (err) {
        alert("Error in form");
    }
})

document.getElementById('delWatchList').addEventListener('click', async function() {
    const watchlistID = document.getElementById('deleteWatchlist').value;

    if (watchlistID) {
        try {
            const response = await fetch('/delete-watchlist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ watchlistID: watchlistID })
            });

            const data = await response.json();

            if (data.success) {
                alert('Watchlist deleted successfully');
            } else {
                alert('Failed to delete watchlist');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert('Please enter a watchlist ID');
    }
});

document.getElementById("addWatchList").addEventListener("click", async function() {
    const name = document.getElementById("watchlistAddName").value;
    const userID = localStorage.getItem("userId");
    try {
        const response = await fetch('/create-watchlist', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({name: name, userID: userID})
        });
        const data = await response.json();
        if (data.success) {
            alert("Successfully added watchlist");
        } else {
            alert("Failed to add watchlist");
        }
    } catch (err) {
        alert("Please enter a name.");
    }
})

function changeWatchlistsNavBar() {
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

async function refWatchList() {
    const userID = localStorage.getItem("userId");
    try {
        const response = await fetch("/get-watchlists", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({userID: userID})
        });
        const data = await response.json();
        if (data.success) {
            const attr = ["Watchlist ID", "Watchlist Name", "User ID"]
            createTable(data.result, "watchlistInfo", "watchListCon", attr)
        } else {
            alert("Failed to refresh watchlist");
        }
    } catch (err) {
        alert("Error");
    }
}

async function refContent() {
    const userID = localStorage.getItem("userId");
    try {
        const response = await fetch("/get-watchlist-content", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({userID: userID})
        });
        const data = await response.json();
        if (data.success) {
            const attr = ["Watchlist ID", "Watchlist Name", "Content ID", "Title", "Release Date", "Age Rating", "Genre"]
            createTable(data.result, "contentInfo", "contentCon", attr);
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

async function alterContentWatchlist() {
    const select = document.getElementById("watchListOp").value;
    const wid = document.getElementById("alterContentWID").value;
    const cid = document.getElementById("alterContentCID").value;

    if(select == "add") {
        try {
            const response = await fetch("/add-watchlist-content", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({watchlistID: wid, contentID: cid})
            });
            const data = await response.json();
            if (data.success) {
                alert("Content has been added")
            } else {
                alert("Content has not been added");
            }
        } catch (err) {
            alert("Error add");
        }
    } else {
        try {
            const response = await fetch("/remove-watchlist-content", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({watchlistID: wid, contentID: cid})
            });
            const data = await response.json();
            if (data.success) {
                alert("Content has been removed")
            } else {
                alert("Content has not been removed");
            }
        } catch (err) {
            alert("Error remove");
        }
    }

    // alert(select);
}