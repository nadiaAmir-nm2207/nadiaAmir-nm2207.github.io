// how to comment code: https://javascript.info/comments
// ELEPHANT: things I need to pay attention to & remove

/** ---------- SVG DRAWING WITH RAPHAEL ----------
 * sources:
 * library: https://dmitrybaranovskiy.github.io/raphael/
 * steps for drawing Raphael icons: https://code.tutsplus.com/tutorials/an-introduction-to-the-raphael-js-library--net-7186
 * Adobe Illustrator to Raphael: https://snugug.com/musings/illustrator-to-raphael-js-guide/
 */

// --- Get HTML elements

// Get optBtns
const optBtnArr = Array.from(document.getElementsByClassName("optBtn"));

// Get divs for copy button
const copySvgs = Array.from(document.getElementsByClassName("copyOpt"));

// Get divs for pencil icon
const editSvgs = Array.from(document.getElementsByClassName("edit"));

// --- Arrays to store values

// Store copyIcon svgs (for optCol())
const copyIconArr = [];

// Empty array to push editIcon svgs (for optCol())
const editIconArr = [];

// --- Store svg paths in variables
// Path for copy button icon
let copySvgPath = "M12.3,3.1H4.8C2.1,3.1,0,5.3,0,7.9v7.3C0,17.9,2.2,20,4.8,20h7.5c2.7,0,4.8-2.2,4.8-4.8V7.9C17.1,5.2,15,3.1,12.3,3.1z M15.5,0H5.9C4.7,0,3.6,0.5,2.7,1.3c-0.3,0.3-0.3,0.7,0,1c0.3,0.3,0.7,0.3,1,0c0.6-0.5,1.3-0.9,2.2-0.9h9.6c1.7,0,3.1,1.3,3.1,3V14 c0,0.7-0.3,1.5-0.8,2c-0.3,0.3-0.3,0.8,0.1,1c0.1,0.1,0.3,0.2,0.5,0.2c0.2,0,0.4-0.1,0.5-0.3c0.7-0.8,1.1-1.8,1.1-2.9V4.5 C20.1,2,18,0,15.5,0z";
// Path for pencil icon
let editSvgPath = "M7.3,15.9c-0.3,0.3-0.7,0.3-0.9,0s-0.3-0.7,0-0.9L14,7.3c0.4-0.4,0.4-1,0-1.5c-0.4-0.4-1-0.4-1.5,0l-7.7,7.7 c-0.3,0.3-0.7,0.3-0.9,0c-0.3-0.3-0.3-0.7,0-0.9l8.4-8.4L11,2.9l-9,9c-0.1,0.1-0.2,0.2-0.2,0.4l-0.8,3c0.9,0.2,1.7,0.6,2.4,1.3 s1.1,1.5,1.3,2.4l3-0.8c0.2,0,0.3-0.1,0.4-0.2l9-9l-1.4-1.4L7.3,15.9z M2.6,17.3c-0.5-0.5-1.2-0.9-1.9-1.1L0,18.8 c-0.2,0.6,0.4,1.2,1.1,1.1l2.6-0.7C3.5,18.5,3.2,17.8,2.6,17.3L2.6,17.3z M19.6,5.1l-4.8-4.8c-0.3-0.3-0.9-0.3-1.2,0L12,1.9l6,6l0,0 l1.6-1.6C20,6,20,5.4,19.6,5.1z";

// --- Calculate center coordinates for icon
function centerSvg(boxWidth, iconWidth){
    // Get 1/2 box width
    let halfBox = boxWidth / 2;
    // Get 1/2 icon width
    let halfWidth = iconWidth / 2;
    // Center coord = 1/2 box width = 1/2 icon width
    return halfWidth - halfBox; // Get negative number so that svg moves right instead of left
};

/** Loop through array of html divs and set svg in them
 *
 *
 * @param {string[]} array The array of html divs being targeted
 * @param {string} xPaper The Paper, x is the name
 * @param {string} xPath The path, x is the name
 * @param {string[]} path The string for svg path
 * @param {number} width Number for icon's width
 * @param {string[]} endArr Name of array the path will be pushed to
 * @return {string} setViewBox coordinates & values
 */

function createSvgs(array, xPaper, xPath, path, width, endArr){
    // For all buttons in array...
    for(let x = 0; x < array.length; x++){
        // Create the paper to put the SVG (source: https://alistapart.com/article/svg-with-a-little-help-from-raphael/)
        // This creates a "canvas" in the button with height and width = optBtnWidth()
        let xPaper = Raphael(array[x], "100%", "100%");
        // Place the path of the svg into the paper & declare a variable to edit the attributes later
        let xPath = xPaper.path(path)
        // Edit path's attributes: this gives a black fill & no stroke
        xPath.attr({
            fill: "auto",
            "stroke-width": 0, // any property in documentation with a dash must be put in ""
        });
        // Push the xPath into endArr (for using it outside function later)
        endArr.push(xPath);
        // Set the viewbox. coords are 0, 0 and the viewbox height and width = optBtnWidth()
        xPaper.setViewBox(centerSvg(optBtnWidth(), width), centerSvg(optBtnWidth(), width), optBtnWidth(), optBtnWidth(), true); // source: https://stackoverflow.com/questions/11176396/how-can-i-scale-raphael-js-elements-on-window-resize-using-jquery
    }
}

// --- Call createSvgs to different icons to "draw" them
// Draw copyBtn icon
// "copyIconPaper", "copyIconPath" are in "" because they are names of variables within the function, not predefined ones
createSvgs(copySvgs, "copyIconPaper", "copyIconPath", copySvgPath, 20, copyIconArr);

// Draw pencil icon
createSvgs(editSvgs, "editIconPaper", "editIconPath", editSvgPath, 20, editIconArr)

// ---------- LOCKING FEATURES ----------
// Get the lock buttons from the html
let lockArr = Array.from(document.getElementsByClassName("lock"));

// Store the locked state data to be accessed by the changeColour loop later
// Each item corresponds to one of the locks
let lockState = [false, false, false, false, false];

// --- for individual locks
/**
 * Changes lockState & icons to match lockState
 *
 * @param lock The lock button HTML element from lockArr.
 * @param x The index of lockArr (source: https://www.w3schools.com/jsref/jsref_foreach.asp)
 * @return change in lockState & icons to match lockState
 */
