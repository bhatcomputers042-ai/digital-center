/* ==========================================
   Bhat Computers
   AI Background Remover
   script.js
========================================== */

const fileInput = document.getElementById("fileInput");
const dropArea = document.getElementById("dropArea");
const removeBtn = document.getElementById("removeBtn");

const originalImage = document.getElementById("originalImage");
const resultImage = document.getElementById("resultImage");

const loader = document.getElementById("loader");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;

/* ---------- Select Image ---------- */

fileInput.addEventListener("change", (e) => {

    if (e.target.files.length > 0) {
        loadImage(e.target.files[0]);
    }

});

/* ---------- Drag & Drop ---------- */

dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();
    dropArea.classList.add("dragover");

});

dropArea.addEventListener("dragleave", () => {

    dropArea.classList.remove("dragover");

});

dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.classList.remove("dragover");

    if (e.dataTransfer.files.length > 0) {

        loadImage(e.dataTransfer.files[0]);

    }

});

dropArea.addEventListener("click", () => {

    fileInput.click();

});

/* ---------- Load Preview ---------- */

function loadImage(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image.");

        return;

    }

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = function (e) {

        originalImage.src = e.target.result;

        resultImage.removeAttribute("src");

        downloadBtn.style.display = "none";

    };

    reader.readAsDataURL(file);

}

/* ---------- Remove Background ---------- */

removeBtn.addEventListener("click", async () => {

    if (!selectedFile) {

        alert("Please choose an image first.");

        return;

    }

    loader.style.display = "block";
    removeBtn.disabled = true;

    try {

        const blob = await window.removeBackgroundAI(selectedFile);

        const url = URL.createObjectURL(blob);

        resultImage.src = url;

        downloadBtn.href = url;

        downloadBtn.style.display = "inline-block";

    } catch (err) {

        console.error(err);

        alert(
            "Background removal failed.\n\nCheck your internet connection and try again."
        );

    } finally {

        loader.style.display = "none";
        removeBtn.disabled = false;

    }

});