const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let cursorX = 0; //Mouse coordinates on the canvas
let cursorY = 0;

let ruleI = []; //Rule inputs
let ruleO = []; //Rule outputs. ruleI[n] will be replaced with ruleO[n] wherever it appears.
let startString = "a";
let endString = "";
let runCount = 4;
let stage = [startString]; //The iterations of the string at each step

let userRules = ["ba ac", "a aba", "", "", "", "", "", ""]; //An array of strings that the user can modify that are translated into the rules.
let topRule = 0; //The topmost rule onscreen at the moment
let selRule = 0; //The selected rule


let builders = [];
function Builder (X, Y, Dir) {
    this.startX = X;
    this.startY = Y;
    this.startDir = Dir;
    this.x = this.startX;
    this.y = this.startY;
    this.dir = this.startDir;

    this.move = function (distance, angle) {
        let a = angle + this.dir;
        a = a / 180 * Math.PI;
        this.x += Math.cos(a) * distance;
        this.y += Math.sin(a) * distance;
    };
}
builders.push(new Builder(20, 240, 0));


function buildRules () {
    ruleI = [];
    ruleO = [];
    for (let f = 0; f < userRules.length; f++) {
        if (userRules[f] == /[A-z0-9]+ [A-z0-9]+/.exec(userRules[f])) {
            ruleI.push(userRules[f].split(' ')[0]); //Translates the userRules into ruleIs and ruleOs
            ruleO.push(userRules[f].split(' ')[1]);
        }
        if (userRules[f] == /[A-z0-9]+/.exec(userRules[f])) {
            ruleI.push(userRules[f]);
            ruleO.push(""); //Special case for 'deletion' rules
        }
    }
}

function runRules () { //Runs the rules on the string using regexes
    let rule;
    let nextStage;
    stage = [startString];
    for (let f = 0; f < runCount; f++) {
        nextStage = stage[f];
        for (let r = 0; r < ruleI.length; r++) {
            rule = new RegExp(ruleI[r] + "(?!\\d*[)])", "g");
            nextStage = nextStage.replace(rule, "(" + r + ")"); //Intermediate stage necessary for preventing certain odd behaviors
        }
        for (let r = 0; r < ruleI.length; r++) {
            rule = new RegExp(ruleI[r], "g");
            nextStage = nextStage.replace(new RegExp("[(]" + r + "[)]", "g"), ruleO[r]);
        }
        stage.push(nextStage);
    }
    endString = stage[stage.length - 1];
}

function displayStages () { //Unused, draws each iteration of the string
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


function drawOutput () { //Unused, will be used for turning drawing instructions into visuals
    ctx.resetTransform();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    
    for (let g = 0; g < builders.length; g++) {
        builders[g].x = builders[g].startX;
        builders[g].y = builders[g].startY;
        builders[g].dir = builders[g].startDir;
    }

    for (let f = 0; f < endString.length; f++) {
        let bNum = builders.length;
        for (let g = 0; g < bNum; g++) {
            switch (endString[f]) {
                case "0":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].move(5, 0);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    ctx.stroke();
                    break;
                case "1":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].move(5, -45);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    ctx.stroke();
                    break;
                case "2":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].move(10, -67.5);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    ctx.stroke();
                    break;
                case "n":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].move(5, 0);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    ctx.stroke();
                    break;
                case "N":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].move(5, 45);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    ctx.stroke();
                    break;
                case "L":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].move(5, -90);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    builders[g].move(10, 90);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    builders[g].move(5, -90);
                    ctx.stroke();
                    break;
                case "R":
                    ctx.beginPath();
                    ctx.moveTo(builders[g].x, builders[g].y);
                    builders[g].move(5, -90);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    builders[g].move(10, 90);
                    ctx.lineTo(builders[g].x, builders[g].y);
                    builders[g].move(5, -90);
                    ctx.stroke();
                    break;
            }
        }
    }

    ctx.stroke();
    ctx.resetTransform();
}