// Apply eventListener to all class=".lock" elements (source: https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/)
lockArr.forEach((lock, x) => {
    lock.addEventListener("click", event => {
        // Get the lightness levels of the colours
        const lvals = lvals1.concat(lvals2, lvals3);
        // If the background is dark
        if (between(lvals[x], 0, 50)){
            if(lockState[x] == true){ // if lock is locked
                lockState[x] = false; // then unlock it
                // and display light unlocked emoji
                lock.innerHTML = "<img src = 'resources/lightUnlock.svg' class='lockIcon'>"
            }
            else if (lockState[x] == false){ // if lock is unlocked
                lockState[x] = true; // then lock it
                // and display light locked emoji
                lock.innerHTML = "<img src = 'resources/lightLock.svg' class='lockIcon'>"
            };
        }
        // If the background is light
        else if (between(lvals[x], 50, 100)){
            if(lockState[x] == true){ // if lock is locked
                lockState[x] = false; // then unlock it
                // and display light unlocked emoji
                lock.innerHTML = "<img src = 'resources/darkUnlock.svg' class='lockIcon'>"
            }
            else if (lockState[x] == false){ // if lock is unlocked
                lockState[x] = true; // then lock it
                // and display light locked emoji
                lock.innerHTML = "<img src = 'resources/darkLock.svg' class='lockIcon'>"
            };
        };
        lock.style.transitionDuration = "0.5s"; // gradual colour change
    });
});

// --- for mass locking & unlocking

// Unlock all colours by clicking #unlockAll
function unlockAll(){
    // Unlock all lockStates
    lockState = [false, false, false, false, false];
    // Loop through all lock buttons to...
    for (let x = 0; x < lockArr.length; x++){
        // ...change to the unlock icon
        lockArr[x].innerHTML = "&#x1f513;"
    };
};

// Lock all colours by clicking #lockAll
function lockAll(){
    // Lock all lockStates
    lockState = [true, true, true, true, true];
    // Loop through all lock buttons to...
    for (let x = 0; x < lockArr.length; x++){
        // ...change to the lock icon
        lockArr[x].innerHTML = "&#128274;"
    };
};

// addEventListeners to #unlockAll & #lockAll
document.getElementById("unlockAll").addEventListener("click", function(){unlockAll()});
document.getElementById("lockAll").addEventListener("click", function(){lockAll()});

// Alert user if they are clicking #changeBtn when all colours locked
function lockAllError(){
    // Test if all the colours are locked
    if (lockState[0] == true && lockState[1] == true && lockState[2] == true && lockState[3] == true && lockState[4] == true){
        // Create an alert (source: https://www.w3schools.com/jsref/met_win_alert.asp)
        // ELEPHANT replace with popup in future https://www.w3schools.com/howto/howto_js_popup.asp
        alert("All the colours are currently locked. Please unlock at least one colour for it to change.");
    };
};

// ---------- DARK MODE LIGHT MODE, #modeBtn ----------

// Get #modeBtn
let modeBtn = document.getElementById("modeBtn");
// Stores info about which mode is chosen
let mode = false; // true if light mode, false if dark mode

// Triggers changes when #modeBtn clicked
function changeMode(){
    // if in light mode
    if (mode == true){
        // reassign value to indicate dark mode
        mode = false;
        // change text to "light bg" instead of "dark bg"
        modeBtn.innerHTML = "&#9728; light bg";
        // set background colour of #chartPrvws to dark
        document.getElementById("chartPrvws").style.backgroundColor = "#011627";
        return mode;
    }
    else if (mode == false){ // if mode is false, i.e. in dark mode
        // reassign value to indicate light mode
        mode = true;
        // change text to "dark bg" instead of "light bg"
        modeBtn.innerHTML = "&#9790; dark bg";
        // set background colour of #chartPrvws to light
        document.getElementById("chartPrvws").style.backgroundColor = "#fff9f5";
        return mode;
    };
};
// eventlistener for modeBtn
modeBtn.addEventListener("click", function(){changeMode()});

// ---------- COLOUR CHANGING ALGORITHM, #changeBtn ----------
// --- Get HTML elements
// Array.from creates an actual array from the collection (source: https://bobbyhadz.com/blog/javascript-cannot-set-property-color-of-undefined)

// Get the colour swatches
const Swatches = Array.from(document.getElementsByClassName("swatch"));

// Get the text in the colour swatches
const colourLabels = Array.from(document.getElementsByClassName("colourLabel"));

// Get the div wrapped around content within swatches
const colOpt = Array.from(document.getElementsByClassName("colOpt"));

// Get swatches tagged with hue1, hue2 & hue3 respectively
const hue1 = Array.from(document.getElementsByClassName("hue1"));
const hue2 = Array.from(document.getElementsByClassName("hue2"));
const hue3 = Array.from(document.getElementsByClassName("hue3"));

// Get swatches tagged with baseHue
const baseHueDivs = Array.from(document.getElementsByClassName("baseHue"));

// Get textarea for all the colour codes (in sidebar)
const allCodes = document.getElementById("allCodes"); // getting the textarea where all the colour codes appear

// --- Set up arrays to store values

// Store base hue values
const baseHueArray = [];

// Store HSL strings
const HSLstringsArray = []; // to store HSL strings

// Store lightness values for hues 1, 2, 3 separately
const lvals1 = [];
const lvals2 = [];
const lvals3 = [];

// Store saturation values for hues 1, 2, 3 separately
const sat1 = [];
const sat2 = [];
const sat3 = [];

// Store RGB strings
const rgbVal = [];

// Push hex codes for colours (for #allCodes textarea)
const codesArr = [];

// --- Basic Functions
// clear arrays to prevent stacking
function clearArr(){
    HSLstringsArray.length = 0;
    lvals1.length = 0;
    lvals2.length = 0;
    lvals3.length = 0;
    sat1.length = 0;
    sat2.length = 0;
    sat3.length = 0;
    rgbVal.length = 0;
    chartImgData.length = 0;
};

// update charts (source: https://www.chartjs.org/docs/latest/developers/updates.html)
function updateChart(){
    lnPrvw.update();
    barPrvw.update();
    piePrvw.update();
    donutPrvw.update();
    polarPrvw.update();
    bubblePrvw.update();
};

// --- Basic Maths Functions

// Generate random values (source: adapted from the Colour Palette Extra Practice)
function random(min, max){
    let x = min;
    let y = max;
    // number of numbers that Math.random generates from
    let range = y - x;
    return Math.floor(Math.random() * range); // rounds down
};

// Generate random values that round up (to prevent 0 values, needed for chart data randomisation)
function randomUp(min, max){
    let x = min;
    let y = max;
    // number of numbers that Math.random generates from
    let range = y - x;
    return Math.ceil(Math.random() * range); // Math.ceil rounds up
};

// --- Basic Maths Tests

