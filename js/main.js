// Splash Screen
(function () {
  var DRAW_DURATION = 1800;
  var FILL_DURATION = 500;
  var MOVE_EMETA_DURATION = 900;
  var HOLD_AFTER = 800;

  var kMarkGroup = document.getElementById("kMarkGroup");
  var kmark = document.getElementById("kmark");
  var kfill = document.getElementById("kfill");
  var emetaGroup = document.getElementById("emetaGroup");
  var splash = document.getElementById("splash");

  function onFinish() {
    splash.style.transition = "opacity 0.5s ease";
    splash.style.opacity = "0";

    setTimeout(function () {
      splash.style.display = "none";
      document.body.classList.remove("is-loading");
    }, 500);
  }

  function runSplashAnimation() {
    var length = kmark.getTotalLength();
    kmark.style.strokeDasharray = length;
    kmark.style.strokeDashoffset = length;

    kmark.getBoundingClientRect();

    kmark.style.transition =
      "stroke-dashoffset " + DRAW_DURATION + "ms cubic-bezier(.65,0,.35,1)";
    requestAnimationFrame(function () {
      kmark.style.strokeDashoffset = "0";
    });

    setTimeout(function () {
      kmark.style.transition = "opacity " + FILL_DURATION + "ms ease";
      kfill.style.transition = "opacity " + FILL_DURATION + "ms ease";
      kmark.style.opacity = "0";
      kfill.style.opacity = "1";
    }, DRAW_DURATION);

    setTimeout(function () {
      kMarkGroup.classList.add("shift-left");
      emetaGroup.classList.add("show");
    }, DRAW_DURATION + FILL_DURATION);

    setTimeout(
      onFinish,
      DRAW_DURATION + FILL_DURATION + MOVE_EMETA_DURATION + HOLD_AFTER,
    );
  }

  window.addEventListener("load", runSplashAnimation);
})();

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

    if (!howItWorks || !navbar) return;

    const sectionTop = howItWorks.getBoundingClientRect().top + window.scrollY;

    const sectionBottom = sectionTop + howItWorks.offsetHeight;

    const shouldHide =
      window.scrollY >= sectionTop - 200 && window.scrollY < sectionBottom + 50;

    navbar.classList.toggle("navbar--hidden", shouldHide);
  },
  { passive: true },
);

/* ==========================
   Mobile Menu
========================== */

const mobileMenu = document.querySelector(".mobile-menu");
const mobileOverlay = document.querySelector(".mobile-menu-overlay");
const mobileClose = document.querySelector(".mobile-menu-close");
const mobileLogin = document.querySelector(".mobile-login");

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
  const wrapperCenter = wrapperRect.top + wrapperRect.height / 2;
  const lastCardCenter = lastCardRect.top + lastCardRect.height / 2;

  maxMove = Math.max(0, lastCardCenter - wrapperCenter);

  howItWorks.style.height = `${sticky.clientHeight + maxMove}px`;
}

let currentMove = 0;
let targetMove = 0;
let animationFrame = null;

/*
  Adds inertia to the cards movement.
  The cards gradually follow the scroll position instead of moving instantly,
  making the scrolling feel smoother and heavier.
*/

function animateHowItWorks() {
  if (!track) return;

  currentMove += (targetMove - currentMove) * 0.2;

  track.style.transform = `translate3d(0, -${currentMove}px, 0)`;

  if (Math.abs(targetMove - currentMove) > 0.5) {
    animationFrame = requestAnimationFrame(animateHowItWorks);
  } else {
    currentMove = targetMove;
    track.style.transform = `translate3d(0, -${currentMove}px, 0)`;
    animationFrame = null;
  }
}

function updateHowItWorks() {
  if (!howItWorks || !sticky || !wrapper || !track) return;

  const sectionTop = howItWorks.getBoundingClientRect().top + window.scrollY;

  const scrollInside = window.scrollY - sectionTop;

  if (maxMove <= 0) return;

  const progress = Math.min(Math.max(scrollInside / maxMove, 0), 1);

  targetMove = progress * maxMove;

  if (!animationFrame) {
    animationFrame = requestAnimationFrame(animateHowItWorks);
  }
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
