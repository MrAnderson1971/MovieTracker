
document.getElementById("chooseRelation").addEventListener("click", addRelationBar);

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

function addRelationBar() {
    // const attributes = [
//     //     ["score", "category"],
//     //     ["reviewID", "score", "reviewText", "userID", "contentID"],
//     //     ["age", "ageLock"],
//     //     ["userID", "birthdate", "email", "userPassword", "username", "admin"],
//     //     ["birthdate", "age"],
//     //     ["ageRating", "ageRestricted"],
//     //     ["contentID", "ageRating", "title", "releaseDate"],
//     //     ["duration", "lengthType"],
//     //     ["contentID", "duration"],
//     //     ["contentID", "numSeasons"],
//     //     ["numSeasons", "seriesType"],
//     //     ["watchlistID", "name", "userID"],
//     //     ["languageName"],
//     //     ["genreName"],
//     //     ["countryName"],
//     //     ["streamingServiceName"],
//     //     ["contentID", "season", "episode", "duration", "title"],
//     //     ["languageName", "contentID", "audio", "subtitles"],
//     //     ["watchlistID", "contentID"],
//     //     ["genreName", "contentID"],
//     //     ["streamingServiceName", "contentID"],
//     //     ["countryName", "streamingServiceName"]
//     // ];

    resetRSel();
    addSelectorLabel();
    addSelector();

    // TODO: Get relation names [....]
    const rNames = ["A", "B", "C"]
    rNames.forEach(addSelectorOption)
}

function resetRSel() {
    const rSel = document.querySelector('.rSel');
    rSel.remove();

    const newRSEL = document.createElement("div");
    newRSEL.className = "rSel";

    const relationSelection = document.querySelector('.relationSelection');
    relationSelection.append(newRSEL)
}

function addSelectorLabel() {
    const labelSel = document.createElement('label');
    labelSel.setAttribute('for', 'relationSelector');
    labelSel.textContent = 'RELATION:';

    const rSel = document.querySelector(".rSel");
    rSel.append(labelSel);
}

function addSelector() {
    const selector = document.createElement('select');
    selector.id = 'relationSelector';

    const rSel = document.querySelector(".rSel");
    rSel.append(selector);
}

function addSelectorOption(relation) {
    const selectElement = document.getElementById('relationSelector');
    const optionElement = document.createElement('option');

    // TODO Change value depending on format
    optionElement.value = relation;

    optionElement.textContent = relation;
    selectElement.appendChild(optionElement);
}

function displayAttributeSelector(attArray) {
    if(!Array.isArray(attArray)) {
        alert("ERROR");
    }

    resetSelector();
    resetSubmit();
    attArray.forEach(addCheckBoxes);
}

function resetSelector() {
    const aS = document.querySelector(".attrContainer");
    aS.remove();

    const nCont = document.createElement('div');
    nCont.classList.add('attrContainer');

    const attSel = document.querySelector(".attributeSelection");
    attSel.appendChild(nCont);
}

function resetSubmit() {
    const sC = document.querySelector(".subContainer");
    sC.remove();

    const newSC = document.createElement('div');
    newSC.classList.add('subContainer');

    const sA = document.querySelector(".submitArea");
    sA.appendChild(newSC);
}

function addCheckBoxes(attr) {
    const aC = document.querySelector(".attrContainer");

    const div = document.createElement('div');
    aC.appendChild(div);

    const attBox = document.createElement('input');
    attBox.type = 'checkbox';
    attBox.id = attr;
    attBox.name = attr;
    attBox.value = attr;

    div.appendChild(attBox);

    const attLabel = document.createElement('label');
    attLabel.setAttribute('for', attr);
    attLabel.textContent = attr;

    div.appendChild(attLabel);
}

function addSubmitButton() {
    const button = document.createElement("button");
    button.id = 'getTable';
    button.value = 'getTable';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass';
    button.append(icon);

    const sC = document.querySelector(".subContainer");
    sC.appendChild(button);
}