/**
 * Returns if condition of hue >= min && hue <= max
 *
 * @param {number} hue The generated hue value
 * @param {number} min The minimum number hue can take
 * @param {number} max The maximum number hue can take
 * @return an if condition of hue >= min && hue <= max
 */
function between(hue, min, max){
    return hue >= min && hue <= max
};

/**
 * Returns newVal that "circles back" if base + constant > maximum
 *
 * @param {number} base The number being added to
 * @param {number} max The maximum value the number should take
 * @param {number} x The constant being added/subtracted
 * @return {number} newVal number that "circles back" if base + constant > maximum
 */
function circleBack(base, max, x){
    // Get the sum
    let newVal  = base + x;
    // Test if newVal > max
    if (newVal > max){
        // Circle back
        newVal -= max;
    }
    return newVal;
};

// --- Basic Conversion Formulas for Colour

// HSL to RGB (source: https://www.had2know.org/technology/hsl-rgb-color-converter.html)
/**
 * Returns [r, g, b]
 *
 * @param {number} h Hue value
 * @param {number} s1 Saturation value (between 0 - 100)
 * @param {number} l1 Lightness value (between 0 - 100)
 * @return {number[]} [r, g, b]
 */
function hslrgb(h, s1, l1){
    // saturation & lightness have to be between 0 - 1 to prevent massive numbers for the r, g, b values
    let s = s1/100;
    let l = l1/100;
    // formula start
    let d = s * (1 - Math.abs(2*l - 1)); // |2L - 1| => modulus => Math.abs (source: https://www.educative.io/answers/how-to-convert-negative-numbers-to-positive-numbers-in-javascript)
    let m = 255 * (l - 1/2 * d);
    let x = d * (1 - Math.abs((h/60)%2 - 1)); // (H/60)mod_2 => getting remainder when h/60 is divided by 2 => %2
    // preparing variables for rgb values
    let r = 0;
    let g = 0;
    let b = 0;
    if (0 <= h && h < 60){
        r = Math.floor(255 * d + m); // Math.floor to round to nearest integer
        g = Math.floor(255 * x + m);
        b = Math.floor(m);
    }
    else if (60 <= h && h < 120){
        r = Math.floor(255*x + m);
        g = Math.floor(255*d + m);
        b = Math.floor(m);
    }
    else if (120 <= h && h < 180){
        r = Math.floor(m);
        g = Math.floor(255*d + m);
        b = Math.floor(255*x + m);
    }
    else if (180 <= h && h < 240){
        r = Math.floor(m);
        g = Math.floor(255*x + m);
        b = Math.floor(255*d + m);
    }
    else if (240 <= h && h < 300){
        r = Math.floor(255 * x + m);
        g = Math.floor(m);
        b = Math.floor(255*d + m);
    }
    else if (300 <= h && h<=360){ // the site put <360 but I know there's a chance my generators pull out a 360 so I used <= just to be safe
        r = Math.floor(255*d + m);
        g = Math.floor(m);
        b = Math.floor(255*x + m);
    }
    return [r, g ,b]; // array to separate the r, g, b values so that can convert to hex later
};

// RGB to HEX (source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb)
// Convert component by component (r, then g, then b)
function componentToHex(c) {
    // Get the whole number & the remainder of component / 16
    let hex = c.toString(16);
    // Remainder * 16, if 10 = A, 11 = B and so on until 15 = F (source: https://appkong.com/tools/hex-to-rgb/)
    return hex.length == 1 ? "0" + hex : hex;
    };

// Concatenate R, G, B values together to form #xxxxxx
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

// ---------- ALGORITHM TO CHANGE COLOUR ----------

// Generate random base hues
function hueGen(){
    return random(0, 360); // Returns a random value between 0 & 360
    };

// Test base hues for red or green or other
function testHue(hue){
    // Test for red
    if (between (hue, 0, 10)){
        let red = true;
        return red;
    }
    // Test for green
    else if (between (hue, 100, 130)){
        let green = true;
        return green;
    }
    // For other
    else{
        let redGreen = false;
        return redGreen;
    }
};

// Compare the base hues to test for red-green combination
function compareHue(hue1, hue2, hue3){
    // If hue1 is red & hue2 is green or vice versa, return true
    if (testHue(hue1) == true && testHue(hue2) == true){
        return true;
    }
    // If hue2 is red & hue3 is green or vice versa, return true
    else if (testHue(hue2) == true && testHue(hue3) == true) { // if hue2 is red and hue3 is green or vice versa, return true
        return true;
    }
    // If hue1 is red & hue3 is green or vice versa, return true
    else if (testHue(hue1) == true && testHue(hue3) == true){
        return true;
    }
    // If the hues are not red + green
    else {
        return false;
    };
};

// Generate base hues that are not red & green together
function baseHueGen(){
    // Clears array to break recursion
    baseHueArray.length = 0;
    // Generate first base hue
    let baseHue1 = hueGen();
    // Push first base hue into baseHueArray
    baseHueArray.push(baseHue1);
    // baseHue1 + 137 (golden angle) to generate contrasting hue value for baseHue2
    let baseHue2 = circleBack(baseHue1, 360, 137);
    // Push second base hue into baseHueArray
    baseHueArray.push(baseHue2);
    // baseHue2 + 137 (golden angle) to generate contrasting hue value for baseHue3
    let baseHue3 = circleBack(baseHue2, 360, 137);
    // Push third base hue into baseHueArray
    baseHueArray.push(baseHue3);
    // Test if the baseHues are in the ranges of red-green combination
    // If the baseHues have red-green combination...
    if (compareHue(baseHueArray[0], baseHueArray[1], baseHueArray[2]) == true){
        // ... repeat the generation process
        baseHueGen();
    };
};

// Generate a base saturation value
function satValGen(){
    // Max addition to saturation value later = 40 so max here is: 100 - 40 = 60, 60 - 10 = 50
    return 10 + random(0, 50);
    };

// Space saturation values out from each other
/**
 *
 *
 * @param {number[]} hueArray Arrays hue1 or hue2 (no hue3, as there is only 1 value in hue3)
 * @param {number[]} satArray Arrays sat1 or sat2 (no sat3, as there is only 1 value in sat3)
 * @return {number[]} push new saturation value into satArray
 */
function satGen(hueArray, satArray){
    // Generate random saturation for base
    let baseSat = satValGen();
    // Push baseSat into satArray
    satArray.push(baseSat);
    // For as many times as the number of items in the (array - 1)...
    for (let i = 0; i < hueArray.length - 1; i++){
        // Add a random number from 0 - 20 to the baseSat
        // Ensure newSat value does not > 100 with circleBack()
        newSat = circleBack(baseSat, 100, random(0, 20));
        // Push newSat into satArray
        satArray.push(newSat);
    };
};

