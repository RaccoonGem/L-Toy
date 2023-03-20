const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let cursorX = 0;
let cursorY = 0;

let ruleI = [];
let ruleO = [];
let startString = "a";
let endString = "";
let runCount = 4;
let stage = [startString];

let userRules = ["ba ac", "a aba", "", "", "", "", "", ""];
let topRule = 0;
let selRule = 0;

/*
let builders = [];
function Builder (startX, startY, startDir) {
    this.x = startX;
    this.y = startY;
    this.dir = startDir;

    this.move = function (distance, angle) {
        let a = angle + this.dir;
        a = a / 180 * Math.PI;
        this.x += Math.cos(a) * distance;
        this.y += Math.sin(a) * distance;
    };
}
//builders.push(new Builder(320, 240, 0));
*/

function buildRules () {
    ruleI = [];
    ruleO = [];
    for (let f = 0; f < userRules.length; f++) {
        if (userRules[f] == /[A-z0-9]+ [A-z0-9]+/.exec(userRules[f])) {
            ruleI.push(userRules[f].split(' ')[0]);
            ruleO.push(userRules[f].split(' ')[1]);
        }
        if (userRules[f] == /[A-z0-9]+/.exec(userRules[f])) {
            ruleI.push(userRules[f]);
            ruleO.push("");
        }
    }
}

function runRules () {
    let rule;
    let nextStage;
    stage = [startString];
    for (let f = 0; f < runCount; f++) {
        nextStage = stage[f];
        for (let r = 0; r < ruleI.length; r++) {
            rule = new RegExp(ruleI[r], "g");
            nextStage = nextStage.replace(rule, "(" + r + ")");
        }
        for (let r = 0; r < ruleI.length; r++) {
            rule = new RegExp(ruleI[r], "g");
            nextStage = nextStage.replace(new RegExp("[(]" + r + "[)]", "g"), ruleO[r]);
        }
        stage.push(nextStage);
    }
    endString = stage[stage.length - 1];
}

function displayStages () {
    ctx.fillStyle = "#000000";
    ctx.font = "16px monospace";
    for (let f = 0; f < stage.length; f++) {
        ctx.fillText(stage[f], 16, (f + 1) * 32);
    }
    for (let f = 0; f < ruleI.length; f++) {
        ctx.fillText(ruleI[f], 16, (f + 1) * 32 + 320);
        ctx.fillText(ruleO[f], 64, (f + 1) * 32 + 320);
    }
}

/*
function drawOutput () {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    
    for (let f = 0; f < endString.length; f++) {
        let bNum = builders.length;
        for (let g = 0; g < bNum; g++) {
            switch (endString[f]) {
                case "a":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].move(g + 1, 0);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    ctx.stroke();
                    break;
                case "b":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].dir += 2;
                    builders[g].dir *= 1.05;
                    builders[g].move(1, 0);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    ctx.stroke();
                    break;
                case "c":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].dir -= 1;
                    builders[g].move(1, 0);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    ctx.stroke();
                    break;
                case "d":
                    builders.push(new Builder(builders[g].x, builders[g].y, builders[g].dir - 90));
                    //builders[g].dir += 1;
                    break;
            }
        }
    }

    ctx.stroke();
    ctx.resetTransform();
}
*/

function pointInArea(aX, aY, aW, aH) {
    return (cursorX >= aX && cursorX <= (aX + aW) && cursorY >= aY && cursorY <= (aY + aH));
}

////////////////////////////////////////////////////////////////////////////////////

canvas.addEventListener('mousemove', (event) => { //tracks mouse movement
    cursorX = event.offsetX;
    cursorY = event.offsetY;
}, false);

