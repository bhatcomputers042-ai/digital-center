/* =========================================
   BHAT COMPUTERS SCIENTIFIC CALCULATOR
   history.js
========================================= */

let calcHistory = [];
let historyIndex = -1;

/* Save every successful calculation */

function saveHistory(exp, ans){

    calcHistory.push({
        expression: exp,
        answer: ans
    });

    historyIndex = calcHistory.length;

}

/* Previous history */

function historyPrevious(){

    if(calcHistory.length===0) return;

    if(historyIndex>0){
        historyIndex--;
    }else{
        historyIndex=0;
    }

    let item = calcHistory[historyIndex];

    expression = item.expression;

    updateDisplay();

    if(historyBox){
        historyBox.textContent="Ans = "+item.answer;
    }

}

/* Next history */

function historyNext(){

    if(calcHistory.length===0) return;

    if(historyIndex<calcHistory.length-1){
        historyIndex++;
    }else{
        historyIndex=calcHistory.length-1;
    }

    let item = calcHistory[historyIndex];

    expression=item.expression;

    updateDisplay();

    if(historyBox){
        historyBox.textContent="Ans = "+item.answer;
    }

}

/* Show previous answer */

function insertAns(){

    if(calcHistory.length===0) return;

    let ans=calcHistory[calcHistory.length-1].answer;

    expression+=ans;

    updateDisplay();

}

/* Clear History */

function clearHistory(){

    calcHistory=[];

    historyIndex=-1;

    if(historyBox){
        historyBox.textContent="";
    }

}

/* Keyboard Replay */

document.addEventListener("keydown",function(e){

    if(e.key==="ArrowUp"){

        e.preventDefault();

        historyPrevious();

    }

    if(e.key==="ArrowDown"){

        e.preventDefault();

        historyNext();

    }

});

/* Call this after every successful calculation */

function historyAfterCalculation(exp,result){

    saveHistory(exp,result);

}