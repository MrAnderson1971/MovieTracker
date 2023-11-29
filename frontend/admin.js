document.getElementById("chooseRelation").addEventListener("click", addRelationBar);

document.addEventListener("DOMContentLoaded", function () {
    const lS = localStorage.getItem("loginStatus");

    if(lS == null) {
        window.location.href = 'signup.html';
    } else {
        changeAdminNavBar();
    }
});

let tableName = "";

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

async function getTableNames() {
    try {
        const response = await fetch('/get-tables');
        const data = await response.json();
        if (data.success) {
            return data.result;
        } else {
            console.error("Failed to get table names.");
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function addRelationBar() {
    resetRSel();
    addSelectorLabel();
    addSelector();

    const rNames = await getTableNames();
    rNames.forEach(function(name, index) {
        addSelectorOption(name, index);
    });

    addSubmitButton();
}

function resetRSel() {
    const rSel = document.querySelector('.rSel');

    if (rSel) {
        rSel.remove()
    }

    const newRSEL = document.createElement("div");
    newRSEL.className = "rSel";

    const relationSelection = document.querySelector('.relationSelection');
    relationSelection.append(newRSEL)

    const gT = document.querySelector('#getTable');

    if (gT) {
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

function addSelectorOption(tableName) {
    const selectElement = document.getElementById('relationSelector');
    const optionElement = document.createElement('option');

    optionElement.value = tableName; // set the value to the table name
    optionElement.textContent = tableName; // set the text content to the table name for display

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

async function displayAttributes() {
    resetSubmitArea();
    const selectedTable = document.getElementById("relationSelector").value;
    tableName = selectedTable;

    try {
        const response = await fetch('/get-attributes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tableName: selectedTable })
        });
        const data = await response.json();

        if (data.success) {
            resetSelector();
            data.result.forEach(addCheckBoxes);
            addSend();
        } else {
            console.error("Failed to get attributes.");
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function resetSubmitArea() {
    const a = document.querySelector(".subContainer");
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

async function sendQuery() {
    let checked = document.querySelectorAll("input[type=checkbox]:checked");
    let attributeNames = [];
    checked.forEach((a) => {
        attributeNames.push(a.name);
    });
    console.log(attributeNames);

    try {
        const response = await fetch('/view-table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tableName, attributeNames })
        });
        const data = await response.json();
        if (data.success) {
            console.log(data.result);
            displaySearchResults(data.result, attributeNames);
        } else {
            alert("Something went wrong, please try again.");
        }
    } catch (error) {
        console.log(error);
        alert("Something went wrong, please try again.");
        return [];
    }
}

function displaySearchResults(results, attributeNames) {
    const container = document.getElementById('projectionResultsContainer');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('results-table');

    const headerRow = document.createElement('tr');
    attributeNames.forEach((a) => {
        const attributeHeader = document.createElement('th');
        attributeHeader.textContent = a;
        headerRow.appendChild(attributeHeader);
    });
    table.appendChild(headerRow);

    results.forEach((result) => {
        const row = document.createElement('tr');
        result.forEach((val) => {
            const cell = document.createElement('td');
            cell.textContent = val;
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    container.appendChild(table);
}