// Generate a base lightness value with a range that depends on whether in light or dark mode
function ltValGen(){
    // If in light mode
    if (mode == true){
        // Return a lightness value >= 10. Max with stack later = 100 - (10 + 20) = 70. 70 - 10 = 60.
        let ltVal = 10 + random(0, 60);
        return ltVal; 
    }
    // If in dark mode
    else if (mode == false){
        // Return lightness value capped at 80 to accommodate stacking
        let ltVal = 30 + random(0, 50);
        return ltVal;
    };
};

// Space lightness values out from each other
/**
 *
 *
 * @param {number[]} hueArray Arrays hue1 or hue2 (no hue3, as there is only 1 value in hue3)
 * @param {number[]} lvalsArray Arrays lvals1 or lvals2 (no lvals3, as there is only 1 value in lvals3)
 * @return {number} push new lightness value into lvalsArray
 */
function lightGen(hueArray, lvalsArray){
    let baseLi = ltValGen(); // random base lightness value (based on whether bg is light or dark)
    lvalsArray.push(baseLi);
    // For as many times as the number of items in the (array - 1)...
    for (let i = 0; i < hueArray.length - 1; i++){
        // Add a random number from 0 - 20 to baseLi
        // Ensure newLi value does not > 100 with circleBack()
        newLi = circleBack(baseLi, 100, 10 + random(0, 10));
        // Push newLi to lvalsArray
        lvalsArray.push(newLi);
    };
};

// Generate saturation & lightness values for new colours based on the base colour
/**
 *
 *
 * @param {number[]} hueArray Arrays hue1 or hue2 (no hue3, as there is only 1 value in hue3)
 * @param {number[]} satArray Arrays sat1 or sat2 (no sat3, as there is only 1 value in sat3)
 * @param {number[]} lvalsArray Arrays lvals1 or lvals2 (no lvals3, as there is only 1 value in sat3)
 * @return {number} Saturation & lightness values pushed into respective arrays sat1/sat2, lvals1/lvals2
 */
function satLightGen(hueArray, satArray, lvalsArray){
    satGen(hueArray, satArray);
    lightGen(hueArray, lvalsArray);
};

// String the HSL values together and push it into an array
/**
 *
 *
 * @param {number} y Number 0, 1, 2 for the indexes in baseHueArray (hue1, hue2, hue3 respectively)
 * @param {number[]} hueArray Arrays hue1/hue2/hue3
 * @param {number[]} satArray Arrays sat1/sat2/sat3
 * @param {number[]} lvalsArray Arrays lvals1/lvals2/lvals3
 * @return {string[]} 5 HSL strings in HSLstringsArray
 */
function hslString(y, hueArray, satArray, lvalsArray){
    // Generate saturation & lightness values
    satLightGen(hueArray, satArray, lvalsArray);
    // Within each hueArray...
    for (let i = 0; i < hueArray.length; i++){
        // for colour[i], give it H: value of base hue[y], S: saturation[i], L: lightness[i]
        // (baseHueArray[y] + (i * constant)) so that the hue value increases by constant for the next swatch
        let newHSLstring = "hsl(" + (baseHueArray[y] + (i*10)) + ", " + satArray[i] + "%, " + lvalsArray[i] + "%)";
        // Push HSL string to HSLstringsArray
        HSLstringsArray.push(newHSLstring);
    };
};

// Create rgbString from the HSL values
function rgbString(){
    // Get array of the 5 base hues
    const hues = [baseHueArray[0], baseHueArray[0], baseHueArray[1], baseHueArray[1], baseHueArray[2]];
    // Get array of the 5 saturation values (source: https://www.w3schools.com/jsref/jsref_concat_array.asp)
    const sat = sat1.concat(sat2, sat3);
    // Get array of the 5 lightness values
    const lvals = lvals1.concat(lvals2, lvals3);
    // Use hslrgb formula to convert each HSL component
    let rgb = hslrgb(hues[x], sat[x], lvals[x]); // returns [r, g, b]
    // Set rgbVal[x] to [r, g, b]
    rgbVal[x] = rgb;
};

// Change chart colours based on the generated colour
/**
 * @param {number} x Number to count index of iteration in changeColour() later
 */
function chartCol(){
    // Change line colour of the xth linegraph dataset to the xth HSL string
    lnPrvw.data.datasets[x].borderColor = HSLstringsArray[x];
    // Direct code to datasets[0] specifically to change bg colours
    barPrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; 
    piePrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; 
    donutPrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x];
    polarPrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x];
    bubblePrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x];
};

// Change colour of swatch & chart borders based on generated colour
/**
 * @param {number} x Number to count index of iteration in changeColour() later
 */
function bdrCol(){
    // Darken colour for border by adding a factor to RGB values (source: https://stackoverflow.com/questions/6615002/given-an-rgb-value-how-do-i-create-a-tint-or-shade)
    // Change border colours of swatches
    Swatches[x].style.borderColor = "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")";
    // Change border colours of relevant charts
    barPrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")";
    piePrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")";
    donutPrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")";
    polarPrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")";
    bubblePrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")";
};

// Test what color to use for content within swatch, based on the swatch background
/**
 * @param {number} x Number to count index of iteration in changeColour() later
 */
