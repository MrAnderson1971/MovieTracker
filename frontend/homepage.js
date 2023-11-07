// window.addEventListener("unload", function () {
//     localStorage.clear();
// });

document.addEventListener("DOMContentLoaded", function () {
    const uN = localStorage.getItem("userName");
    const uP = localStorage.getItem("userPassword");

    if(uN != null && uP != null) {
        changeHomePage();
    }
});

function changeHomePage() {
    const ele = document.querySelector('.account_links');
    ele.style.display = 'none';

    const loc = document.querySelector('.aaa');
    const header = document.createElement('h1');
    header.append("Welcome " + localStorage.getItem("userName"));
    loc.append(header);
}