canvas.addEventListener('click', (event) => {
    if (pointInArea(420, 20, 200, 40)) selRule = -1;
    for (let f = 0; f < 8; f++) {
        let r = f + topRule;
        if (pointInArea(440, (f + 2.5) * 40, 180, 40)) {
            selRule = r
        } else if (pointInArea(420, (f + 2.5) * 40, 20, 20)) {
            [userRules[r], userRules[(r + userRules.length - 1) % userRules.length]] = [userRules[(r + userRules.length - 1) % userRules.length], userRules[r]];
        } else if (pointInArea(420, (f + 3) * 40, 20, 20)) {
            [userRules[r], userRules[(r + 1) % userRules.length]] = [userRules[(r + 1) % userRules.length], userRules[r]];
        }
    }
    if (pointInArea(240, 420, 20, 40)) {
        if (runCount > 0) runCount -= 1;
    } else if (pointInArea(380, 420, 20, 40)) {
        runCount += 1;
    } else if (pointInArea(460, 60, 80, 40)) {
        if (cursorX < 500) topRule = 0; else if (topRule > 0) topRule -= 1;
        if (selRule >= topRule + 8) selRule = topRule + 7;
    } else if (pointInArea(460, 420, 80, 40)) {
        if (cursorX < 500) topRule = userRules.length - 8; else if (topRule < userRules.length - 8) topRule += 1;
        if (selRule < topRule) selRule = topRule;
    } else if (pointInArea(540, 60, 40, 40)) {
        if (userRules.length > 8 && userRules[0] === "") {
            userRules.shift();
            if (topRule > userRules.length - 8) topRule = userRules.length - 8;
            if (selRule >= userRules.length) selRule = userRules.length - 1;
        }
    } else if (pointInArea(540, 420, 40, 40)) {
        if (userRules.length > 8 && userRules[userRules.length - 1] === "") {
            userRules.pop();
            if (topRule > userRules.length - 8) topRule = userRules.length - 8;
            if (selRule >= userRules.length) selRule = userRules.length - 1;
        }
    } else if (pointInArea(580, 60, 40, 40)) {
        userRules.unshift("");
        selRule = 0;
        topRule = 0;
    } else if(pointInArea(580, 420, 40, 40)) {
        userRules.push("");
        selRule = userRules.length - 1;
        topRule = userRules.length - 8;
    }

    buildRules();
    runRules();
}, false);

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    switch (keyName) {
        case "ArrowDown":
            selRule += 1;
            selRule = ((selRule + 1) % (userRules.length + 1)) - 1;
            break;
        case "ArrowUp":
            selRule -= 1;
            selRule = ((selRule + userRules.length + 2) % (userRules.length + 1)) - 1;
            break;
        case "ArrowLeft":
            if (runCount > 0) runCount -= 1;
            break;
        case "ArrowRight":
            runCount += 1;
            break;
        default:
    }
    if (selRule != -1) {
        if (selRule >= topRule + 8) {
            topRule = selRule - 7;
        } else if (selRule < topRule) {
            topRule = selRule;
        }
        if (keyName == "Backspace") {
            userRules[selRule] = userRules[selRule].slice(0, userRules[selRule].length - 1);
        } else if (keyName == " " || (keyName == /[A-z0-9]/.exec(keyName) && keyName == /\w/.exec(keyName))) {
            userRules[selRule] += keyName;
        }
    } else {
        if (keyName == "Backspace") {
            startString = startString.slice(0, startString.length - 1);
        }
        if (keyName == " " || (keyName == /[A-z0-9]/.exec(keyName) && keyName == /\w/.exec(keyName))) {
            startString += keyName;
        }
    }
    buildRules();
    runRules();
}, false);

////////////////////////////////////////////////////////////////////////////////////