function optCol(x){
    // Get all lightness values
    const lvals = lvals1.concat(lvals2,lvals3);
    // If background is dark...
    if (between(lvals[x], 0, 50)){
        // Make colour code light
        colourLabels[x].style.color = "#fff9f5";
        // Make svg fills light
        copyIconArr[x][0].style.fill = "#fff9f5";
        editIconArr[x][0].style.fill = "#fff9f5";
        // Set gradual colour change
        copyIconArr[x][0].style.transitionDuration = "0.5s";
        editIconArr[x][0].style.transitionDuration = "0.5s";
        // For the lock icons...
        // If locked...
        if(lockState[x] == true){
            // Display light locked icon
            lockArr[x].innerHTML = "<img src = 'resources/lightLock.svg' class='lockIcon'>"
        }
        // If unlocked...
        else if (lockState[x] == false){
            // Display light unlocked icon
            lockArr[x].innerHTML = "<img src = 'resources/lightUnlock.svg' class='lockIcon'>"
        };
    }
    // If background is light...
    else if (between(lvals[x], 50, 100)){
        // Make colour code dark
        colourLabels[x].style.color = "#011627";
        // Make svg fills dark
        copyIconArr[x][0].style.fill = "#011627";
        editIconArr[x][0].style.fill = "#011627"; // make pencil svg fill dark
        // Set gradual colour change
        copyIconArr[x][0].style.transitionDuration = "0.5s";
        editIconArr[x][0].style.transitionDuration = "0.5s";
        // For the lock icons...
        // If locked...
        if(lockState[x] == true){
            // Display dark locked icon
            lockArr[x].innerHTML = "<img src = 'resources/darkLock.svg' class='lockIcon'>";
        }
        // If unlocked...
        else if (lockState[x] == false){
            // Display dark unlocked icon
            lockArr[x].innerHTML = "<img src = 'resources/darkUnlock.svg' class='lockIcon'>";
        };
    };
};
// Command Center: changing the colours
function changeColour(){
    // Clear relevant arrays
    clearArr();
    // Generate base hues
    baseHueGen();
    // Generate HSLstrings for the base hues
    hslString(0, hue1, sat1, lvals1);
    hslString(1, hue2, sat2, lvals2);
    hslString(2, hue3, sat3, lvals3);
    // Loop through all swatches
    for (x in Swatches){
        // Ensure colour is not locked
        if (lockState[x]==false){
            // Change swatch background colour (background[x] to HSL value [x])
            Swatches[x].style.backgroundColor = HSLstringsArray[x];
            // Generate rgbStrings from the HSL values
            rgbString();
            // Change chart colours
            chartCol(); // backgrounds
            bdrCol(); // borders
            // Change label text colour based on the background of the swatch
            optCol(x);
            // Convert rgbString to a hex code
            let hexCode = rgbToHex(rgbVal[x][0], rgbVal[x][1], rgbVal[x][2]);
            // Change colour code to read the hex code
            colourLabels[x].innerHTML = hexCode;
            // Add a space in front of hexCode & put into codesArr (for #allCodes textarea)
            codesArr[x]=(" " + hexCode);
        }
    };
    // Show hex colour codes in #allCodes textarea
    allCodes.innerHTML = codesArr;
    // Update charts for changes to show
    updateChart();
};

// Get changeBtn
let changeBtn = document.getElementById("changeBtn");
// Add eventListener to changeBtn for changeColour() and lockAllError()
changeBtn.addEventListener("click", function(){changeColour(), lockAllError()});

// ---------- CODE FOR CHARTS ----------
// --- preparation for exporting charts as images
// Empty array to push base64 strings of charts
const chartImgData = [];

// --- chart set-up

// Labels for x-axis
let xLabels = ["", "", "", "", ""];

// Datasets (dummy, random numbers)
let data1 = [1, 3, 4, 5, 1];
let data2 = [2, 5, 6, 1, 5];
let data3 = [6, 10, 5, 8, 2];
let data4 = [7, 6, 2, 5, 3];
let data5 = [3, 0, 9, 8, 4];
// Combining 5 arrays into 1 variable while preserving original array format
let allData = [data1, data2, data3, data4, data5];

// --- declaring charts

// linechart
let lnPrvw = new Chart("lnPrvw", { 
type: "line",
data: {
    // Put the variable storing x-axis labels here
    labels: xLabels,
    datasets: [
        // for each line, add this object "template" (source: classwork resources)
        {
            data: data1,
            label: "",
            borderColor: "",
            fill: false
        },
        { 
            data: data2,
            label: "",
            borderColor: "",
            fill: false
        },
        { 
            data: data3,
            label: "",
            borderColor: "",
            fill: false
        },
        { 
            data: data4,
            label: "",
            borderColor: "",
            fill: false
        },
        { 
            data: data5,
            label: "",
            borderColor: "",
            fill: false
        },
        ]
    },
    options:{
        // Make chart square (source: cmd-f "square" https://www.chartjs.org/docs/latest/getting-started/usage.html)
        aspectRatio: 1,
        // Hide x & y axes of the chart (source: https://www.chartjs.org/docs/latest/axes/)
        scales:{
            x:{
                display: false, // hide x-axis
            },
            y:{
                display: false, // hide y-axis
            }
        },
        plugins:{
            legend:{
                display: false
            },
        },
        animation: {
            // Code to help with exporting image of chart (source: https://github.com/chartjs/Chart.js/issues/2743)
            // When animation is completed...
            onComplete: function(){
                // Get base64 string of this chart image (source: https://www.simplilearn.com/tutorials/javascript-tutorial/javascript-this-keyword)
                let imgData = this.toBase64Image();
                // Push base64 string to imgData array
                chartImgData.push(imgData);
            },
        },
    },
});

// bar chart
let barPrvw = new Chart("barPrvw", {
    type: "bar",
    data: {
        // Put the variable storing x-axis labels here
        labels: xLabels,
        datasets: [
            // for each line, add this object "template" (source: classwork resources)
            {
                data: data3,
                label: "",
                borderWidth: 2,
                borderColor: [],
                borderRadius: 10.20,
                backgroundColor: ["pink", "red", "green", "blue", "yellow"]
            },
            ]
        },
        options:{
            // Make chart square (source: cmd-f "square" https://www.chartjs.org/docs/latest/getting-started/usage.html)
            aspectRatio: 1,
            // Hide x & y axes of the chart (source: https://www.chartjs.org/docs/latest/axes/)
            scales:{
                x:{
                    display: false, // hide x-axis
                },
                y:{
                    display: false, // hide y-axis
                }
            },
            plugins:{
                legend:{
                    display: false
                }
            },
            animation: {
                // Code to help with exporting image of chart (source: https://github.com/chartjs/Chart.js/issues/2743)
                // When animation is completed...
                onComplete: function(){
                    // Get base64 string of this chart image (source: https://www.simplilearn.com/tutorials/javascript-tutorial/javascript-this-keyword)
                    let imgData = this.toBase64Image();
                    // Push base64 string to imgData array
                    chartImgData.push(imgData);
                },
            },
        }
    });

// pie chart
let piePrvw = new Chart("piePrvw", {
    type: "pie",
    data: {
        // Put the variable storing x-axis labels here
        labels: xLabels,
        datasets: [
            // for each line, add this object "template" (source: classwork resources)
            {
                data: data1,
                label: "",
                borderColor: [],
                backgroundColor: ["pink", "red", "green", "blue", "yellow"]
            },
            ]
        },
        options:{
            // Make chart square (source: cmd-f "square" https://www.chartjs.org/docs/latest/getting-started/usage.html)
            aspectRatio: 1,
            plugins:{
                legend:{
                    display: false
                }
            },
            animation: {
                // Code to help with exporting image of chart (source: https://github.com/chartjs/Chart.js/issues/2743)
                // When animation is completed...
                onComplete: function(){
                    // Get base64 string of this chart image (source: https://www.simplilearn.com/tutorials/javascript-tutorial/javascript-this-keyword)
                    let imgData = this.toBase64Image();
                    // Push base64 string to imgData array
                    chartImgData.push(imgData);
                },
            },
        },
    });

