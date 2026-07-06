/*==================================================
BHAT COMPUTERS
3D BOOK PORTFOLIO
script.js - Part 1
==================================================*/

"use strict";

/* ==========================
   ELEMENTS
========================== */

const book = document.getElementById("book");

const pages = document.querySelectorAll(".page");

const nextBtn = document.getElementById("nextPage");

const prevBtn = document.getElementById("prevPage");

const openBtn = document.getElementById("openBook");

/* ==========================
   VARIABLES
========================== */

let currentPage = 0;

const totalPages = pages.length;

/* ==========================
   UPDATE BUTTONS
========================== */

function updateButtons() {

    prevBtn.disabled = currentPage === 0;

    nextBtn.disabled = currentPage >= totalPages - 1;

}

/* ==========================
   OPEN BOOK
========================== */

if (openBtn) {

    openBtn.addEventListener("click", () => {

        currentPage = 1;

        pages[0].classList.add("flipped");

        updateButtons();

    });

}

/* ==========================
   NEXT BUTTON
========================== */

if (nextBtn) {

    nextBtn.addEventListener("click", () => {

        nextPage();

    });

}

/* ==========================
   PREVIOUS BUTTON
========================== */

if (prevBtn) {

    prevBtn.addEventListener("click", () => {

        previousPage();

    });

}

/* ==========================
   INITIALIZE
========================== */

updateButtons();
/*==================================================
PART 2
PAGE FLIP FUNCTIONS
==================================================*/

/* ==========================
   NEXT PAGE
========================== */

function nextPage() {

    if (currentPage >= totalPages - 1) return;

    pages[currentPage].classList.add("flipped");
    pages[currentPage].classList.remove("active");

    currentPage++;

    if (pages[currentPage]) {
        pages[currentPage].classList.add("active");
    }

    updateButtons();
}

/* ==========================
   PREVIOUS PAGE
========================== */

function previousPage() {

    if (currentPage <= 0) return;

    if (pages[currentPage]) {
        pages[currentPage].classList.remove("active");
    }

    currentPage--;

    pages[currentPage].classList.remove("flipped");
    pages[currentPage].classList.add("active");

    updateButtons();
}

/* ==========================
   RESET ACTIVE PAGES
========================== */

function refreshActivePage() {

    pages.forEach(page => page.classList.remove("active"));

    if (pages[currentPage]) {
        pages[currentPage].classList.add("active");
    }

}

/* ==========================
   GO TO PAGE
========================== */

function goToPage(pageNumber) {

    if (pageNumber < 0 || pageNumber >= totalPages) return;

    pages.forEach((page, index) => {

        if (index < pageNumber) {
            page.classList.add("flipped");
        } else {
            page.classList.remove("flipped");
        }

        page.classList.remove("active");

    });

    currentPage = pageNumber;

    refreshActivePage();

    updateButtons();

}

/* ==========================
   OPTIONAL AUTO OPEN
========================== */

// Uncomment the following block if you want the
// cover to open automatically after 2 seconds.

/*
window.addEventListener("load", () => {

    setTimeout(() => {

        goToPage(1);

    }, 2000);

});
*/
/*==================================================
PART 2
PAGE FLIP FUNCTIONS
==================================================*/

/* ==========================
   NEXT PAGE
========================== */

function nextPage() {

    if (currentPage >= totalPages - 1) return;

    pages[currentPage].classList.add("flipped");
    pages[currentPage].classList.remove("active");

    currentPage++;

    if (pages[currentPage]) {
        pages[currentPage].classList.add("active");
    }

    updateButtons();
}

/* ==========================
   PREVIOUS PAGE
========================== */

function previousPage() {

    if (currentPage <= 0) return;

    if (pages[currentPage]) {
        pages[currentPage].classList.remove("active");
    }

    currentPage--;

    pages[currentPage].classList.remove("flipped");
    pages[currentPage].classList.add("active");

    updateButtons();
}

/* ==========================
   RESET ACTIVE PAGES
========================== */

function refreshActivePage() {

    pages.forEach(page => page.classList.remove("active"));

    if (pages[currentPage]) {
        pages[currentPage].classList.add("active");
    }

}

/* ==========================
   GO TO PAGE
========================== */

function goToPage(pageNumber) {

    if (pageNumber < 0 || pageNumber >= totalPages) return;

    pages.forEach((page, index) => {

        if (index < pageNumber) {
            page.classList.add("flipped");
        } else {
            page.classList.remove("flipped");
        }

        page.classList.remove("active");

    });

    currentPage = pageNumber;

    refreshActivePage();

    updateButtons();

}

/* ==========================
   OPTIONAL AUTO OPEN
========================== */

// Uncomment the following block if you want the
// cover to open automatically after 2 seconds.

/*
window.addEventListener("load", () => {

    setTimeout(() => {

        goToPage(1);

    }, 2000);

});
*/
/*==================================================
PART 3
KEYBOARD + TOUCH + MOUSE CONTROLS
==================================================*/

/* ==========================
   KEYBOARD NAVIGATION
========================== */

document.addEventListener("keydown", (event) => {

    switch (event.key) {

        case "ArrowRight":
            nextPage();
            break;

        case "ArrowLeft":
            previousPage();
            break;

        case "Home":
            goToPage(0);
            break;

        case "End":
            goToPage(totalPages - 1);
            break;

        default:
            break;

    }

});