function draw () {
    ctx.clearRect(0, 0, 640, 480);

    ctx.fillStyle = "#C7C7FF";
    if (pointInArea(420, 20, 200, 39)) {
        ctx.fillRect(420, 20, 200, 40);
    }
    for (let f = 0; f < 8; f++) {
        if (pointInArea(440, (f + 2.5) * 40, 180, 39)) {
            ctx.fillRect(440, (f + 2.5) * 40, 180, 40);
        }
    }
    if (pointInArea(420, 100, 20, 19)) ctx.fillRect(420, 100, 20, 20);
    if (pointInArea(420, 400, 20, 19)) ctx.fillRect(420, 400, 20, 20);
    for (let f = 0; f < 7; f++) {
        if (pointInArea(420, (f + 3) * 40, 20, 39)) {
            ctx.fillRect(420, (f + 3) * 40, 20, 40);
        }
    }

    ctx.fillStyle = "#7F7F7F";
    ctx.beginPath();
    ctx.moveTo(480, 63);
    ctx.lineTo(496, 79);
    ctx.lineTo(464, 79);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(480, 80);
    ctx.lineTo(496, 96);
    ctx.lineTo(464, 96);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(520, 63);
    ctx.lineTo(536, 79);
    ctx.lineTo(504, 79);
    ctx.fill();
    ctx.fillRect(512, 79, 16, 17);

    ctx.beginPath();
    ctx.moveTo(480, 457);
    ctx.lineTo(496, 441);
    ctx.lineTo(464, 441);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(480, 440);
    ctx.lineTo(496, 424);
    ctx.lineTo(464, 424);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(520, 457);
    ctx.lineTo(536, 441);
    ctx.lineTo(504, 441);
    ctx.fill();
    ctx.fillRect(512, 424, 16, 17);

    ctx.fillStyle = (userRules.length > 8 && userRules[0] === "") ? "#FF0000" : "#7F7F7F";
    ctx.beginPath();
    ctx.arc(560, 80, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = (userRules.length > 8 && userRules[userRules.length - 1] === "") ? "#FF0000" : "#7F7F7F";
    ctx.beginPath();
    ctx.arc(560, 440, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#00FF00";
    ctx.beginPath();
    ctx.arc(600, 80, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(600, 440, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(548, 77, 24, 6);
    ctx.fillRect(548, 437, 24, 6);
    ctx.fillRect(588, 77, 24, 6);
    ctx.fillRect(588, 437, 24, 6);
    ctx.fillRect(597, 68, 6, 24);
    ctx.fillRect(597, 428, 6, 24);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#AFAFAF";
    for (let f = 0; f < 8; f++) {
        let r = f + topRule;
        if (userRules[r] != /[A-z0-9]+ [A-z0-9]+/.exec(userRules[r]) && userRules[r] != /[A-z0-9]+/.exec(userRules[r])) {
            ctx.beginPath();
            ctx.moveTo(440, (f + 2.5) * 40);
            ctx.lineTo(620, (f + 3.5) * 40);
            ctx.moveTo(440, (f + 3.5) * 40);
            ctx.lineTo(620, (f + 2.5) * 40);
            ctx.stroke();
        }
    }

    ctx.strokeStyle = "#000000";

    ctx.beginPath();
    for (let f = 0; f < 4; f++) {
        ctx.moveTo((11.5 + f) * 40, 60);
        ctx.lineTo((11.5 + f) * 40, 100);
        ctx.moveTo((11.5 + f) * 40, 420);
        ctx.lineTo((11.5 + f) * 40, 460);
    }
    ctx.stroke();

    ctx.fillStyle = "#000000";
    ctx.font = "16px monospace";
    ctx.textAlign = "left";
    ctx.fillText("seed: " + startString + (selRule == -1 ? "|" : ""), 430, 46);
    for (let f = 0; f < 8; f++) {
        let r = f + topRule;
        ctx.fillText(r + ". " + userRules[r] + (selRule == r ? "|" : ""), 450, (f + 3) * 40 + 6);
        ctx.beginPath();
        ctx.moveTo(420, (f + 3) * 40);
        ctx.lineTo(440, (f + 3) * 40);
        ctx.moveTo(425, (f + 3) * 40 - 5);
        ctx.lineTo(430, (f + 3) * 40 - 15);
        ctx.lineTo(435, (f + 3) * 40 - 5);
        ctx.moveTo(425, (f + 3) * 40 + 5);
        ctx.lineTo(430, (f + 3) * 40 + 15);
        ctx.lineTo(435, (f + 3) * 40 + 5);
        ctx.stroke();
    }

    if (selRule == -1) {
        ctx.strokeRect(422, 22, 196, 36);
    }
    for (let f = -1; f < 10; f++) {
        ctx.strokeRect(420, (f + 1.5) * 40, 200, 40);
        if (f > 0 && f < 9 && selRule == f - 1 + topRule) {
            ctx.strokeRect(442, (f + 1.5) * 40 + 2, 176, 36);
        }
    }
    ctx.beginPath();
    ctx.moveTo(440, 100);
    ctx.lineTo(440, 420);
    ctx.stroke();

    for (let f = 0; f < Math.ceil(endString.slice(0, 920).length / 40); f++) {
        switch (f) {
            case 19:
                ctx.fillStyle = "#3F3F3F";
                break;
            case 20:
                ctx.fillStyle = "#7F7F7F";
                break;
            case 21:
                ctx.fillStyle = "#AFAFAF";
                break;
            case 22:
                ctx.fillStyle = "#C7C7C7";
            default:
        }
        ctx.fillText(endString.slice(f * 40, (f + 1) * 40), 20, (f + 2) * 20);
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(240, 420, 160, 40);
    ctx.fillStyle = "#C7C7FF";
    if (pointInArea(240, 420, 20, 40)) {
        ctx.fillRect(240, 420, 20, 40);
    } else if (pointInArea(380, 420, 20, 40)) {
        ctx.fillRect(380, 420, 20, 40);
    }
    ctx.fillStyle = "#000000";
    ctx.strokeRect(240, 420, 160, 40);
    ctx.beginPath();
    ctx.moveTo(260, 420);
    ctx.lineTo(260, 460);
    ctx.moveTo(380, 420);
    ctx.lineTo(380, 460);
    ctx.moveTo(255, 435);
    ctx.lineTo(245, 440);
    ctx.lineTo(255, 445);
    ctx.moveTo(385, 435);
    ctx.lineTo(395, 440);
    ctx.lineTo(385, 445);
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.fillText("Iteration " + runCount, 320, 446);

    window.requestAnimationFrame(draw);
}

buildRules();
runRules();
draw();
//displayStages();
//drawOutput();