const navbar = document.querySelector(".navbar");
const menuButton = document.querySelector("#navbar-menu-button");
const navbarCenter = document.querySelector(".navbar__center");
/* ========================== Navbar Scroll ========================== */
 window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 0) {
      navbar.classList.add("navbar--scrolled");
    } else {
      navbar.classList.remove("navbar--scrolled");
    }
  },
);

/* ==========================
   Mobile Menu
========================== */

const mobileMenu = document.querySelector(".mobile-menu");
const mobileOverlay = document.querySelector(".mobile-menu-overlay");
const mobileClose = document.querySelector(".mobile-menu-close");

const menuToggle = document.querySelector("#navbar-menu-button");

function openMobileMenu() {
  mobileMenu.classList.add("active");
  mobileOverlay.classList.add("active");

  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  mobileOverlay.classList.remove("active");

  document.body.style.overflow = "";
}

menuToggle?.addEventListener("click", openMobileMenu);

mobileClose?.addEventListener("click", closeMobileMenu);

mobileOverlay?.addEventListener("click", closeMobileMenu);

const howItWorks = document.querySelector(".how-it-works-section");
const sticky = document.querySelector(".how-it-works-sticky");
const wrapper = document.querySelector(".steps-wrapper");
const track = document.querySelector(".steps-track");

let maxMove = 0;

/* =========================================
   Calculate real movement
========================================= */

function calculateHowItWorks() {
  if (!howItWorks || !sticky || !wrapper || !track) return;

  track.style.transform = "translate3d(0, 0, 0)";

  track.offsetHeight;

  const wrapperRect = wrapper.getBoundingClientRect();

  const lastCard = track.lastElementChild;

  if (!lastCard) return;

  const lastCardRect = lastCard.getBoundingClientRect();

  maxMove = Math.max(0, lastCardRect.bottom - wrapperRect.bottom);

  howItWorks.style.height = `${sticky.clientHeight + maxMove}px`;
}

function updateHowItWorks() {
  if (!howItWorks || !sticky || !wrapper || !track) return;

  const sectionTop = howItWorks.getBoundingClientRect().top + window.scrollY;

  const scrollInside = window.scrollY - sectionTop;

  if (maxMove <= 0) return;

  const progress = Math.min(Math.max(scrollInside / maxMove, 0), 1);

  const move = progress * maxMove;

  track.style.transform = `translate3d(0, -${move}px, 0)`;
}

/* =========================================
   Load
========================================= */

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    calculateHowItWorks();
    updateHowItWorks();
  });
});

/* =========================================
   Scroll
========================================= */

window.addEventListener("scroll", updateHowItWorks, { passive: true });

/* =========================================
   Resize
========================================= */

window.addEventListener("resize", () => {
  requestAnimationFrame(() => {
    calculateHowItWorks();
    updateHowItWorks();
  });
});