/* ==========================
   TOUCH SWIPE SUPPORT
========================== */

let touchStartX = 0;
let touchEndX = 0;

book.addEventListener("touchstart", (event) => {

    touchStartX = event.changedTouches[0].screenX;

}, { passive: true });

book.addEventListener("touchend", (event) => {

    touchEndX = event.changedTouches[0].screenX;

    handleSwipe();

}, { passive: true });

function handleSwipe() {

    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 60) return;

    if (distance < 0) {

        nextPage();

    } else {

        previousPage();

    }

}

/* ==========================
   MOUSE WHEEL SUPPORT
========================== */

let wheelLock = false;

book.addEventListener("wheel", (event) => {

    event.preventDefault();

    if (wheelLock) return;

    wheelLock = true;

    if (event.deltaY > 0) {

        nextPage();

    } else {

        previousPage();

    }

    setTimeout(() => {

        wheelLock = false;

    }, 500);

}, { passive: false });

/* ==========================
   DOUBLE CLICK
========================== */

book.addEventListener("dblclick", () => {

    if (currentPage === 0) {

        goToPage(1);

    } else {

        goToPage(0);

    }

});
/*==================================================
PART 4
CONTACT FORM • GALLERY • ANIMATIONS
==================================================*/

/* ==========================
   CONTACT FORM
========================== */

const contactForm = document.querySelector(".contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const name =
            this.querySelector('input[type="text"]').value.trim();

        alert(
            "Thank you, " +
            name +
            "! Your message has been received by Bhat Computers."
        );

        this.reset();

    });

}

/* ==========================
   GALLERY CLICK EFFECT
========================== */

const galleryImages =
    document.querySelectorAll(".gallery-item img");

galleryImages.forEach((img) => {

    img.addEventListener("click", () => {

        img.classList.toggle("zoomed");

    });

});

/* ==========================
   CARD ANIMATION
========================== */

const cards = document.querySelectorAll(

    ".card, .service-card, .portfolio-card, .info-box"

);

cards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-10px) scale(1.03)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

/* ==========================
   BUTTON RIPPLE EFFECT
========================== */

document.querySelectorAll("button").forEach((button) => {

    button.addEventListener("click", () => {

        button.classList.add("clicked");

        setTimeout(() => {

            button.classList.remove("clicked");

        }, 250);

    });

});

/* ==========================
   PAGE LOAD ANIMATION
========================== */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

/* ==========================
   OPTIONAL PAGE FLIP SOUND
========================== */

// Uncomment and add
// assets/page-flip.mp3
// if you want sound.

/*
const flipSound = new Audio("assets/page-flip.mp3");

function playFlipSound() {

    flipSound.currentTime = 0;

    flipSound.play();

}

const originalNext = nextPage;
nextPage = function () {
    playFlipSound();
    originalNext();
};

const originalPrevious = previousPage;
previousPage = function () {
    playFlipSound();
    originalPrevious();
};
*/
/*==================================================
PART 5
LOCAL STORAGE • AUTO SAVE • FINAL INIT
==================================================*/

/* ==========================
   SAVE CURRENT PAGE
========================== */

function saveCurrentPage() {

    try {

        localStorage.setItem(
            "bhatBookCurrentPage",
            currentPage
        );

    } catch (error) {

        console.warn(
            "Local storage unavailable:",
            error
        );

    }

}

/* ==========================
   RESTORE LAST PAGE
========================== */

function restoreLastPage() {

    try {

        const savedPage =
            localStorage.getItem(
                "bhatBookCurrentPage"
            );

        if (
            savedPage !== null &&
            !isNaN(savedPage)
        ) {

            goToPage(
                parseInt(savedPage, 10)
            );

        }

    } catch (error) {

        console.warn(
            "Unable to restore page:",
            error
        );

    }

}

/* ==========================
   WATCH PAGE CHANGES
========================== */

const originalNextPage = nextPage;
nextPage = function () {

    originalNextPage();

    saveCurrentPage();

};

const originalPreviousPage = previousPage;
previousPage = function () {

    originalPreviousPage();

    saveCurrentPage();

};

const originalGoToPage = goToPage;
goToPage = function (pageNumber) {

    originalGoToPage(pageNumber);

    saveCurrentPage();

};

/* ==========================
   AUTO DEMO MODE
========================== */

// Set to true if you want
// automatic page flipping.

const AUTO_DEMO = false;

if (AUTO_DEMO) {

    setInterval(() => {

        if (
            currentPage >=
            totalPages - 1
        ) {

            goToPage(0);

        } else {

            nextPage();

        }

    }, 5000);

}

/* ==========================
   PRELOAD IMAGES
========================== */

function preloadImages() {

    const images =
        document.querySelectorAll("img");

    images.forEach((img) => {

        const preload =
            new Image();

        preload.src = img.src;

    });

}

/* ==========================
   STARTUP
========================== */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        preloadImages();

        restoreLastPage();

        updateButtons();

        console.log(
            "BHAT COMPUTERS 3D BOOK PORTFOLIO LOADED"
        );

    }
);

/* ==========================
   VERSION INFO
========================== */

const APP_INFO = {

    name:
        "Bhat Computers 3D Book Portfolio",

    version:
        "1.0.0",

    author:
        "Bhat Computers",

    phone:
        "7780980095"

};

console.table(APP_INFO);

/*==================================================
END OF FILE
==================================================*/