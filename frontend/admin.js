
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
    resetRSel();
    addSelectorLabel();
    addSelector();

    // TODO: Get relation names [....] from database
    const rNames = ["A", "B", "C"]

    rNames.forEach(function(name, index) {
        addSelectorOption(name, index);
    });

    addSubmitButton()
}

function resetRSel() {
    const rSel = document.querySelector('.rSel');

    if(rSel) {
        rSel.remove()
    }

    const newRSEL = document.createElement("div");
    newRSEL.className = "rSel";

    const relationSelection = document.querySelector('.relationSelection');
    relationSelection.append(newRSEL)

    const gT = document.querySelector('#getTable');

    if(gT) {
        gT.remove();
    }
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

function addSelectorOption(relation, index) {
    const selectElement = document.getElementById('relationSelector');
    const optionElement = document.createElement('option');

    // TODO Change value depending on format
    optionElement.value = index;

    optionElement.textContent = relation;
    selectElement.appendChild(optionElement);
}

function addSubmitButton() {
    const button = document.createElement("button");
    button.id = 'getTable';
    button.value = 'getTable';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass';
    button.append(icon);

    button.addEventListener("click", displayAttributes);

    const sC = document.querySelector(".relationSelection");
    sC.appendChild(button);
}


function displayAttributes() {
    resetSubmitArea();
    // TODO: Get attribute names [....] from database
    const rNames = [["a1"],["b2"],["c2", "c1", "c3", "c4"]];

    const name = document.getElementById("relationSelector").value;
    const attNames = rNames[name];

    resetSelector();
    attNames.forEach(addCheckBoxes);
    addSend();
}

function resetSubmitArea() {
    const a = document.querySelector(".subContainer")
    a.remove();

    const newA = document.createElement("div");
    newA.className = "subContainer";

    const b = document.querySelector(".submitArea");
    b.append(newA);
}

function resetSelector() {
    const aS = document.querySelector(".attrContainer");
    aS.remove();

    const nCont = document.createElement('div');
    nCont.classList.add('attrContainer');

    const attSel = document.querySelector(".attributeSelection");
    attSel.appendChild(nCont);
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

function addSend() {
    const button = document.createElement("button");
    button.id = 'sendAttr';
    button.value = 'sendAttr';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-magnifying-glass';
    button.append(icon);

    button.addEventListener("click", sendQuery);

    const sC = document.querySelector(".subContainer");
    sC.appendChild(button);
}

function sendQuery() {
    alert("SEND");
}


