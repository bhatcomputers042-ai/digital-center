/* ======================================
   BHAT COMPUTERS SCIENTIFIC CALCULATOR
   memory.js
====================================== */

let memoryValue = 0;

/* ---------- Store (MS) ---------- */
function memoryStore() {
    try {
        memoryValue = Number(Function("return " + (expression || "0"))());
        historyBox.textContent = "MS → " + memoryValue;
    } catch {
        historyBox.textContent = "Memory Error";
    }
}

/* ---------- Recall (MR) ---------- */
function memoryRecall() {
    expression += memoryValue.toString();
    updateDisplay();
}

/* ---------- Clear Memory (MC) ---------- */
function memoryClear() {
    memoryValue = 0;
    historyBox.textContent = "Memory Cleared";
}

/* ---------- Memory Add (M+) ---------- */
function memoryAdd() {
    try {
        memoryValue += Number(Function("return " + (expression || "0"))());
        historyBox.textContent = "M = " + memoryValue;
    } catch {
        historyBox.textContent = "Memory Error";
    }
}

/* ---------- Memory Subtract (M-) ---------- */
function memorySubtract() {
    try {
        memoryValue -= Number(Function("return " + (expression || "0"))());
        historyBox.textContent = "M = " + memoryValue;
    } catch {
        historyBox.textContent = "Memory Error";
    }
}

/* ---------- Memory Indicator ---------- */
function getMemoryValue() {
    return memoryValue;
}