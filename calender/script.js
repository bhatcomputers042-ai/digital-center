/*====================================================
  BHAT COMPUTERS KOKERNAG CALENDAR
  script.js - Part 1
  Initialization + Live Clock + Date Variables
====================================================*/

const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const todayDate = document.getElementById("todayDate");

const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

const todayBtn = document.getElementById("todayBtn");
const printBtn = document.getElementById("printBtn");

let currentDate = new Date();

let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

/* Month Names */

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

/* Day Names */

const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

/*=============================
    LIVE DIGITAL CLOCK
=============================*/

function updateClock() {

    const now = new Date();

    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();

    h = String(h).padStart(2, "0");
    m = String(m).padStart(2, "0");
    s = String(s).padStart(2, "0");

    document.getElementById("clock").textContent =
        `${h}:${m}:${s}`;
}

updateClock();

setInterval(updateClock, 1000);

/*=============================
      TODAY DATE
=============================*/

function updateTodayDate() {

    const now = new Date();

    const text =
        `${dayNames[now.getDay()]}, ` +
        `${now.getDate()} ` +
        `${months[now.getMonth()]} ` +
        `${now.getFullYear()}`;

    todayDate.textContent = text;
}

updateTodayDate();

/*=============================
   DAYS IN MONTH
=============================*/

function getDaysInMonth(month, year) {

    return new Date(year, month + 1, 0).getDate();

}

/*=============================
 FIRST DAY OF MONTH
=============================*/

function getFirstDay(month, year) {

    return new Date(year, month, 1).getDay();

}

/*=============================
 Utility
=============================*/

function isToday(day) {

    const now = new Date();

    return (
        day === now.getDate() &&
        currentMonth === now.getMonth() &&
        currentYear === now.getFullYear()
    );

}
/*====================================================
  BHAT COMPUTERS KOKERNAG CALENDAR
  script.js - Part 2
  Calendar Generator
====================================================*/

/*=============================
      RENDER CALENDAR
=============================*/

function renderCalendar() {

    // Clear previous calendar
    calendar.innerHTML = "";

    // Update heading
    monthYear.textContent = `${months[currentMonth]} ${currentYear}`;

    // First day of month
    const firstDay = getFirstDay(currentMonth, currentYear);

    // Number of days
    const totalDays = getDaysInMonth(currentMonth, currentYear);

    /* Empty boxes before first date */

    for (let i = 0; i < firstDay; i++) {

        const empty = document.createElement("div");

        empty.className = "day empty";

        calendar.appendChild(empty);

    }

    /* Create day boxes */

    for (let day = 1; day <= totalDays; day++) {

        const cell = document.createElement("div");

        cell.className = "day";

        cell.textContent = day;

        /* Highlight Today */

        if (isToday(day)) {

            cell.classList.add("today");

        }

        /* Weekend Colors */

        const weekIndex = (firstDay + day - 1) % 7;

        if (weekIndex === 0) {

            cell.classList.add("sunday");

        }

        if (weekIndex === 6) {

            cell.classList.add("saturday");

        }

        /* Click Effect */

        cell.addEventListener("click", () => {

            document
                .querySelectorAll(".day.selected")
                .forEach(d => d.classList.remove("selected"));

            cell.classList.add("selected");

            console.log(
                `${day}-${currentMonth + 1}-${currentYear}`
            );

        });

        calendar.appendChild(cell);

    }

}

/* Initial Calendar */

renderCalendar();
/*====================================================
  BHAT COMPUTERS KOKERNAG CALENDAR
  script.js - Part 3
  Navigation + Today + Print + Keyboard Shortcuts
====================================================*/

/*=============================
      PREVIOUS MONTH
=============================*/

prevMonthBtn.addEventListener("click", () => {

    currentMonth--;

    if (currentMonth < 0) {

        currentMonth = 11;
        currentYear--;

    }

    animateCalendar();

    renderCalendar();

});

/*=============================
        NEXT MONTH
=============================*/

nextMonthBtn.addEventListener("click", () => {

    currentMonth++;

    if (currentMonth > 11) {

        currentMonth = 0;
        currentYear++;

    }

    animateCalendar();

    renderCalendar();

});

/*=============================
         TODAY BUTTON
=============================*/

todayBtn.addEventListener("click", () => {

    const now = new Date();

    currentMonth = now.getMonth();
    currentYear = now.getFullYear();

    animateCalendar();

    renderCalendar();

});

