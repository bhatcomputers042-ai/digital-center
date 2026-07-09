const fileInput = document.getElementById("fileInput");
const chooseBtn = document.getElementById("chooseBtn");
const detectBtn = document.getElementById("detectBtn");
const cropPointsBtn = document.getElementById("cropPointsBtn");
const resetPointsBtn = document.getElementById("resetPointsBtn");
const resetBtn = document.getElementById("resetBtn");
const rotateLeftBtn = document.getElementById("rotateLeftBtn");
const rotateRightBtn = document.getElementById("rotateRightBtn");
const downloadBtn = document.getElementById("downloadBtn");

const brightnessRange = document.getElementById("brightnessRange");
const contrastRange = document.getElementById("contrastRange");
const brightnessValue = document.getElementById("brightnessValue");
const contrastValue = document.getElementById("contrastValue");
const bwMode = document.getElementById("bwMode");

const statusBox = document.getElementById("statusBox");
const originalCanvas = document.getElementById("originalCanvas");
const croppedCanvas = document.getElementById("croppedCanvas");
const overlayCanvas = document.getElementById("overlayCanvas");

const originalCtx = originalCanvas.getContext("2d");
const croppedCtx = croppedCanvas.getContext("2d");
const overlayCtx = overlayCanvas.getContext("2d");

const tabButtons = document.querySelectorAll(".tab-btn");
const previewPanels = document.querySelectorAll(".preview-panel");

let cvReady = false;
let originalImage = null;
let currentImage = null;
let croppedBaseCanvas = null;

let cornerPoints = []; // in image/canvas coordinates
let defaultCornerPoints = [];
let activeCornerIndex = -1;
let draggingCorner = false;

// ---------- UI HELPERS ----------
function setStatus(msg, type = "normal") {
  statusBox.textContent = msg;

  if (type === "success") {
    statusBox.style.background = "#ecfdf3";
    statusBox.style.borderColor = "#abefc6";
    statusBox.style.color = "#067647";
  } else if (type === "error") {
    statusBox.style.background = "#fef3f2";
    statusBox.style.borderColor = "#fecdca";
    statusBox.style.color = "#b42318";
  } else {
    statusBox.style.background = "#f8fafc";
    statusBox.style.borderColor = "#e4e7ec";
    statusBox.style.color = "#475467";
  }
}

function enableControls(enabled) {
  detectBtn.disabled = !enabled || !cvReady;
  cropPointsBtn.disabled = !enabled;
  resetPointsBtn.disabled = !enabled;
  resetBtn.disabled = !enabled;
  rotateLeftBtn.disabled = !enabled;
  rotateRightBtn.disabled = !enabled;
}

function enableDownload(enabled) {
  downloadBtn.disabled = !enabled;
}

function resetAdjustments() {
  brightnessRange.value = 100;
  contrastRange.value = 100;
  brightnessValue.textContent = "100%";
  contrastValue.textContent = "100%";
  bwMode.checked = false;
}

function switchTab(targetId) {
  tabButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === targetId);
  });
  previewPanels.forEach(panel => {
    panel.classList.toggle("active", panel.id === targetId);
  });
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.target));
});

function setCanvasFromImage(canvas, ctx, image) {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
}

function syncOverlayCanvas() {
  overlayCanvas.width = originalCanvas.width;
  overlayCanvas.height = originalCanvas.height;
}