function mouseInArea(aX, aY, aW, aH) { //Helper function for checking if the mouse is in a specified rectangle or not
    return (cursorX >= aX && cursorX <= (aX + aW) && cursorY >= aY && cursorY <= (aY + aH));
}

////////////////////////////////////////////////////////////////////////////////////

canvas.addEventListener('mousemove', (event) => { //Tracks mouse movement
    cursorX = event.offsetX;
    cursorY = event.offsetY;
}, false);

canvas.addEventListener('click', (event) => { //Left click
    if (mouseInArea(420, 20, 200, 40)) selRule = -1; //For selecting the 'seed' field
    for (let f = 0; f < 8; f++) {
        let r = f + topRule;
        if (mouseInArea(440, (f + 2.5) * 40, 180, 40)) { //For selecting one of the rule fields
            selRule = r
        } else if (mouseInArea(420, (f + 2.5) * 40, 20, 20)) { //The swap buttons
            [userRules[r], userRules[(r + userRules.length - 1) % userRules.length]] = [userRules[(r + userRules.length - 1) % userRules.length], userRules[r]];
        } else if (mouseInArea(420, (f + 3) * 40, 20, 20)) {
            [userRules[r], userRules[(r + 1) % userRules.length]] = [userRules[(r + 1) % userRules.length], userRules[r]];
        }
    }
    if (mouseInArea(240, 420, 20, 40)) { //The left iteration button
        if (runCount > 0) runCount -= 1;
    } else if (mouseInArea(380, 420, 20, 40)) { //The right iteration button
        runCount += 1;
    } else if (mouseInArea(460, 60, 80, 40)) { //The up scroll buttons
        if (cursorX < 500) topRule = 0;
        else if (topRule > 0) topRule -= 1;
        if (selRule >= topRule + 8) selRule = topRule + 7;
    } else if (mouseInArea(460, 420, 80, 40)) { //The down scroll buttons
        if (cursorX < 500) topRule = userRules.length - 8;
        else if (topRule < userRules.length - 8) topRule += 1;
        if (selRule < topRule) selRule = topRule;
    } else if (mouseInArea(540, 60, 40, 40)) { //The 'remove first rule' button
        if (userRules.length > 8 && userRules[0] === "") {
            userRules.shift();
            if (topRule > userRules.length - 8) topRule = userRules.length - 8;
            if (selRule >= userRules.length) selRule = userRules.length - 1;
        }
    } else if (mouseInArea(540, 420, 40, 40)) { //The 'remove last rule' button
        if (userRules.length > 8 && userRules[userRules.length - 1] === "") {
            userRules.pop();
            if (topRule > userRules.length - 8) topRule = userRules.length - 8;
            if (selRule >= userRules.length) selRule = userRules.length - 1;
        }
    } else if (mouseInArea(580, 60, 40, 40)) { //The 'add rule at start' button
        userRules.unshift("");
        selRule = 0;
        topRule = 0;
    } else if(mouseInArea(580, 420, 40, 40)) { //The 'add rule at end' button
        userRules.push("");
        selRule = userRules.length - 1;
        topRule = userRules.length - 8;
    }

    buildRules();
    runRules();
}, false);

