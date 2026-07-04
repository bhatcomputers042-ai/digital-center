/* ==========================================
   Bhat Computers PDF Reader
   script.js
========================================== */

const fileInput = document.getElementById("fileInput");
const viewer = document.getElementById("pdfViewer");
const dropZone = document.getElementById("dropZone");

let currentPDF = null;
let zoom = 1;

// Open PDF
fileInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
        alert("Please select a valid PDF file.");
        return;
    }

    currentPDF = URL.createObjectURL(file);
    viewer.src = currentPDF;
});

// Drag Over
dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.style.background = "#bbdefb";
});

// Drag Leave
dropZone.addEventListener("dragleave", function () {
    dropZone.style.background = "#e3f2fd";
});

// Drop PDF
dropZone.addEventListener("drop", function (e) {
    e.preventDefault();

    dropZone.style.background = "#e3f2fd";

    const file = e.dataTransfer.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
        alert("Only PDF files are supported.");
        return;
    }

    currentPDF = URL.createObjectURL(file);
    viewer.src = currentPDF;
});

// Zoom In
function zoomIn() {
    zoom += 0.1;
    viewer.style.transform = `scale(${zoom})`;
}

// Zoom Out
function zoomOut() {
    zoom = Math.max(0.5, zoom - 0.1);
    viewer.style.transform = `scale(${zoom})`;
}

// Reset Zoom
function resetZoom() {
    zoom = 1;
    viewer.style.transform = "scale(1)";
}

// Download PDF
function downloadPDF() {

    if (!currentPDF) {
        alert("Please open a PDF first.");
        return;
    }

    const link = document.createElement("a");
    link.href = currentPDF;
    link.download = "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Print PDF
function printPDF() {

    if (!currentPDF) {
        alert("Please open a PDF first.");
        return;
    }

    if (viewer.contentWindow) {
        viewer.contentWindow.focus();
        viewer.contentWindow.print();
    }
}

// Full Screen
function fullscreen() {

    if (viewer.requestFullscreen) {
        viewer.requestFullscreen();
    } else if (viewer.webkitRequestFullscreen) {
        viewer.webkitRequestFullscreen();
    } else if (viewer.msRequestFullscreen) {
        viewer.msRequestFullscreen();
    }
}

// Keyboard Shortcuts
document.addEventListener("keydown", function (e) {

    // Ctrl + O
    if (e.ctrlKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        fileInput.click();
    }

    // Ctrl + +
    if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomIn();
    }

    // Ctrl + -
    if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        zoomOut();
    }

    // Ctrl + 0
    if (e.ctrlKey && e.key === "0") {
        e.preventDefault();
        resetZoom();
    }

});