function clearOverlay() {
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// ---------- OPENCV LOAD ----------
function waitForOpenCV() {
  const timer = setInterval(() => {
    if (window.cv && cv.imread) {
      cvReady = true;
      clearInterval(timer);
      setStatus("OpenCV loaded successfully. Upload a document image to begin.", "success");
      if (originalImage) enableControls(true);
    }
  }, 300);

  setTimeout(() => {
    if (!cvReady) {
      setStatus("OpenCV is taking longer to load. Please wait a few more seconds.", "normal");
    }
  }, 4000);
}
waitForOpenCV();

// ---------- EVENTS ----------
chooseBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", handleFileUpload);
detectBtn.addEventListener("click", autoDetectDocument);
cropPointsBtn.addEventListener("click", cropUsingCornerPoints);
resetPointsBtn.addEventListener("click", resetCornerPoints);
resetBtn.addEventListener("click", resetTool);
rotateLeftBtn.addEventListener("click", () => rotateCurrent(-90));
rotateRightBtn.addEventListener("click", () => rotateCurrent(90));
downloadBtn.addEventListener("click", downloadCroppedImage);
brightnessRange.addEventListener("input", applyAdjustments);
contrastRange.addEventListener("input", applyAdjustments);
bwMode.addEventListener("change", applyAdjustments);

// mouse
overlayCanvas.addEventListener("mousedown", onPointerDown);
overlayCanvas.addEventListener("mousemove", onPointerMove);
window.addEventListener("mouseup", onPointerUp);

// touch
overlayCanvas.addEventListener("touchstart", onTouchStart, { passive: false });
overlayCanvas.addEventListener("touchmove", onTouchMove, { passive: false });
window.addEventListener("touchend", onPointerUp);

// ---------- FILE UPLOAD ----------
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      originalImage = img;
      currentImage = img;
      croppedBaseCanvas = null;
      cornerPoints = [];
      defaultCornerPoints = [];

      setCanvasFromImage(originalCanvas, originalCtx, img);
      syncOverlayCanvas();
      clearOverlay();

      croppedCanvas.width = 0;
      croppedCanvas.height = 0;

      resetAdjustments();
      enableControls(true);
      enableDownload(false);
      switchTab("originalPreview");

      setDefaultFullImagePoints();
      drawCornerOverlay();

      if (cvReady) {
        setStatus("Image uploaded. Click “Auto Detect Document”.", "success");
      } else {
        setStatus("Image uploaded. OpenCV is still loading...", "normal");
      }
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function setDefaultFullImagePoints() {
  if (!originalCanvas.width || !originalCanvas.height) return;

  cornerPoints = [
    { x: 20, y: 20 }, // tl
    { x: originalCanvas.width - 20, y: 20 }, // tr
    { x: originalCanvas.width - 20, y: originalCanvas.height - 20 }, // br
    { x: 20, y: originalCanvas.height - 20 } // bl
  ];
  defaultCornerPoints = clonePoints(cornerPoints);
}

// ---------- RESET ----------
function resetTool() {
  fileInput.value = "";
  originalImage = null;
  currentImage = null;
  croppedBaseCanvas = null;
  cornerPoints = [];
  defaultCornerPoints = [];
  activeCornerIndex = -1;
  draggingCorner = false;

  originalCanvas.width = 0;
  originalCanvas.height = 0;
  overlayCanvas.width = 0;
  overlayCanvas.height = 0;
  croppedCanvas.width = 0;
  croppedCanvas.height = 0;

  resetAdjustments();
  enableControls(false);
  enableDownload(false);
  clearOverlay();

  setStatus(cvReady ? "Tool reset. Upload another document image." : "Tool reset. OpenCV still loading...", "normal");
}

function resetCornerPoints() {
  if (!defaultCornerPoints.length) return;
  cornerPoints = clonePoints(defaultCornerPoints);
  drawCornerOverlay();
  setStatus("Corner points reset.", "success");
}

// ---------- ROTATE ----------
function rotateCurrent(angle) {
  if (!currentImage) return;

  const srcCanvas = document.createElement("canvas");
  const srcCtx = srcCanvas.getContext("2d");
  setCanvasFromImage(srcCanvas, srcCtx, currentImage);

  const rotated = rotateCanvas(srcCanvas, angle);

  const img = new Image();
  img.onload = function () {
    currentImage = img;
    croppedBaseCanvas = null;

    setCanvasFromImage(originalCanvas, originalCtx, img);
    syncOverlayCanvas();
    clearOverlay();
    setDefaultFullImagePoints();
    drawCornerOverlay();

    enableDownload(false);
    resetAdjustments();
    switchTab("originalPreview");
    setStatus("Image rotated. Run auto detect again or adjust points manually.", "success");
  };
  img.src = rotated.toDataURL("image/png");
}

function rotateCanvas(sourceCanvas, angle) {
  const radians = angle * Math.PI / 180;
  const rotatedCanvas = document.createElement("canvas");
  const rctx = rotatedCanvas.getContext("2d");

  if (Math.abs(angle) === 90) {
    rotatedCanvas.width = sourceCanvas.height;
    rotatedCanvas.height = sourceCanvas.width;
  } else {
    rotatedCanvas.width = sourceCanvas.width;
    rotatedCanvas.height = sourceCanvas.height;
  }

  rctx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
  rctx.rotate(radians);
  rctx.drawImage(sourceCanvas, -sourceCanvas.width / 2, -sourceCanvas.height / 2);

  return rotatedCanvas;
}

// ---------- AUTO DETECT DOCUMENT ----------
function autoDetectDocument() {
  if (!cvReady) {
    setStatus("OpenCV is not ready yet. Please wait.", "error");
    return;
  }
  if (!currentImage) {
    setStatus("Please upload a document image first.", "error");
    return;
  }

  try {
    setStatus("Detecting document edges...", "normal");

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    setCanvasFromImage(tempCanvas, tempCtx, currentImage);

    const src = cv.imread(tempCanvas);
    const detectedPoints = detectDocumentCorners(src);
    src.delete();

    if (!detectedPoints) {
      setStatus("Auto-detection could not find the document clearly. Adjust the points manually.", "error");
      setDefaultFullImagePoints();
      drawCornerOverlay();
      return;
    }

    cornerPoints = detectedPoints;
    defaultCornerPoints = clonePoints(detectedPoints);
    drawCornerOverlay();
    switchTab("originalPreview");
    setStatus("Document detected. Drag the corner points if needed, then click “Crop Selected Area”.", "success");
  } catch (error) {
    console.error(error);
    setStatus("An error occurred while detecting the document.", "error");
  }
}

function detectDocumentCorners(src) {
  let resized = new cv.Mat();
  let gray = new cv.Mat();
  let blurred = new cv.Mat();
  let edged = new cv.Mat();
  let thresh = new cv.Mat();
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

  try {
    const maxDim = 1400;
    const scale = Math.min(maxDim / src.cols, maxDim / src.rows, 1);
    const newWidth = Math.round(src.cols * scale);
    const newHeight = Math.round(src.rows * scale);

    cv.resize(src, resized, new cv.Size(newWidth, newHeight), 0, 0, cv.INTER_AREA);

    cv.cvtColor(resized, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

    cv.Canny(blurred, edged, 50, 150);
    cv.adaptiveThreshold(
      blurred,
      thresh,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      21,
      15
    );
    cv.bitwise_not(thresh, thresh);
    cv.bitwise_or(edged, thresh, edged);

    const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
    cv.morphologyEx(edged, edged, cv.MORPH_CLOSE, kernel);
    cv.dilate(edged, edged, kernel);
    kernel.delete();

    cv.findContours(edged, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    const quad = findBestQuadrilateral(contours, resized.cols, resized.rows);

    if (quad) {
      const points = [];
      for (let i = 0; i < 4; i++) {
        points.push({
          x: quad.intPtr(i, 0)[0] / scale,
          y: quad.intPtr(i, 0)[1] / scale
        });
      }
      quad.delete();
      cleanup();
      return orderPoints(points).toArray ? orderPoints(points).toArray() : orderPointsAsArray(points);
    }

    const largestContour = findLargestContour(contours, resized.cols, resized.rows);
    if (largestContour) {
      try {
        const rect = cv.minAreaRect(largestContour);
        const pts = cv.RotatedRect.points(rect);

        if (pts && pts.length === 4) {
          const points = pts.map(p => ({ x: p.x / scale, y: p.y / scale }));
          largestContour.delete();
          cleanup();
          return orderPointsAsArray(points);
        }
      } catch (e) {
        console.error(e);
      }
      largestContour.delete();
    }

    cleanup();
    return null;
  } catch (e) {
    console.error(e);
    cleanupSafe();
    return null;
  }

  function cleanup() {
    resized.delete();
    gray.delete();
    blurred.delete();
    edged.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
  }

  function cleanupSafe() {
    try { resized.delete(); } catch (_) {}
    try { gray.delete(); } catch (_) {}
    try { blurred.delete(); } catch (_) {}
    try { edged.delete(); } catch (_) {}
    try { thresh.delete(); } catch (_) {}
    try { contours.delete(); } catch (_) {}
    try { hierarchy.delete(); } catch (_) {}
  }
}

function findBestQuadrilateral(contours, imgW, imgH) {
  let bestQuad = null;
  let bestScore = 0;
  const minArea = imgW * imgH * 0.12;

  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const area = Math.abs(cv.contourArea(contour));

    if (area < minArea) {
      contour.delete();
      continue;
    }

    const peri = cv.arcLength(contour, true);
    const approx = new cv.Mat();
    cv.approxPolyDP(contour, approx, 0.02 * peri, true);

    if (approx.rows === 4) {
      const rect = cv.boundingRect(approx);
      const aspect = rect.width / rect.height;
      const rectangularity = area / (rect.width * rect.height);

      let score = area;
      if (aspect > 0.45 && aspect < 2.4) score += 50000;
      if (rectangularity > 0.58) score += 50000;

      if (score > bestScore) {
        if (bestQuad) bestQuad.delete();
        bestQuad = approx.clone();
        bestScore = score;
      }
    }

    approx.delete();
    contour.delete();
  }

  return bestQuad;
}

function findLargestContour(contours, imgW, imgH) {
  let bestContour = null;
  let maxArea = 0;
  const minArea = imgW * imgH * 0.08;

  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const area = Math.abs(cv.contourArea(contour));

    if (area > maxArea && area > minArea) {
      if (bestContour) bestContour.delete();
      bestContour = contour.clone();
      maxArea = area;
    }

    contour.delete();
  }

  return bestContour;
}

// ---------- POINT OVERLAY / DRAGGING ----------
function drawCornerOverlay() {
  clearOverlay();
  if (!cornerPoints || cornerPoints.length !== 4) return;

  const ordered = orderPointsAsArray(cornerPoints);

  // shaded outside polygon
  overlayCtx.save();
  overlayCtx.fillStyle = "rgba(0, 0, 0, 0.22)";
  overlayCtx.beginPath();
  overlayCtx.rect(0, 0, overlayCanvas.width, overlayCanvas.height);

  overlayCtx.moveTo(ordered[0].x, ordered[0].y);
  overlayCtx.lineTo(ordered[1].x, ordered[1].y);
  overlayCtx.lineTo(ordered[2].x, ordered[2].y);
  overlayCtx.lineTo(ordered[3].x, ordered[3].y);
  overlayCtx.closePath();
  overlayCtx.fill("evenodd");
  overlayCtx.restore();

  // polygon line
  overlayCtx.save();
  overlayCtx.strokeStyle = "#1565c0";
  overlayCtx.lineWidth = 3;
  overlayCtx.beginPath();
  overlayCtx.moveTo(ordered[0].x, ordered[0].y);
  overlayCtx.lineTo(ordered[1].x, ordered[1].y);
  overlayCtx.lineTo(ordered[2].x, ordered[2].y);
  overlayCtx.lineTo(ordered[3].x, ordered[3].y);
  overlayCtx.closePath();
  overlayCtx.stroke();
  overlayCtx.restore();

  // handles
  ordered.forEach((pt, idx) => {
    drawHandle(pt.x, pt.y, idx);
  });
}

function drawHandle(x, y, idx) {
  overlayCtx.save();
  overlayCtx.beginPath();
  overlayCtx.fillStyle = "#1565c0";
  overlayCtx.strokeStyle = "#ffffff";
  overlayCtx.lineWidth = 3;
  overlayCtx.arc(x, y, 10, 0, Math.PI * 2);
  overlayCtx.fill();
  overlayCtx.stroke();

  overlayCtx.fillStyle = "#ffffff";
  overlayCtx.font = "bold 11px Arial";
  overlayCtx.textAlign = "center";
  overlayCtx.textBaseline = "middle";
  overlayCtx.fillText(String(idx + 1), x, y + 0.5);
  overlayCtx.restore();
}

function getCanvasPoint(clientX, clientY) {
  const rect = overlayCanvas.getBoundingClientRect();
  const scaleX = overlayCanvas.width / rect.width;
  const scaleY = overlayCanvas.height / rect.height;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

function findNearbyCorner(pt) {
  const radius = 20;
  for (let i = 0; i < cornerPoints.length; i++) {
    const p = cornerPoints[i];
    if (Math.hypot(pt.x - p.x, pt.y - p.y) <= radius) {
      return i;
    }
  }
  return -1;
}

function onPointerDown(e) {
  if (!cornerPoints.length) return;
  e.preventDefault();
  const pt = getCanvasPoint(e.clientX, e.clientY);
  const idx = findNearbyCorner(pt);
  if (idx !== -1) {
    activeCornerIndex = idx;
    draggingCorner = true;
  }
}

function onPointerMove(e) {
  if (!draggingCorner || activeCornerIndex === -1) return;
  e.preventDefault();
  const pt = getCanvasPoint(e.clientX, e.clientY);
  moveCorner(activeCornerIndex, pt);
}

function onTouchStart(e) {
  if (!cornerPoints.length) return;
  e.preventDefault();
  const t = e.touches[0];
  const pt = getCanvasPoint(t.clientX, t.clientY);
  const idx = findNearbyCorner(pt);
  if (idx !== -1) {
    activeCornerIndex = idx;
    draggingCorner = true;
  }
}

function onTouchMove(e) {
  if (!draggingCorner || activeCornerIndex === -1) return;
  e.preventDefault();
  const t = e.touches[0];
  const pt = getCanvasPoint(t.clientX, t.clientY);
  moveCorner(activeCornerIndex, pt);
}

function onPointerUp() {
  draggingCorner = false;
  activeCornerIndex = -1;
}

function moveCorner(index, pt) {
  cornerPoints[index] = {
    x: clamp(pt.x, 0, overlayCanvas.width),
    y: clamp(pt.y, 0, overlayCanvas.height)
  };
  drawCornerOverlay();
}

// ---------- CROP USING POINTS ----------
function cropUsingCornerPoints() {
  if (!currentImage) {
    setStatus("Please upload an image first.", "error");
    return;
  }
  if (!cornerPoints || cornerPoints.length !== 4) {
    setStatus("No corner points available. Use auto detect first or adjust points.", "error");
    return;
  }

  try {
    const ordered = orderPoints(cornerPoints);

    const widthA = distance(ordered.br, ordered.bl);
    const widthB = distance(ordered.tr, ordered.tl);
    const maxWidth = Math.max(Math.round(widthA), Math.round(widthB));

    const heightA = distance(ordered.tr, ordered.br);
    const heightB = distance(ordered.tl, ordered.bl);
    const maxHeight = Math.max(Math.round(heightA), Math.round(heightB));

    if (maxWidth < 50 || maxHeight < 50) {
      setStatus("Selected area is too small to crop.", "error");
      return;
    }

    const src = cv.imread(originalCanvas);

    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      ordered.tl.x, ordered.tl.y,
      ordered.tr.x, ordered.tr.y,
      ordered.br.x, ordered.br.y,
      ordered.bl.x, ordered.bl.y
    ]);

    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      maxWidth - 1, 0,
      maxWidth - 1, maxHeight - 1,
      0, maxHeight - 1
    ]);

    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    const warped = new cv.Mat();
    cv.warpPerspective(
      src,
      warped,
      M,
      new cv.Size(maxWidth, maxHeight),
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar(255, 255, 255, 255)
    );

    const outCanvas = document.createElement("canvas");
    cv.imshow(outCanvas, warped);

    croppedBaseCanvas = outCanvas;
    resetAdjustments();
    renderAdjustedCrop();
    switchTab("croppedPreview");
    enableDownload(true);
    setStatus("Document cropped successfully.", "success");

    src.delete();
    srcTri.delete();
    dstTri.delete();
    M.delete();
    warped.delete();
  } catch (error) {
    console.error(error);
    setStatus("An error occurred while cropping the selected area.", "error");
  }
}

