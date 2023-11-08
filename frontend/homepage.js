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

}
function displayWelcomeMessage() {
    const loc = document.querySelector('.userWelcome');
    const welcome = document.createElement('h1');
    welcome.append(localStorage.getItem("userName"));
    loc.append(welcome);
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
    // TODO:: Get values from database
    populateCard(cards[0], 'WATCHLISTS CREATED', '1');
    populateCard(cards[1], 'FAVOURITE GENRE', 'Action')
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

    // TODO:: Get values from database
    populateCard(cards[0], 'MOVIES TRACKED', '1')
    populateCard(cards[1], 'SERIES TRACKED', '1')
    populateCard(cards[2], 'REVIEWS WRITTEN', '1')
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

function populateCard(card, title, value) {
    const h5 = document.createElement('h5');
    h5.textContent = title;

    const h1 = document.createElement('h1');
    h1.textContent = value;

    card.append(h5, h1);
}