// doughnut chart
let donutPrvw = new Chart("donutPrvw", {
        // British spelling reminder
        type: "doughnut",
        data: {
            labels: xLabels, // put the variable storing x-axis labels here
            datasets: [
                // for each line, add this object "template" (source: classwork resources)
                {
                    data: data3,
                    label: "",
                    borderColor: [],
                    backgroundColor: ["pink", "red", "green", "blue", "yellow"]
                },
                ]
            },
            options:{
                // Make chart square (source: cmd-f "square" https://www.chartjs.org/docs/latest/getting-started/usage.html)
                aspectRatio: 1,
                plugins:{
                    legend:{
                        display: false
                    }
                },
                animation: {
                    // Code to help with exporting image of chart (source: https://github.com/chartjs/Chart.js/issues/2743)
                    // When animation is completed...
                    onComplete: function(){
                        // Get base64 string of this chart image (source: https://www.simplilearn.com/tutorials/javascript-tutorial/javascript-this-keyword)
                        let imgData = this.toBase64Image();
                        // Push base64 string to imgData array
                        chartImgData.push(imgData);
                    },
                },
            },
        });

// polar area chart
let polarPrvw = new Chart("polarPrvw", {
        type: "polarArea",
        data: {
            labels: xLabels, // put the variable storing x-axis labels here
            datasets: [
                // for each line, add this object "template" (source: classwork resources)
                {
                    data: data3,
                    label: "",
                    borderColor: [],
                    backgroundColor: ["pink", "red", "green", "blue", "yellow"]
                },
                ]
            },
            options:{
                // Make chart square (source: cmd-f "square" https://www.chartjs.org/docs/latest/getting-started/usage.html)
                aspectRatio: 1,
                // Hide axes on chart (source: https://www.chartjs.org/docs/latest/axes/radial/)
                scales:{
                    r:{
                        ticks:{
                            display: false,
                        },
                        grid:{
                            color:"#757474",
                        }
                    }
                },
                plugins:{
                    legend:{
                        display: false
                    }
                },
                animation: {
                    // Code to help with exporting image of chart (source: https://github.com/chartjs/Chart.js/issues/2743)
                    // When animation is completed...
                    onComplete: function(){
                        // Get base64 string of this chart image (source: https://www.simplilearn.com/tutorials/javascript-tutorial/javascript-this-keyword)
                        let imgData = this.toBase64Image();
                        // Push base64 string to imgData array
                        chartImgData.push(imgData);
                    },
                },
            },
        });

// bubble chart
let bubblePrvw = new Chart("bubblePrvw", {
        type: "bubble",
        data: {
            labels: xLabels, // put the variable storing x-axis labels here
            datasets: [
                // for each line, add this object "template" (source: classwork resources)
                {
                    data: [{
                        // x: where on the x-axis, y: where on the y-axis, r: radius of bubble
                        x: data1[0],
                        y: data3[0],
                        r: 10
                    },
                    {
                        x: data1[1],
                        y: data3[1],
                        r: 14
                    },
                    {
                        x: data1[2],
                        y: data3[2],
                        r: 20
                    },
                    {
                        x: data1[3],
                        y: data3[3],
                        r: 12
                    },
                    {
                        x: data1[4],
                        y: data3[4],
                        r: 16
                    },
                    ],
                    label: "",
                    borderColor: [],
                    backgroundColor: ["pink", "red", "green", "blue", "yellow"]
                },
                ]
            },
            options:{
                // Make chart square (source: cmd-f "square" https://www.chartjs.org/docs/latest/getting-started/usage.html)
                aspectRatio: 1,
                // Hide x & y axes of the chart (source: https://www.chartjs.org/docs/latest/axes/)
                scales:{
                    x:{
                        display: false, // hide x-axis
                    },
                    y:{
                        display: false, // hide y-axis
                    }
                },
                plugins:{
                    legend:{
                        display: false
                    },
                },
                animation: {
                    // Code to help with exporting image of chart (source: https://github.com/chartjs/Chart.js/issues/2743)
                    // When animation is completed...
                    onComplete: function(){
                        // Get base64 string of this chart image (source: https://www.simplilearn.com/tutorials/javascript-tutorial/javascript-this-keyword)
                        let imgData = this.toBase64Image();
                        // Push base64 string to imgData array
                        chartImgData.push(imgData);
                    },
                },
            },
        });

// --- Randomise Datasets

// Randomise data for charts that only use 1 dataset (all except line & bubble charts)
/**
 * Randomise data for charts that only use 1 dataset
 *
 * @param {string} chartName Name of the chart we are randomising data for
 * @param x The index of lockArr (source: https://www.w3schools.com/jsref/jsref_foreach.asp)
 * @return Set data of that chart's datasets to new random data
 */
function oneDataset(chartName){
    // Generate a random value between 1 - 10
    // randomUp returns non-zero value between 1 - 10
    let newData = [randomUp(0,10), randomUp(0,10), randomUp(0,10), randomUp(0,10), randomUp(0,10)];
    // Set the chart's data to the array of newData
    chartName.data.datasets[0].data = newData;
}

// Command center for #randBtn: generate random datasets for all charts
function randomise(){
    // Generate random data for linechart
    // Loop through each dataset in linechart to set new array in .data
    for (let x = 0; x < lnPrvw.data.datasets.length; x++){
        lnPrvw.data.datasets[x].data = [randomUp(1,11), randomUp(1,11), randomUp(1,11), randomUp(1,11), randomUp(1,11)]
    }
    // Generate random data for bar, pie, doughnut, polar area charts
    oneDataset(barPrvw);
    oneDataset(piePrvw);
    oneDataset(donutPrvw);
    oneDataset(polarPrvw);
    // Generate random data for bubble chart
    // Create an array of radius values to choose from
    let bubbleRad = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28];
    // Generate random values for x, y, r properties of data objects in bubble chart
    for (let x = 0; x < bubblePrvw.data.datasets[0].data.length; x++){
        bubblePrvw.data.datasets[0].data[x].x = randomUp(1,11);;
        bubblePrvw.data.datasets[0].data[x].y = randomUp(1,11);;
        bubblePrvw.data.datasets[0].data[x].r = bubbleRad[randomUp(1, 11)];
    };
    // Update the charts to show new values
    updateChart();
};