// ---------- ADJUSTMENTS ----------
function applyAdjustments() {
  brightnessValue.textContent = `${brightnessRange.value}%`;
  contrastValue.textContent = `${contrastRange.value}%`;

  if (croppedBaseCanvas) {
    renderAdjustedCrop();
  }
}

function renderAdjustedCrop() {
  if (!croppedBaseCanvas) return;

  croppedCanvas.width = croppedBaseCanvas.width;
  croppedCanvas.height = croppedBaseCanvas.height;
  croppedCtx.clearRect(0, 0, croppedCanvas.width, croppedCanvas.height);

  if (bwMode.checked && cvReady) {
    try {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = croppedBaseCanvas.width;
      tempCanvas.height = croppedBaseCanvas.height;
      tempCanvas.getContext("2d").drawImage(croppedBaseCanvas, 0, 0);

      let src = cv.imread(tempCanvas);
      let gray = new cv.Mat();
      let bw = new cv.Mat();

      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
      cv.adaptiveThreshold(
        gray,
        bw,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        21,
        15
      );

      const bwCanvas = document.createElement("canvas");
      cv.imshow(bwCanvas, bw);

      src.delete();
      gray.delete();
      bw.delete();

      const brightness = parseInt(brightnessRange.value, 10) / 100;
      const contrast = parseInt(contrastRange.value, 10) / 100;

      croppedCtx.filter = `brightness(${brightness}) contrast(${contrast})`;
      croppedCtx.drawImage(bwCanvas, 0, 0);
      croppedCtx.filter = "none";
      return;
    } catch (e) {
      console.error(e);
    }
  }

  const brightness = parseInt(brightnessRange.value, 10) / 100;
  const contrast = parseInt(contrastRange.value, 10) / 100;

  croppedCtx.filter = `brightness(${brightness}) contrast(${contrast})`;
  croppedCtx.drawImage(croppedBaseCanvas, 0, 0);
  croppedCtx.filter = "none";
}

// ---------- DOWNLOAD ----------
function downloadCroppedImage() {
  if (!croppedCanvas.width || !croppedCanvas.height) {
    setStatus("No cropped image available to download.", "error");
    return;
  }

  const link = document.createElement("a");
  link.href = croppedCanvas.toDataURL("image/png");
  link.download = "scanned-document.png";
  link.click();
}

// ---------- HELPERS ----------
function clonePoints(points) {
  return points.map(p => ({ x: p.x, y: p.y }));
}

function orderPoints(pts) {
  const sums = pts.map(p => p.x + p.y);
  const diffs = pts.map(p => p.x - p.y);

  const tl = pts[sums.indexOf(Math.min(...sums))];
  const br = pts[sums.indexOf(Math.max(...sums))];
  const tr = pts[diffs.indexOf(Math.max(...diffs))];
  const bl = pts[diffs.indexOf(Math.min(...diffs))];

  return { tl, tr, br, bl };
}

function orderPointsAsArray(pts) {
  const o = orderPoints(pts);
  return [o.tl, o.tr, o.br, o.bl];
}

function distance(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}