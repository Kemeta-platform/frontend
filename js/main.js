

const navbar = document.querySelector(".navbar");
const menuButton = document.querySelector("#navbar-menu-button");
const navbarCenter = document.querySelector(".navbar__center");


/* ==========================
   Navbar Scroll
========================== */

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {
        navbar.classList.add("navbar--scrolled");
    } else {
        navbar.classList.remove("navbar--scrolled");
    }

});


/* ==========================
   Mobile Menu
========================== */

if (menuButton && navbarCenter) {

    menuButton.addEventListener("click", () => {

        navbarCenter.classList.toggle("mobile-menu-open");

    });

}