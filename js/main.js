/* ==================================================
   1. SPLASH SCREEN (Runs once per session)
================================================== */
(function initSplash() {
  const splash = document.getElementById("splash");
  const kMarkGroup = document.getElementById("kMarkGroup");
  const kmark = document.getElementById("kmark");
  const kfill = document.getElementById("kfill");
  const emetaGroup = document.getElementById("emetaGroup");

  if (!splash) return;

  let splashAlreadyShown = false;
  try {
    splashAlreadyShown = sessionStorage.getItem("kemeta_splash_shown");
  } catch (e) {
    // تجاهل الخطأ في حالة القيود الأمنية لـ file://
  }

  // if (splashAlreadyShown) {
  //   splash.style.display = "none";
  //   document.body.classList.remove("is-loading");
  //   return;
  // }

  const DRAW_DURATION = 1400;
  const FILL_DURATION = 400;
  const MOVE_DURATION = 700;
  const HOLD_DURATION = 600;

  function endSplash() {
    splash.style.transition = "opacity 0.4s ease";
    splash.style.opacity = "0";
    setTimeout(() => {
      splash.style.display = "none";
      document.body.classList.remove("is-loading");
      try {
        sessionStorage.setItem("kemeta_splash_shown", "true");
      } catch (e) {}
    }, 400);
  }

  function startAnimation() {
    try {
      const length = kmark.getTotalLength();
      kmark.style.strokeDasharray = length;
      kmark.style.strokeDashoffset = length;
      kmark.getBoundingClientRect();

      kmark.style.transition = `stroke-dashoffset ${DRAW_DURATION}ms cubic-bezier(.65,0,.35,1)`;
      requestAnimationFrame(() => {
        kmark.style.strokeDashoffset = "0";
      });

      setTimeout(() => {
        kmark.style.transition = `opacity ${FILL_DURATION}ms ease`;
        kfill.style.transition = `opacity ${FILL_DURATION}ms ease`;
        kmark.style.opacity = "0";
        kfill.style.opacity = "1";
      }, DRAW_DURATION);

      setTimeout(() => {
        kMarkGroup?.classList.add("shift-left");
        emetaGroup?.classList.add("show");
      }, DRAW_DURATION + FILL_DURATION);

      setTimeout(
        endSplash,
        DRAW_DURATION + FILL_DURATION + MOVE_DURATION + HOLD_DURATION
      );
    } catch (err) {
      endSplash();
    }
  }

  if (document.readyState === "complete") {
    startAnimation();
  } else {
    window.addEventListener("load", startAnimation);
    setTimeout(endSplash, 3500);
  }
})();

/* ==================================================
   3. MOBILE DRAWER NAVIGATION
================================================== */
const mobileMenu = document.querySelector(".mobile-menu");
const mobileOverlay = document.querySelector(".mobile-menu-overlay");
const mobileClose = document.querySelector(".mobile-menu-close");
const menuToggle = document.querySelector("#navbar-menu-button");
const mobileLinks = document.querySelectorAll(".mobile-nav-link");

function openMobileNav() {
  mobileMenu?.classList.add("active");
  mobileOverlay?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  mobileMenu?.classList.remove("active");
  mobileOverlay?.classList.remove("active");
  document.body.style.overflow = "";
}

menuToggle?.addEventListener("click", openMobileNav);
mobileClose?.addEventListener("click", closeMobileNav);
mobileOverlay?.addEventListener("click", closeMobileNav);
mobileLinks.forEach((link) => link.addEventListener("click", closeMobileNav));

/* ==================================================
   4. HOW IT WORKS: HEAVY INERTIA PINNED SCROLL
================================================== */
const howItWorks = document.querySelector(".how-it-works-section");
const sticky = document.querySelector(".how-it-works-sticky");
const wrapper = document.querySelector(".steps-wrapper");
const track = document.querySelector(".steps-track");
const navbar = document.querySelector(".navbar");

let maxMove = 0;
let currentMove = 0;
let targetMove = 0;
let animFrameId = null;

// معامل لتثقيل ومضاعفة مسافة السكرول
const SCROLL_DISTANCE_MULTIPLIER = 1.8;
// معامل النعومة والثقل (كل ما يقل كل ما السكرول يكون أتقل وأفخم)
const LERP_FACTOR = 0.055;

