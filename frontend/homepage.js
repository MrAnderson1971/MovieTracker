document.addEventListener("DOMContentLoaded", function () {
    const lS = localStorage.getItem("loginStatus");

    if(lS != null) {
        changeHomeNavBar();
        changeHomePage();

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

function changeHomePage() {
    // Remove 'Get started' button
    const gs = document.querySelector('.join');
    gs.style.display = 'none';

    displayWelcomeMessage();
    displayUserStatBoards();
    displayUserLeaderBoard();
}
function displayWelcomeMessage() {
    const loc = document.querySelector('.userWelcome');
    const welcome = document.createElement('h1');
    welcome.append(localStorage.getItem("userName"));
    loc.append(welcome);
    addRefreshButton();
}

function addRefreshButton() {
    const button = document.createElement("button");
    button.id = 'refreshStats';
    button.value = 'refreshStats';

    const icon = document.createElement('i');
    icon.className = "fa-solid fa-arrows-rotate";
    button.append(icon);

    button.addEventListener("click", handleStatBoardRefresh);

    const sC = document.querySelector(".userWelcome");
    sC.appendChild(button);
}


function displayUserStatBoards() {
    createUserStatBoardContainer();
    createUserStatBoardSubContainers();
    createBigUserStatBoard();
    createSmallUserStatBoard();
}

function createUserStatBoardContainer() {
    // Create main divider to house sub-boards
    const uSB = document.createElement('div');
    uSB.className = 'userStatBoards';
    document.body.appendChild(uSB);
}

function createUserStatBoardSubContainers() {
    const userStatBoards = document.querySelector('.userStatBoards');

    // Create dividers for each type of sub-board
    const boardNames = ['userStatBoardBig', 'userStatBoardSmall'];

    const boards = boardNames.map(cardNames => {
        const divider = document.createElement('div');
        divider.className = cardNames;
        return divider;
    });

    userStatBoards.append(boards[0], boards[1]);
}

function createBigUserStatBoard() {
    createBigCards();

    // Select big cards
    const cardNames = ['.cardBig1', '.cardBig2'];
    const cards = cardNames.map(cardName => document.querySelector(cardName));

    // Populate cards
    fetch('/count-genres', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: localStorage.getItem("userId") })
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                populateCard(cards[0], 'FAVORITE GENRE', data.genre);
            } else {
                populateCard(cards[0], 'FAVORITE GENRE', "-");
            }
        })
        .catch((err) => {
            alert("Failed to get favorite genre.");
        });

    fetch('/count-watchlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: localStorage.getItem("userId") })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("error");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                populateCard(cards[1], 'WATCHLISTS CREATED', data.count);
            } else {
                alert("Failed to get watchlist count.");
            }
        });
}

function createBigCards() {
    const userStatBoardBig = document.querySelector('.userStatBoardBig');
    const cardNames = ['cardBig1', 'cardBig2'];

    // Create big cards in big sub board
    const cards = cardNames.map(cardNames => {
        const divider = document.createElement('div');
        divider.className = cardNames;
        return divider;
    });

    userStatBoardBig.append(cards[0], cards[1])
}

function createSmallUserStatBoard() {
    createSmallCards();

    const cardNames = ['.cardSmall1', '.cardSmall2', '.cardSmall3'];
    const cards = cardNames.map(cardName => document.querySelector(cardName));

    fetch('/count-movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: localStorage.getItem("userId") })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("error");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                populateCard(cards[0], 'MOVIES TRACKED', data.count);
            } else {
                alert("Failed to get movies count.");
            }
        })
    fetch('/count-series', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: localStorage.getItem("userId") })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("error");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                populateCard(cards[1], 'SERIES TRACKED', data.count);
            } else {
                alert("Failed to get series count.");
            }
        })
    fetch('/count-reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: localStorage.getItem("userId") })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("error");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                populateCard(cards[2], 'REVIEWS WRITTEN', data.count);
            } else {
                alert("Failed to get reviews count.");
            }
        })
}

function createSmallCards() {
    const userStatBoardSmall = document.querySelector('.userStatBoardSmall');
    const cardNames = ['cardSmall1', 'cardSmall2', 'cardSmall3'];

    // Create small cards in small sub board
    const cards = cardNames.map(cardNames => {
        const divider = document.createElement('div');
        divider.className = cardNames;
        return divider;
    });

    userStatBoardSmall.append(cards[0], cards[1], cards[2]);
}

function  populateCard(card, title, value) {
    const h5 = document.createElement('h5');
    h5.textContent = title;

    const h1 = document.createElement('h1');
    h1.textContent = value;

    card.append(h5, h1);
}

async function displayUserLeaderBoard(){
    const userLb = document.createElement("div");
    userLb.className = 'userLeaderboardArea';

    const results = document.createElement("div");
    results.className = 'userLeaderboardRes'

    document.body.append(userLb, results);

    const resCon = document.createElement("div");
    resCon.className = 'userLeaderboardResCon'

    results.append(resCon);

    addLeaderBoardSearch();

    const test = document.createElement("h1");
    test.textContent = "ULTIMATE REVIEWERS";

    userLb.appendChild(test);
}

function addLeaderBoardSearch() {
    const lba = document.querySelector('.userLeaderboardArea');

    const mC = document.createElement("div");
    mC.className = "leaderBoardSearch"

    const sC = document.createElement("div");
    sC.className = "searchAge"

    const h1 = document.createElement("h1");
    h1.textContent = "AGE";

    const label = document.createElement('label');
    label.setAttribute('for', 'ageInput');
    label.textContent = 'UP TO:';

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'ageInput';

    sC.append(h1, label, input);
    mC.append(sC);

    lba.appendChild(mC);

    addSearchButton();
}

function addSearchButton() {
    const lba = document.querySelector('.leaderBoardSearch');

    const button = document.createElement("button");
    button.id = 'searchLeaderBoard';
    button.value = 'searchLeaderBoard';

    const icon = document.createElement('i');
    icon.className = "fa-solid fa-magnifying-glass";
    button.append(icon);
    button.addEventListener("click", handleLeaderBoardSearch);

    lba.append(button);
}

function handleLeaderBoardSearch() {
    const enteredAge = document.getElementById("ageInput").value;

    if(enteredAge) {
        performLeaderBoardSearch(enteredAge).then();
    } else {
        alert("Error: Please enter an age");
    }
}

async function performLeaderBoardSearch(age) {
    let userList = [];
    try {
        const response = await fetch('/get-ultimate-reviewers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ age: Number(age) })
        });

        const data = await response.json();

        if (data.success) {
            userList = data.result;
            createTable(userList);
        } else {
            alert("Invalid input");
        }
    } catch (error) {
        alert.error('Error:', error);
    }
}

function handleStatBoardRefresh() {
    window.location.reload();
}

function createTable(results) {
    resetTable();

    const con = document.querySelector(".userLeaderboardResCon")

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    ['User ID', 'User name', 'Age'].forEach(text => {
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
    const con = document.querySelector(".userLeaderboardResCon");
    con.remove();

    const mC = document.querySelector(".userLeaderboardRes");

    const newCon = document.createElement("div");
    newCon.className = "userLeaderboardResCon"

    mC.append(newCon);
}
