document.addEventListener("DOMContentLoaded", function () {
    const lS = localStorage.getItem("loginStatus");

    if(lS == null) {
        window.location.href = 'signup.html';
    } else {
        loadDefaultPage();
    }
});

function loadDefaultPage() {
    changeServicesNavBar();
    addServicesBar();

}

function changeServicesNavBar() {
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

function addServicesBar() {
    const sInfo = document.querySelector('.servicesInfo');

    // ----------- Add services header -----------
    const services = document.createElement('h1');
    services.textContent = "SERVICES"
    sInfo.append(services);

    // ----------- Add service count container -----------
    const serviceCountDiv = document.createElement('div');
    serviceCountDiv.className = "serviceCount";
    sInfo.append(serviceCountDiv);


    // ----------- Add s count sub container -----------
    const sCountDiv = document.createElement('div');
    sCountDiv.className = "sCount";

    const n = document.createElement('h1');

    // TODO: Request service count from server
    n.textContent = "100";

    const s = document.createElement('h6');
    s.textContent = "SERVICES";

    sCountDiv.append(n, s);
    serviceCountDiv.append(sCountDiv);

    // // ----------- Add refresh button -----------
    // const refreshButton = document.createElement("button");
    // refreshButton.setAttribute("id", "refreshServicesCount");
    //
    // const iconElement = document.createElement("i");
    // iconElement.classList.add("fa-solid", "fa-arrows-rotate");
    //
    // refreshButton.appendChild(iconElement);
    // refreshButton.addEventListener("click", refreshServicesCount);
}

// function refreshServicesCount() {
//     const count = 100;
//
//     // Get count divider
//     const cElement = document.querySelector('.sCount');
//
//     // Get numeric header
//     const h1 = cElement.querySelector('h1');
//
//     const num = parseInt(h1.textContent, 10);
//     const newN = num + 1;
//
//     h1.textContent = newN;
// }

