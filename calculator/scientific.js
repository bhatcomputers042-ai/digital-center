/* ======================================
   BHAT COMPUTERS SCIENTIFIC CALCULATOR
   scientific.js
====================================== */

/* ---------- Square ---------- */
function square(){
    expression += "**2";
    updateDisplay();
}

/* ---------- Cube ---------- */
function cube(){
    expression += "**3";
    updateDisplay();
}

/* ---------- Reciprocal ---------- */
function reciprocal(){
    expression = "1/(" + expression + ")";
    updateDisplay();
}

/* ---------- Factorial ---------- */
function factorial(n){

    n = Number(n);

    if(n < 0 || !Number.isInteger(n))
        return NaN;

    let result = 1;

    for(let i = 2; i <= n; i++)
        result *= i;

    return result;
}

function fact(){

    try{

        let value = Function(
            "return " + expression
        )();

        expression = factorial(value).toString();

        updateDisplay();

    }catch{

        display.value = "Error";

        expression = "";

    }

}

/* ---------- nPr ---------- */

function nPr(n,r){

    return factorial(n) /
           factorial(n-r);

}

/* ---------- nCr ---------- */

function nCr(n,r){

    return factorial(n) /
    (factorial(r) *
     factorial(n-r));

}

/* ---------- Random ---------- */

function randomValue(){

    expression = Math.random().toString();

    updateDisplay();

}

/* ---------- Pi ---------- */

function insertPi(){

    insert("Math.PI");

}

/* ---------- Euler ---------- */

function insertE(){

    insert("Math.E");

}

/* ---------- x² Shortcut ---------- */

function squareCurrent(){

    try{

        let value = Function(
            "return " + expression
        )();

        expression = (value*value).toString();

        updateDisplay();

    }

    catch{

        display.value="Error";

        expression="";

    }

}

/* ---------- x³ Shortcut ---------- */

function cubeCurrent(){

    try{

        let value = Function(
            "return " + expression
        )();

        expression = (value*value*value).toString();

        updateDisplay();

    }

    catch{

        display.value="Error";

        expression="";

    }

}

/* ---------- 10^x ---------- */

function tenPower(){

    try{

        let value = Function(
            "return " + expression
        )();

        expression = Math.pow(10,value).toString();

        updateDisplay();

    }

    catch{

        display.value="Error";

        expression="";

    }

}

/* ---------- e^x ---------- */

function expPower(){

    try{

        let value = Function(
            "return " + expression
        )();

        expression = Math.exp(value).toString();

        updateDisplay();

    }

    catch{

        display.value="Error";

        expression="";

    }

}

/* ---------- Absolute ---------- */

function absoluteValue(){

    try{

        let value = Function(
            "return " + expression
        )();

        expression = Math.abs(value).toString();

        updateDisplay();

    }

    catch{

        display.value="Error";

        expression="";

    }

}

/* ---------- Sign Change ---------- */

function negate(){

    try{

        let value = Function(
            "return " + expression
        )();

        expression = (-value).toString();

        updateDisplay();

    }

    catch{

        display.value="Error";

        expression="";

    }

}