/*=============================
         PRINT BUTTON
=============================*/

printBtn.addEventListener("click", () => {

    window.print();

});

/*=============================
     CALENDAR ANIMATION
=============================*/

function animateCalendar() {

    calendar.style.opacity = "0";

    calendar.style.transform = "translateY(25px)";

    setTimeout(() => {

        calendar.style.opacity = "1";

        calendar.style.transform = "translateY(0)";

    }, 180);

}

/*=============================
      KEYBOARD SHORTCUTS
=============================*/

document.addEventListener("keydown", (e) => {

    switch (e.key) {

        case "ArrowLeft":

            prevMonthBtn.click();

            break;

        case "ArrowRight":

            nextMonthBtn.click();

            break;

        case "Home":

            todayBtn.click();

            break;

        case "p":

        case "P":

            if (e.ctrlKey) {

                e.preventDefault();

                printBtn.click();

            }

            break;

    }

});

/*=============================
    CALENDAR TRANSITION STYLE
=============================*/

calendar.style.transition =
    "all .35s ease-in-out";

/*=============================
     WINDOW RESIZE HANDLER
=============================*/

window.addEventListener("resize", () => {

    // Reserved for future responsive updates
    console.log(
        "BHAT COMPUTERS Calendar resized."
    );

});
/*====================================================
  BHAT COMPUTERS KOKERNAG CALENDAR
  script.js - Part 4 (FINAL)
  Dark Mode + Holidays + Events + Local Storage
====================================================*/

/*------------------------------
  HOLIDAYS
------------------------------*/

const holidays = [
    { month: 0, day: 26, title: "Republic Day" },
    { month: 7, day: 15, title: "Independence Day" },
    { month: 9, day: 2, title: "Gandhi Jayanti" },
    { month: 11, day: 25, title: "Christmas" }
];

/*--------------------------------
  Mark Holidays
--------------------------------*/

function markHolidays() {

    document.querySelectorAll(".day").forEach(cell => {

        if (cell.classList.contains("empty")) return;

        const date = parseInt(cell.textContent);

        holidays.forEach(h => {

            if (
                h.month === currentMonth &&
                h.day === date
            ) {

                cell.classList.add("holiday");

                cell.title = h.title;

            }

        });

    });

}

/* Initial Holiday Marking */

markHolidays();

/*--------------------------------
  Event Dot Example
--------------------------------*/

function addEvent(day) {

    document.querySelectorAll(".day").forEach(cell => {

        if (cell.classList.contains("empty")) return;

        if (parseInt(cell.textContent) === day) {

            const dot = document.createElement("div");

            dot.className = "event-dot";

            cell.appendChild(dot);

        }

    });

}

/* Example Events */

if (currentMonth === 6) {

    addEvent(5);
    addEvent(12);
    addEvent(20);

}

/*--------------------------------
  Dark Mode
--------------------------------*/

const darkMode = localStorage.getItem("calendarDark");

if (darkMode === "true") {

    document.body.classList.add("dark");

}

/* Toggle using D key */

document.addEventListener("keydown", e => {

    if (e.key.toLowerCase() === "d") {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "calendarDark",
            document.body.classList.contains("dark")
        );

    }

});

/*--------------------------------
  Button Click Animation
--------------------------------*/

document.querySelectorAll("button").forEach(btn => {

    btn.addEventListener("click", () => {

        btn.style.transform = "scale(.95)";

        setTimeout(() => {

            btn.style.transform = "";

        }, 120);

    });

});

/*--------------------------------
  Welcome Message
--------------------------------*/

console.log(
"%cBHAT COMPUTERS KOKERNAG",
"font-size:20px;color:#1565C0;font-weight:bold;"
);

console.log("Phone : 7780980095");

console.log("Professional HTML Calendar Loaded");

/*--------------------------------
  Auto Refresh Holiday Marks
--------------------------------*/

const oldRender = renderCalendar;

renderCalendar = function () {

    oldRender();

    markHolidays();

    if (currentMonth === 6) {

        addEvent(5);
        addEvent(12);
        addEvent(20);

    }

};

/*--------------------------------
  Initial Refresh
--------------------------------*/

renderCalendar();

/*--------------------------------
  End of Project
--------------------------------*/

console.log("Calendar Ready.");