// Get randBtn
let randBtn = document.getElementById("randBtn");
// Add event listener
randBtn.addEventListener("click", function(){randomise()});

// --- Reset Datasets
// Reset data for charts that only use 1 dataset (all except line & bubble charts)
function resetOne(chartName, dataX){
    chartName.data.datasets[0].data = dataX;
}

// Command center for #resetBtn: reset to starting data
function reset(){
    // For linechart
    for (let x = 0; x < lnPrvw.data.datasets.length; x++){
        lnPrvw.data.datasets[x].data = allData[x];
    }
    // For bar, pie, doughnut, polar area charts
    resetOne(barPrvw, data3);
    resetOne(piePrvw, data1);
    resetOne(donutPrvw, data3);
    resetOne(polarPrvw, data3);
    // Create array with original values for bubble chart radii
    let bubbleRad = [10, 14, 20, 12, 16];
    // Reset bubble chart x, y, r properties in data object
    for (let x = 0; x < bubblePrvw.data.datasets[0].data.length; x++){
        bubblePrvw.data.datasets[0].data[x].x = data1[x];
        bubblePrvw.data.datasets[0].data[x].y = data3[x];
        bubblePrvw.data.datasets[0].data[x].r = bubbleRad[x];
    };
    updateChart();
};

// Get resetBtn
let resetBtn = document.getElementById("resetBtn");
// Add eventListener to resetBtn
resetBtn.addEventListener("click", function(){reset()});

// ---------- CODE EXPORTING CHART IMAGES ----------

// --- checkbox code (feature to select specific charts to download)

// Get the checkboxes
// select all option
const allDl = document.getElementById("allDl");
// specific charts options
const lnDl = document.getElementById("lnDl");
const barDl = document.getElementById("barDl");
const pieDl = document.getElementById("pieDl");
const donutDl = document.getElementById("donutDl");
const polDl = document.getElementById("polarDl");
const bubbleDl = document.getElementById("bubbleDl");

// Store all Dl checkboxes in an array (easier to code repetitive actions)
const checkboxArr = [lnDl, barDl, pieDl, donutDl, polDl, bubbleDl];

// Command Center: tick/untick all checkboxes when the #allDl clicked 
// (source: https://www.w3schools.com/howto/howto_js_display_checkbox_text.asp)
function selectAll(){
    // When allDl is checked...
    if (allDl.checked == true){
        // Loop through all checkboxes for specific charts
        for(let x = 0; x < checkboxArr.length; x++){
            // Tick them too
            checkboxArr[x].checked = true;
        };
    }
    // When allDl is unchecked...
    else if (allDl.checked == false){
        // Loop through all checkboxes for specific charts
        for(let x = 0; x < checkboxArr.length; x++){
            // Untick them too
            checkboxArr[x].checked = false;
        };
    };
};

// Add EventListener to select all checkbox
allDl.addEventListener("click", function(){selectAll()});

// --- Downloading (image data for each chart is stored in imgData)
// source: https://stackoverflow.com/questions/4405336/how-to-copy-contents-of-one-canvas-to-another-canvas-locally

// Create a new canvas that will hold all the images
let exportCanvas = document.createElement("canvas");
// Set width & height of canvas (source: https://www.educative.io/answers/how-to-add-an-id-to-element-in-javascript)
// Use setAttribute(), style won't work (source: https://stackoverflow.com/questions/15793702/drawing-image-on-canvas-larger-than-real)
exportCanvas.setAttribute("width", 1080); // set width to 1080
exportCanvas.setAttribute("height", 720); // set height to 720
// Get the context of this new canvas
let ctx = exportCanvas.getContext("2d"); 

// Create empty array to push chartImgs when created
const chartImgArr = [];

// Using promises was recommended by ChatGPT to ensure all images load together

// Create an array of promises
// Each image that has to be loaded will add a new promise object to promises
const promises = [];

// Promise chain to load the chart images into exportCanvas
function loadChartImgs(){
    // Make counter to track how many charts (used to determine whether to move to new row on exportCanvas)
    let counter = -1;
    // Clear arrays
    chartImgArr.length = 0;
    promises.length = 0;
    // Loop through the checkboxes...
    for (let x = 0; x < checkboxArr.length; x++){
        // If checkbox for a chart is ticked...
        if (checkboxArr[x].checked == true){
            // Declare a promise
            const promise = new Promise ((resolve, reject) => {
                // asynchronous action goes here: 
                // Declare a new Image called chartImg
                let chartImg = new Image;
                // Make sure image loads (source: https://stackoverflow.com/questions/8404937/drawing-multiple-images-on-one-canvas)
                chartImg.onload = () => resolve(chartImg);
                // If chartImg does not load, put this error message in console
                chartImg.onerror = () => reject("chartImg did not load");
                // Tell code where to get image data for chartImg
                chartImg.src = chartImgData[x];
                // Push chartImg into chartImgArr so it can be accessed later on in promise chain
                chartImgArr.push(chartImg);
            })
            // Use the promise
            // Once chartImg has loaded...
            promise.then((result) => {
                // Add 1 to the counter for every chart ticked
                counter += 1;
            })
            .then((result) => {
                // Then draw chartImg in ctx (of exportCanvas)
                // If it is one of the first 3 charts...
                if (counter <= 2){
                    // Set the chart y-coord to upper row
                    ctx.drawImage(chartImgArr[counter], 360 * counter, 0, 360, 360);
                }
                // If it is one of the last 3 charts...
                else if (counter >= 3){
                    // Set the chart y-coord to lower row
                    ctx.drawImage(chartImgArr[counter], 360 * (counter-3), 360, 360, 360);
                };
            })
            .catch(error => { // To tell me where in the promise chain did the error occur
                console.error(error);
            })
            // Push each promise into promises
            promises.push(promise);
        };
    };
};