function recalculatePinnedSection() {
  if (!howItWorks || !sticky || !wrapper || !track) return;

  track.style.transform = "translate3d(0, 0, 0)";
  const wrapperRect = wrapper.getBoundingClientRect();
  const lastCard = track.lastElementChild;
  if (!lastCard) return;

  const lastCardRect = lastCard.getBoundingClientRect();
  const wrapperCenter = wrapperRect.top + wrapperRect.height / 2;
  const lastCardCenter = lastCardRect.top + lastCardRect.height / 2;

  maxMove = Math.max(0, lastCardCenter - wrapperCenter);
  
  howItWorks.style.height = `${sticky.clientHeight + (maxMove * SCROLL_DISTANCE_MULTIPLIER)}px`;
}

function updateActiveCards() {
  if (!wrapper || !track) return;
  const wrapperCenter = wrapper.getBoundingClientRect().top + wrapper.clientHeight / 2;
  const cards = track.querySelectorAll(".step-card");

  let closestCard = null;
  let minDistance = Infinity;

  cards.forEach((card) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.top + cardRect.height / 2;
    const distance = Math.abs(wrapperCenter - cardCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closestCard = card;
    }
  });

  cards.forEach((card) => {
    if (card === closestCard) {
      card.classList.add("is-active");
    } else {
      card.classList.remove("is-active");
    }
  });
}

function animateSmoothCards() {
  if (!track) return;

  currentMove += (targetMove - currentMove) * LERP_FACTOR;
  track.style.transform = `translate3d(0, -${currentMove}px, 0)`;

  // تحديث الكارد النشط فورياً مع حركة السكرول
  updateActiveCards();

  if (Math.abs(targetMove - currentMove) > 0.05) {
    animFrameId = requestAnimationFrame(animateSmoothCards);
  } else {
    currentMove = targetMove;
    track.style.transform = `translate3d(0, -${currentMove}px, 0)`;
    updateActiveCards();
    animFrameId = null;
  }
}
function onScrollHandler() {
  // 1. ستايل النافبار مع السكرول
  if (window.scrollY > 0) {
    navbar?.classList.add("navbar--scrolled");
  } else {
    navbar?.classList.remove("navbar--scrolled");
  }

  if (!howItWorks || !navbar) return;

  const navHeight = navbar.offsetHeight || 70;
  const rect = howItWorks.getBoundingClientRect();

  const isInsideSection = rect.top <= navHeight && rect.bottom >= (window.innerHeight * 0.3);

  // إخفاء أو إظهار النافبار
  navbar.classList.toggle("navbar--hidden", isInsideSection);

  // 3. حساب حركة الكروت (Inertia Scroll)
  const sectionTop = rect.top + window.scrollY;
  const totalScrollDistance = maxMove * SCROLL_DISTANCE_MULTIPLIER;
  const scrollInside = window.scrollY - sectionTop;

  if (totalScrollDistance > 0) {
    const progress = Math.min(Math.max(scrollInside / totalScrollDistance, 0), 1);
    targetMove = progress * maxMove;
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(animateSmoothCards);
    }
  }
}

window.addEventListener("scroll", onScrollHandler, { passive: true });
window.addEventListener("resize", () => {
  requestAnimationFrame(() => {
    recalculatePinnedSection();
    onScrollHandler();
  });
});

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    recalculatePinnedSection();
    onScrollHandler();
  });
});

const themeToggle = document.getElementById("mobile-theme-toggle");

themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", isDark);

    const icon = themeToggle.querySelector("i");

    if (isDark) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    } else {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }
});
const savedDarkMode = localStorage.getItem("darkMode");

if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");

    const icon = document.querySelector("#mobile-theme-toggle i");

    if (icon) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}

 function initSmartScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // متابعة اتجاه السكرول (نازل ولا طالع)
    let isScrollingDown = true;
    window.addEventListener('scroll', () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      isScrollingDown = currentScrollTop > lastScrollTop;
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // 1. لو نازلة لتحت والعنصر ظهر -> شغّل الأنيميشن
        if (entry.isIntersecting && isScrollingDown) {
          entry.target.classList.add('is-visible');
        } 
        // 2. لو طلعتي فوق خالص لحد ما العنصر نزل تحت الشاشة تماماً -> صفّره في صمت عشان يجهز للنزول الجاي
        else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          entry.target.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    });

    reveals.forEach((el) => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartScrollReveal);
  } else {
    initSmartScrollReveal();
  }