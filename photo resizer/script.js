/* ==========================================
   BHAT COMPUTERS PHOTO RESIZER
   script.js
   Part 3A
========================================== */

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");

const previewImage = document.getElementById("previewImage");

const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

const percentage = document.getElementById("percentage");

const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

const format = document.getElementById("format");

const resizeBtn = document.getElementById("resizeBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

const lockRatio = document.getElementById("lockRatio");

const originalSize = document.getElementById("originalSize");
const originalDimension = document.getElementById("originalDimension");

const newSize = document.getElementById("newSize");
const newDimension = document.getElementById("newDimension");

let image = new Image();

let imageLoaded = false;

let originalWidth = 0;
let originalHeight = 0;

let aspectRatio = 1;

let currentFileName = "photo";

/* ---------------------------
   Quality Slider
---------------------------- */

quality.addEventListener("input", () => {

    qualityValue.textContent = quality.value + "%";

});

/* ---------------------------
   File Upload
---------------------------- */

fileInput.addEventListener("change", function () {

    if (this.files.length > 0) {

        loadImage(this.files[0]);

    }

});

/* ---------------------------
   Drag & Drop
---------------------------- */

dropArea.addEventListener("dragover", function (e) {

    e.preventDefault();

    dropArea.classList.add("dragover");

});

dropArea.addEventListener("dragleave", function () {

    dropArea.classList.remove("dragover");

});

dropArea.addEventListener("drop", function (e) {

    e.preventDefault();

    dropArea.classList.remove("dragover");

    if (e.dataTransfer.files.length > 0) {

        fileInput.files = e.dataTransfer.files;

        loadImage(e.dataTransfer.files[0]);

    }

});

/* ---------------------------
   Load Image
---------------------------- */

function loadImage(file) {

    if (!file.type.startsWith("image/")) {

        alert("Please select a valid image.");

        return;

    }

    currentFileName = file.name.replace(/\.[^/.]+$/, "");

    const reader = new FileReader();

    reader.onload = function (event) {

        image.onload = function () {

            imageLoaded = true;

            originalWidth = image.width;
            originalHeight = image.height;

            aspectRatio = originalWidth / originalHeight;

            widthInput.value = originalWidth;
            heightInput.value = originalHeight;

            previewImage.src = image.src;

            originalDimension.textContent =
                originalWidth + " × " + originalHeight + " px";

            originalSize.textContent =
                formatBytes(file.size);

            newDimension.textContent = "-";
            newSize.textContent = "-";

            downloadBtn.style.display = "none";

        };

        image.src = event.target.result;

    };

    reader.readAsDataURL(file);

}

/* ---------------------------
   Aspect Ratio
---------------------------- */

widthInput.addEventListener("input", function () {

    if (!imageLoaded) return;

    if (lockRatio.checked) {

        const h = Math.round(widthInput.value / aspectRatio);

        heightInput.value = h;

    }

});

heightInput.addEventListener("input", function () {

    if (!imageLoaded) return;

    if (lockRatio.checked) {

        const w = Math.round(heightInput.value * aspectRatio);

        widthInput.value = w;

    }

});

/* ---------------------------
   Percentage Resize
---------------------------- */

percentage.addEventListener("change", function () {

    if (!imageLoaded) return;

    if (this.value === "") {

        widthInput.value = originalWidth;
        heightInput.value = originalHeight;

        return;

    }

    const p = parseInt(this.value);

    widthInput.value =
        Math.round(originalWidth * p / 100);

    heightInput.value =
        Math.round(originalHeight * p / 100);

});
/* ==========================================
   BHAT COMPUTERS PHOTO RESIZER
   script.js
   Part 3B
========================================== */

/* ---------------------------
   Resize Image
---------------------------- */

resizeBtn.addEventListener("click", resizeImage);

function resizeImage() {

    if (!imageLoaded) {
        alert("Please select an image first.");
        return;
    }

    const w = parseInt(widthInput.value);
    const h = parseInt(heightInput.value);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
        alert("Enter valid width and height.");
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(image, 0, 0, w, h);

    const mimeType = format.value;
    const qualityValueFloat = Number(quality.value) / 100;

    let outputDataURL;

    if (mimeType === "image/png") {
        outputDataURL = canvas.toDataURL("image/png");
    } else {
        outputDataURL = canvas.toDataURL(
            mimeType,
            qualityValueFloat
        );
    }

    previewImage.src = outputDataURL;

    newDimension.textContent = w + " × " + h + " px";

    const estimatedBytes = dataURLToBytes(outputDataURL);

    newSize.textContent = formatBytes(estimatedBytes);

    const extension = getExtension(mimeType);

    downloadBtn.href = outputDataURL;
    downloadBtn.download =
        currentFileName + "-resized." + extension;

    downloadBtn.style.display = "inline-block";

}

/* ---------------------------
   MIME Type Extension
---------------------------- */

function getExtension(type) {

    switch (type) {

        case "image/png":
            return "png";

        case "image/webp":
            return "webp";

        default:
            return "jpg";

    }

}

/* ---------------------------
   Estimate File Size
---------------------------- */

function dataURLToBytes(dataURL) {

    const base64 = dataURL.split(",")[1];

    return Math.ceil((base64.length * 3) / 4);

}

/* ---------------------------
   Download Button
---------------------------- */

downloadBtn.addEventListener("click", function () {

    if (!imageLoaded) {

        alert("No resized image available.");

    }

});
/* ==========================================
   BHAT COMPUTERS PHOTO RESIZER
   script.js
   Part 3C (Final)
========================================== */

/* ---------------------------
   Reset Button
---------------------------- */

resetBtn.addEventListener("click", resetApplication);

function resetApplication() {

    fileInput.value = "";

    previewImage.src = "";

    widthInput.value = "";
    heightInput.value = "";

    percentage.value = "";

    quality.value = 90;
    qualityValue.textContent = "90%";

    format.value = "image/jpeg";

    originalSize.textContent = "-";
    originalDimension.textContent = "-";

    newSize.textContent = "-";
    newDimension.textContent = "-";

    downloadBtn.removeAttribute("href");
    downloadBtn.style.display = "none";

    imageLoaded = false;

    image = new Image();

    originalWidth = 0;
    originalHeight = 0;
    aspectRatio = 1;
}

/* ---------------------------
   Format Bytes
---------------------------- */

function formatBytes(bytes) {

    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return (
        (bytes / Math.pow(1024, index)).toFixed(2) +
        " " +
        units[index]
    );

}

/* ---------------------------
   Keyboard Shortcuts
---------------------------- */

document.addEventListener("keydown", function (event) {

    if (event.ctrlKey && event.key.toLowerCase() === "o") {

        event.preventDefault();
        fileInput.click();

    }

    if (event.ctrlKey && event.key.toLowerCase() === "r") {

        event.preventDefault();

        if (imageLoaded) {
            resizeImage();
        }

    }

});

/* ---------------------------
   Prevent Browser Drop
---------------------------- */

window.addEventListener("dragover", function (e) {
    e.preventDefault();
});

window.addEventListener("drop", function (e) {
    e.preventDefault();
});

/* ---------------------------
   Initialization
---------------------------- */

qualityValue.textContent = quality.value + "%";

downloadBtn.style.display = "none";

console.log("Bhat Computers Photo Resizer Loaded Successfully");