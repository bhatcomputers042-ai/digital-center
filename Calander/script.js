// --- Application State ---
let currentDate = new Date();
let selectedDate = new Date();
const notesData = JSON.parse(localStorage.getItem('bhat_calc_notes') || '{}');

// --- Element Selectors ---
const monthYearDisplay = document.getElementById('monthYearDisplay');
const calendarDays = document.getElementById('calendarDays');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayBtn = document.getElementById('todayBtn');
const themeToggle = document.getElementById('themeToggle');
const printBtn = document.getElementById('printBtn');
const notesArea = document.getElementById('notesArea');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const dayDetails = document.getElementById('dayDetails');

// --- Indian Holidays Database Example ---
const indianHolidays2026 = {
    "1-26": "Republic Day",
    "3-19": "Maha Shivaratri",
    "3-25": "Holi",
    "4-2": "Mahavir Jayanti",
    "4-3": "Good Friday",
    "8-15": "Independence Day",
    "10-2": "Mahatma Gandhi Jayanti",
    "11-8": "Diwali",
    "12-25": "Christmas Day"
};

// --- Helper Functions ---
function getHoliday(date) {
    const key = `${date.getMonth() + 1}-${date.getDate()}`;
    return indianHolidays2026[key] || null;
}

/**
 * Calculates a basic rough estimation for the Hijri Date.
 * For production environments, consider integrating an external complex almanac or accurate lunar library.
 */
function getHijriDateString(date) {
    // Basic standard math algorithmic conversion rule of thumb
    const baseDate = new Date(date.getTime());
    let jd = Math.floor(baseDate.getTime() / 86400000) + 2440588;
    let l = jd - 1948440 + 10632;
    let n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
    l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
    let m = Math.floor((24 * l) / 709);
    let d = l - Math.floor((709 * m) / 24);
    let y = 30 * n + j - 30;
    
    const hijriMonths = [
        "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
        "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
        "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];
    return `${d} ${hijriMonths[m - 1]} ${y} AH`;
}

function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// --- Render Engine ---
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Set Header display
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    calendarDays.innerHTML = '';

    // First day of current month structural offset
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Total days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    // Total days in previous month
    const prevTotalDays = new Date(year, month, 0).getDate();

    // Render Previous Month Padding Days
    for (let i = firstDayIndex; i > 0; i--) {
        const paddingDay = prevTotalDays - i + 1;
        createDayElement(paddingDay, true, new Date(year, month - 1, paddingDay));
    }

    // Render Actual Month Days
    for (let day = 1; day <= totalDays; day++) {
        createDayElement(day, false, new Date(year, month, day));
    }

    // Render Next Month Padding Days to complete standard 6-row layout matrix symmetry
    const totalRendered = firstDayIndex + totalDays;
    const nextMonthPadding = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
    for (let i = 1; i <= nextMonthPadding; i++) {
        createDayElement(i, true, new Date(year, month + 1, i));
    }

    updateSidePanel();
}

function createDayElement(dayNum, isOutside, fullDate) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    if (isOutside) dayDiv.classList.add('day-outside');

    // Check Today status
    const today = new Date();
    if (fullDate.toDateString() === today.toDateString()) {
        dayDiv.classList.add('day-today');
    }

    // Check Selected status
    if (fullDate.toDateString() === selectedDate.toDateString()) {
        dayDiv.classList.add('day-selected');
    }

    // Numeric label
    const numSpan = document.createElement('span');
    numSpan.classList.add('day-number');
    numSpan.textContent = dayNum;
    dayDiv.appendChild(numSpan);

    // Minor Hijri Sub-label
    const hijriString = getHijriDateString(fullDate);
    const hijriDayNum = hijriString.split(' ')[0];
    const hijriSpan = document.createElement('span');
    hijriSpan.classList.add('hijri-subdate');
    hijriSpan.textContent = `${hijriDayNum}H`;
    dayDiv.appendChild(hijriSpan);

    // Indian Holiday tag processing
    const holiday = getHoliday(fullDate);
    if (holiday) {
        const tagsDiv = document.createElement('div');
        tagsDiv.classList.add('day-tags');
        tagsDiv.innerHTML = `<span class="holiday-tag" title="${holiday}">${holiday}</span>`;
        dayDiv.appendChild(tagsDiv);
    }

    // Note preservation indicator indicator marker
    const dateKey = formatDateKey(fullDate);
    if (notesData[dateKey]) {
        const dot = document.createElement('div');
        dot.classList.add('has-note-dot');
        dayDiv.appendChild(dot);
    }

    // Event Interactivity Setup
    dayDiv.addEventListener('click', () => {
        selectedDate = fullDate;
        renderCalendar();
    });

    calendarDays.appendChild(dayDiv);
}

function updateSidePanel() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    dayDetails.querySelector('.gregorian-date').textContent = selectedDate.toLocaleDateString('en-IN', options);
    dayDetails.querySelector('.hijri-date').textContent = `Hijri: ${getHijriDateString(selectedDate)}`;
    
    const holiday = getHoliday(selectedDate);
    const holidayEl = dayDetails.querySelector('.holiday-text');
    if (holiday) {
        holidayEl.textContent = `🇮🇳 ${holiday}`;
        holidayEl.style.display = 'block';
    } else {
        holidayEl.style.display = 'none';
    }

    const dateKey = formatDateKey(selectedDate);
    notesArea.value = notesData[dateKey] || '';
}

// --- Interactive Event Listeners ---
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
});

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', targetTheme);
    
    const icon = themeToggle.querySelector('i');
    if (targetTheme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
});

printBtn.addEventListener('click', () => {
    window.print();
});

saveNotesBtn.addEventListener('click', () => {
    const dateKey = formatDateKey(selectedDate);
    const noteText = notesArea.value.trim();

    if (noteText) {
        notesData[dateKey] = noteText;
    } else {
        delete notesData[dateKey];
    }

    localStorage.setItem('bhat_calc_notes', JSON.stringify(notesData));
    renderCalendar();
    alert('Notes saved securely!');
});

// --- Initialization Execution ---
renderCalendar();