// Command Center: for #download, downloading the file
function download(){
    // Clear exportCanvas (source: https://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing)
    ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    // Clear downloadLink link reference (to prevent downloading of previous chart)
    downloadLink.setAttribute("href", "#");
    // Load the chart images
    loadChartImgs();
    // Check that all promises have been fulfilled (i.e. all images have been loaded) (source: chatGPT)
    // Create a variable storing Promise.all(promises)
    // Promise.all(promises) checks that all the promises pushed into the array were fulfilled (i.e. all the chartImgs loaded)
    const allImgsLoaded = Promise.all(promises);
    // If all chartImgs are loaded, then...
    allImgsLoaded.then((result)=> { 
        // Generate dataURL from exportCanvas for download (source: source: https://www.sanwebe.com/snippet/downloading-canvas-as-image-dataurl-on-button-click)
        let img = exportCanvas.toDataURL("image/png", 0.1); // png image, max quality
        console.log("images have loaded");
        return img;
    })
    // Pass on the value of img
    .then((img)=> {
        // Set the reference of downloadLink to the image dataURL
        downloadLink.setAttribute("href", img);
        // Download a file named myCharts (source: https://www.w3schools.com/tags/att_a_download.asp)
        downloadLink.setAttribute("download", "myCharts");
        console.log("link is set");
    })
    // --- Click the downloadLink programmatically when checkboxes are clicked  (source: https://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript)
    .then((result) =>{
        // Needed because the user click activates the image loading, not the actual download (source: chatGPT recommendation)
        downloadLink.click();
    })
    .catch((err) => {console.log(err)}); // check for errors
};

//--- Get HTML elements needed
// Get <a> wrapped around #download
const downloadLink = document.getElementById("downloadLink");

// Get the download button html element
let downloadBtn = document.getElementById("download");

// Call download() when #download clicked
downloadBtn.addEventListener("click", function(){download()});

// --- Keeping downloads updated
// Reload chartImgs when colour of charts are changed
changeBtn.addEventListener("click", loadChartImgs());

// /** Loading the chartImgs immediately when checkbox is ticked
//  *
//  *
//  * @param checkbox The checkbox HTML element from checkBoxArr.
//  * @param x The index of checkboxArr (source: https://www.w3schools.com/jsref/jsref_foreach.asp)
//  */
// checkboxArr.forEach((checkbox, x)=>{
//     // When checkbox tick changes...
//     checkbox.addEventListener("change", event =>{
//         // Load the images if checked
//         loadChartImgs(x);
//     });
// });

// ---------- COPY PASTING COLOUR CODES ----------
// library used: https://clipboardjs.com

// Get all .copy buttons to attach clipboard eventListener
let copyBtns = document.getElementsByClassName("copy");
// Pass copyBtns collection through ClipboardJS
let clipboard = new ClipboardJS(copyBtns);
// ELEPHANT find a way to do user feedback
function copyCol(){
    copyBtns.innerHTML = "copied!";
};


// ---------- RESPONSIVE STYLING ----------

// --- #swatchBox height = #ctrlPanel height for screens with width < 768px
// Get #swatchBox element (column with the colours)
let swatchBox = document.getElementById("swatchBox");
// Get #ctrlPanel element (column with the options)
let ctrlPanel = document.getElementById("ctrlPanel");

// Command Center to test viewport size, calculate & reset dimensions
function windowRespond(){
    // Test viewport width (source: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth)
    // If viewport is < 768...
    if (window.innerWidth < 768){
        // Get height of ctrlPanel
        // offsetWidth = margin + border + padding + content (source: https://www.javascripttutorial.net/javascript-dom/javascript-width-height/)
        let ctrlPanelHt = ctrlPanel.offsetHeight;
        // Set swatchBox height = ctrlPanel height
        swatchBox.style.height = ctrlPanelHt + "px"; // must add + "px"
    }
    // If viewport is 768 or more...
    // else if is important in event that user resizes browser window from <768 to >768
    else if(window.innerWidth >= 768){
        // Set swatchBox height to 90vh (total viewport height is 100vh, header = 10vh)
        swatchBox.style.height = "90vh";
    };
}

// Call windowRespond() onload
windowRespond();
// Listen for window resizing events (source: https://stackoverflow.com/questions/641857/javascript-window-resize-event)
window.addEventListener("resize", function(){windowRespond()});

// --- optBtn height = optBtn width, while optBtn width = 20%

// Get optBtnWidth
// Do this outside function so that it can be accessed for other things like svg viewbox later
function optBtnWidth(){
    // Specify one particular button out of the array, all of them have equal widths so I just pick the first one
    let optBtnWidth = optBtnArr[0].offsetWidth;
    return optBtnWidth;
};

// Command Center: set height of optBtn to = width
function optBtnHt(){
    // Loop through all the optBtns...
    for (let x = 0; x < optBtnArr.length; x++){
        // Set the height for each optBtn to = optBtnWidth
        optBtnArr[x].style.height = optBtnWidth() + "px"; // add "px" otherwise won't work
    };
};
// Call optBtnHt() onload
optBtnHt();
// Listen for window resize to recalculate optBtn height
window.addEventListener("resize", function(){optBtnHt()});

// --- Show background for optBtn on hover
// Do this in JS instead of CSS because want to change colour based on swatch, but JS can't access CSS pseudostates

/** Loop through optBtn elements & apply eventListener (source: https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/)
 * .querySelectorAll returns all elements that matches the class optBtn (source: https://www.w3schools.com/jsref/met_document_queryselectorall.asp)
 * forEach iterates over each .optBtn item and applies the EventListener to it
 * must put ".optBtn" not "optBtn" (source: https://forum.freecodecamp.org/t/mouseover-mouseout-not-working/202846/4)
 * 
 * @param {string[]} item The .optBtn
 * @param {number} index index of the .optBtn being iterated over (source: https://www.w3schools.com/jsref/jsref_foreach.asp)
 */
document.querySelectorAll(".optBtn"). forEach((item, index) => {
    // When the .optBtn is moused over, do... (source: https://www.w3schools.com/jsref/event_onmouseover.asp)
    item.addEventListener("mouseover", event => {
        // Create an array with lightness values for each generated colour repeated 3 times
        const lvals = [lvals1[0], lvals1[0], lvals1[0], lvals1[1], lvals1[1], lvals1[1], lvals2[0], lvals2[0], lvals2[0], lvals2[1], lvals2[1], lvals2[1], lvals3[0], lvals3[0], lvals3[0]]
        // If background is dark...
        if (between(lvals[index], 0, 50)){
            // Change the .optBtn bg color to light
            item.style.backgroundColor = "rgba(255, 249, 245, 0.2)";
        }
        // If background is light...
        else {
            // Change the .optBtn bg color to dark
            item.style.backgroundColor = "rgba(1, 22, 39, 0.2)";
        }
        // Gradual colour change
        item.style.transitionDuration = "0.5s";
    });
    // When cursor leaves .optBtn...
    item.addEventListener("mouseout", event => {
        // Set background of .optBtn to no colour
        item.style.backgroundColor = "transparent";
        // Gradual colour change
        item.style.transitionDuration = "0.5s";
    });
});

// ALWAYS LAST: call changeColour once when page is loaded. put at the end so it can access everything it needs.
changeColour();