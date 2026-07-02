/* ======================================
   BHAT COMPUTERS SCIENTIFIC CALCULATOR
   mode.js
====================================== */

let shiftMode = false;
let alphaMode = false;
let angleMode = "DEG";

/* ---------- Button References ---------- */

const shiftBtn = document.querySelector(".yellow");
const alphaBtn = document.querySelector(".red");
const modeBtn = document.getElementById("modeBtn");
const degBtn = document.getElementById("degBtn");

/* ---------- SHIFT ---------- */

if (shiftBtn) {
    shiftBtn.addEventListener("click", function () {

        shiftMode = !shiftMode;

        if (shiftMode) {
            shiftBtn.style.background = "#ff9800";
            shiftBtn.style.color = "#000";
        } else {
            shiftBtn.style.background = "#f2c230";
            shiftBtn.style.color = "#000";
        }

    });
}

/* ---------- ALPHA ---------- */

if (alphaBtn) {
    alphaBtn.addEventListener("click", function () {

        alphaMode = !alphaMode;

        if (alphaMode) {
            alphaBtn.style.background = "#ff1744";
        } else {
            alphaBtn.style.background = "#c62828";
        }

    });
}

/* ---------- DEG / RAD ---------- */

if (degBtn) {

    degBtn.textContent = angleMode;

    degBtn.addEventListener("click", function () {

        if (angleMode === "DEG") {
            angleMode = "RAD";
        } else {
            angleMode = "DEG";
        }

        degBtn.textContent = angleMode;

    });

}

/* ---------- MODE ---------- */

if (modeBtn) {

    modeBtn.addEventListener("click", function () {

        let choice = prompt(

`Calculator Mode

1 = COMP
2 = SCI
3 = STAT
4 = TABLE

Enter Number:`

        );

        switch (choice) {

            case "1":
                historyBox.textContent = "COMP MODE";
                break;

            case "2":
                historyBox.textContent = "SCI MODE";
                break;

            case "3":
                historyBox.textContent = "STAT MODE";
                break;

            case "4":
                historyBox.textContent = "TABLE MODE";
                break;

            default:
                historyBox.textContent = "Cancelled";

        }

    });

}

/* ---------- SHIFT RESET ---------- */

function resetShift(){

    shiftMode = false;

    if(shiftBtn){

        shiftBtn.style.background="#f2c230";
        shiftBtn.style.color="#000";

    }

}

/* ---------- ALPHA RESET ---------- */

function resetAlpha(){

    alphaMode=false;

    if(alphaBtn){

        alphaBtn.style.background="#c62828";

    }

}