document.addEventListener('keydown', (event) => { //For key presses
    const keyName = event.key;

    switch (keyName) { //For arrow key controls
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
        if (selRule >= topRule + 8) { //Scrolls the rule list to keep up with selection
            topRule = selRule - 7;
        } else if (selRule < topRule) {
            topRule = selRule;
        }
        if (keyName == "Backspace") { //Typing
            userRules[selRule] = userRules[selRule].slice(0, userRules[selRule].length - 1);
        } else if (keyName == " " || (keyName == /[A-z0-9]/.exec(keyName) && keyName == /\w/.exec(keyName))) {
            userRules[selRule] += keyName;
        }
    } else {
        if (keyName == "Backspace") { //Typing ('seed' field)
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

    ctx.fillStyle = "#C7C7FF"; //Highlighting 'seed' field
    if (mouseInArea(420, 20, 200, 39)) {
        ctx.fillRect(420, 20, 200, 40);
    }

    for (let f = 0; f < 8; f++) { //Highlighting a rule field
        if (mouseInArea(440, (f + 2.5) * 40, 180, 39)) {
            ctx.fillRect(440, (f + 2.5) * 40, 180, 40);
        }
    }

    if (mouseInArea(420, 100, 20, 19)) ctx.fillRect(420, 100, 20, 20); //Highlighting the swap buttons
    if (mouseInArea(420, 400, 20, 19)) ctx.fillRect(420, 400, 20, 20);
    for (let f = 0; f < 7; f++) {
        if (mouseInArea(420, (f + 3) * 40, 20, 39)) {
            ctx.fillRect(420, (f + 3) * 40, 20, 40);
        }
    }

    ctx.fillStyle = "#C7FFC7"; //Highlighting the add buttons
    if (mouseInArea(580, 60, 40, 40)) ctx.fillRect(580, 60, 40, 40);
    if (mouseInArea(580, 420, 40, 40)) ctx.fillRect(580, 420, 40, 40);

    //Highlighting the remove buttons
    if (userRules.length > 8 && userRules[0] === "") { //Top
        if (mouseInArea(540, 60, 40, 40)) {
            ctx.fillStyle = "#FFC7C7";
            ctx.fillRect(540, 60, 40, 40);
            if (topRule == 0) ctx.fillRect(440, 100, 180, 40);
        }
    } else {
        ctx.fillStyle = "#C7C7C7";
        ctx.fillRect(540, 60, 40, 40);
    }
    if (userRules.length > 8 && userRules[userRules.length - 1] === "") { //Bottom
        if (mouseInArea(540, 420, 40, 40)) {
            ctx.fillStyle = "#FFC7C7";
            ctx.fillRect(540, 420, 40, 40);
            if (topRule == userRules.length - 8) ctx.fillRect(440, 380, 180, 40);
        }
    } else {
        ctx.fillStyle = "#C7C7C7";
        ctx.fillRect(540, 420, 40, 40);
    }

    //Highlighting the scroll buttons
    if (topRule > 0) { //Top
        ctx.fillStyle = "#C7FFFF";
        if (mouseInArea(500, 60, 40, 40)) ctx.fillRect(500, 60, 40, 40);
    } else {
        ctx.fillStyle = "#C7C7C7";
        ctx.fillRect(500, 60, 40, 40);
    }
    if (topRule < userRules.length - 8) { //Bottom
        ctx.fillStyle = "#C7FFFF";
        if (mouseInArea(500, 420, 40, 40)) ctx.fillRect(500, 420, 40, 40);
    } else {
        ctx.fillStyle = "#C7C7C7";
        ctx.fillRect(500, 420, 40, 40);
    }

    //Highlighting the 'scroll-to-top/bottom' buttons
    if (topRule > 1) { //Top
        ctx.fillStyle = "#FFC7FF";
        if (mouseInArea(460, 60, 40, 40)) ctx.fillRect(460, 60, 40, 40);
    } else {
        ctx.fillStyle = "#C7C7C7";
        ctx.fillRect(460, 60, 40, 40);
    }
    if (topRule < userRules.length - 9) { //Bottom
        ctx.fillStyle = "#FFC7FF";
        if (mouseInArea(460, 420, 40, 40)) ctx.fillRect(460, 420, 40, 40);
    } else {
        ctx.fillStyle = "#C7C7C7";
        ctx.fillRect(460, 420, 40, 40);
    }

    ctx.fillStyle = (topRule > 1 ? "#7F007F" : "#7F7F7F"); //Draws the 'scroll to top' button
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

    ctx.fillStyle = (topRule > 0 ? "#007F7F" : "#7F7F7F"); //The 'scroll up' button
    ctx.beginPath();
    ctx.moveTo(520, 63);
    ctx.lineTo(536, 79);
    ctx.lineTo(504, 79);
    ctx.fill();
    ctx.fillRect(512, 79, 16, 17);

    ctx.fillStyle = (topRule < (userRules.length - 9) ? "#7F007F" : "#7F7F7F"); //The 'scroll to bottom' button
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

    ctx.fillStyle = (topRule < (userRules.length - 8) ? "#007F7F" : "#7F7F7F"); //The 'scroll down' button
    ctx.beginPath();
    ctx.moveTo(520, 457);
    ctx.lineTo(536, 441);
    ctx.lineTo(504, 441);
    ctx.fill();
    ctx.fillRect(512, 424, 16, 17);

    //The remove buttons
    ctx.fillStyle = (userRules.length > 8 && userRules[0] === "") ? "#FF0000" : "#7F7F7F";
    ctx.beginPath();
    ctx.arc(560, 80, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = (userRules.length > 8 && userRules[userRules.length - 1] === "") ? "#FF0000" : "#7F7F7F";
    ctx.beginPath();
    ctx.arc(560, 440, 16, 0, Math.PI * 2);
    ctx.fill();

    //The add buttons
    ctx.fillStyle = "#00FF00";
    ctx.beginPath();
    ctx.arc(600, 80, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(600, 440, 16, 0, Math.PI * 2);
    ctx.fill();

    //The +/- signs
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(548, 77, 24, 6);
    ctx.fillRect(548, 437, 24, 6);
    ctx.fillRect(588, 77, 24, 6);
    ctx.fillRect(588, 437, 24, 6);
    ctx.fillRect(597, 68, 6, 24);
    ctx.fillRect(597, 428, 6, 24);

    ctx.lineWidth = 2; //The 'invalid rule' X's
    for (let f = 0; f < 8; f++) {
        ctx.strokeStyle = "#AFAFAF";
        let r = f + topRule;

        if ((userRules.length > 8 && userRules[r] === "") && (r == 0 || r == userRules.length - 1)) {
            ctx.strokeStyle = "#FF0000";
        } else ctx.strokeStyle = "#AFAFAF";
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

    ctx.beginPath(); //Top and bottom button separators
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
    ctx.fillText("seed: " + startString + (selRule == -1 ? "|" : ""), 430, 46); //Writes the seed
    for (let f = 0; f < 8; f++) { //Writes the rules and draws lines between and around them
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

    if (selRule == -1) { //Boldens the border of the 'seed' field, if selected
        ctx.strokeRect(422, 22, 196, 36);
    }

    ctx.beginPath(); //More horizontal separator lines
    ctx.moveTo(420, 60);
    ctx.lineTo(620, 60);
    ctx.moveTo(420, 100);
    ctx.lineTo(620, 100);
    ctx.moveTo(420, 420);
    ctx.lineTo(620, 420);
    ctx.stroke();
    ctx.strokeRect(420, 20, 200, 440); //The border of the entire rules menu
    for (let f = 0; f < 8; f++) {
        if (f > 0) {
            ctx.beginPath();
            ctx.moveTo(440, (f + 2.5) * 40);
            ctx.lineTo(620, (f + 2.5) * 40);
            ctx.stroke();
        }

        if (selRule == f + topRule) { //Boldens the border of the selected rule
            ctx.strokeRect(442, (f + 2.5) * 40 + 2, 176, 36);
        }
    }
    ctx.beginPath(); //Separates the swap buttons from the rule fields
    ctx.moveTo(440, 100);
    ctx.lineTo(440, 420);
    ctx.stroke();

    for (let f = 0; f < Math.ceil(endString.slice(0, 920).length / 40); f++) { //Draws the end string
        switch (f) { //The text fades out over the last few lines
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

    ctx.fillStyle = "#FFFFFF"; //A white background for the iteration controls
    ctx.fillRect(240, 420, 160, 40);
    ctx.fillStyle = "#FFFFC7"; //Highlights the iteration controls
    if (mouseInArea(240, 420, 20, 40)) {
        ctx.fillRect(240, 420, 20, 40);
    } else if (mouseInArea(380, 420, 20, 40)) {
        ctx.fillRect(380, 420, 20, 40);
    }
    ctx.fillStyle = "#000000"; //Draws the iteration controls
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

    //drawOutput();
    window.requestAnimationFrame(draw);
}

buildRules();
runRules();
draw();
//displayStages();