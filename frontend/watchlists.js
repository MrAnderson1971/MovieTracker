document.getElementById("refWatchList").addEventListener("click", refWatchList);
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

function refWatchList() {
    alert("HI");
}

function alterContentWatchlist() {
    alert("ALTER");
}