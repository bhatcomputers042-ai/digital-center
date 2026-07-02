/* ======================================
   BHAT COMPUTERS SCIENTIFIC CALCULATOR
   Engine.js
====================================== */

let expression = "";


const display = document.getElementById("display");
const historyBox = document.getElementById("history");

function updateDisplay(){
    display.value = expression || "0";
}

function insert(value){
    if(display.value==="0" && expression==="")
        expression = value;
    else
        expression += value;

    updateDisplay();
}

function clearAll(){
    expression="";
    historyBox.textContent="";
    updateDisplay();
}

function backspace(){
    expression = expression.slice(0,-1);
    updateDisplay();
}

/* ---------- Scientific Functions ---------- */

function sin(x){
    return Math.sin(
        angleMode==="DEG"
        ? x*Math.PI/180
        : x
    );
}

function cos(x){
    return Math.cos(
        angleMode==="DEG"
        ? x*Math.PI/180
        : x
    );
}

function tan(x){
    return Math.tan(
        angleMode==="DEG"
        ? x*Math.PI/180
        : x
    );
}

function log(x){
    return Math.log10(x);
}

function ln(x){
    return Math.log(x);
}

function sqrt(x){
    return Math.sqrt(x);
}

/* ---------- Evaluate ---------- */

function calculate(){

    try{

        let exp = expression;

        // power
        exp = exp.replace(/\^/g,"**");

        // percentage
        exp = exp.replace(/%/g,"/100");

        let result = Function(
            "sin",
            "cos",
            "tan",
            "log",
            "ln",
            "sqrt",
            "return "+exp
        )(
            sin,
            cos,
            tan,
            log,
            ln,
            sqrt
        );

        historyBox.textContent = expression + " =";

        expression = result.toString();

        updateDisplay();
let originalExpression = expression;

// evaluate...

historyBox.textContent = originalExpression + " =";

expression = result.toString();

updateDisplay();

historyAfterCalculation(originalExpression,result);

    }

    catch{

        display.value = "Error";

        expression="";

    }
expression = result.toString();

updateDisplay();

}

/* ---------- Keyboard Support ---------- */

document.addEventListener("keydown",function(e){

    const k=e.key;

    if(
        "0123456789.+-*/()%".includes(k)
    ){
        insert(k);
    }

    if(k==="Enter"){
        e.preventDefault();
        calculate();
    }

    if(k==="Backspace"){
        backspace();
    }

    if(k==="Delete"){
        clearAll();
    }

});