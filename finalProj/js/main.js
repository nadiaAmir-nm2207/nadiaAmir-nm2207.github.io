// CODE FOR SVGs
// steps for drawing Raphael icons (source: https://code.tutsplus.com/tutorials/an-introduction-to-the-raphael-js-library--net-7186) they're different versions, but picked up some scraps of info here and there and then just trial and error
// illustrator to rapahel guide (source: https://snugug.com/musings/illustrator-to-raphael-js-guide/)
// 1. create the area to put the SVG (directions source: https://alistapart.com/article/svg-with-a-little-help-from-raphael/)
// let copyIconPaper = Raphael("copy1", 40, 40);
// let copyIconPath = copyIconPaper.path("m26.97,41.5h-15.47c-5.52,0-10-4.48-10-10v-15.15c0-5.52,4.48-10,10-10h15.47c5.52,0,10,4.48,10,10v15.15c0,5.52-4.48,10-10,10Zm9.97-5.54c2.69-1.21,4.55-3.9,4.55-7.01V9.2c0-4.25-3.48-7.7-7.77-7.7H13.8c-3.49,0-6.44,2.27-7.42,5.41m3.06,10.03h19.58m-19.58,6.99h19.58m-19.58,6.99h11.56"); // paper.path(string).attr({})
// copyIconPath.attr({
//     stroke: "#000000",
//     "stroke-width": 3, // any property in documentation with a dash must be put in ""
//     })
// copyIconPaper.setViewBox(0.5, 0.5, 50, 50, true); // source: https://stackoverflow.com/questions/11176396/how-can-i-scale-raphael-js-elements-on-window-resize-using-jquery

// CODE FOR THE LOCKS

// 1. get the lock buttons from the html
let lock1 = document.getElementById("lock1");
let lock2 = document.getElementById("lock2");
let lock3 = document.getElementById("lock3");
let lock4 = document.getElementById("lock4");
let lock5 = document.getElementById("lock5");

// 2. store the locked state data to be accessed by the colourChange loop later therfore create an object property for the lockState of each lock
let lockState = [false, false, false, false, false];

// 3. create a function to be called when the lock icon is pressed
function lock(lock, x){ // lock: variable storing the html element | x: index of the corresponding object in lockState
    // test whether the lock is locked or unlocked by referring to lockState
    if(lockState[x] == true){ // i.e. if lock is locked
        lockState[x] = false; // then unlock it
        lock.innerHTML = "&#x1f513;"; // and display unlocked emoji
        // console.log(lockState[x].locked); // works – expected false
    }
    else if (lockState[x] == false){ // i.e. if lock is unlocked
        lockState[x] = true; // then lock it
        lock.innerHTML = "&#128274;"; // and display locked emoji
        // console.log(lockState[x].locked); // works – expected true
    }
}

function unlockAll(){ // used to unlock all the colours with a click of one button
    lockState = [false, false, false, false, false];
    // have to also change the innerHTMl to the unlock icon, otherwise the icon remains the locked one while the colour is actually unlocked
    lock1.innerHTML = "&#x1f513;";
    lock2.innerHTML = "&#x1f513;";
    lock3.innerHTML = "&#x1f513;";
    lock4.innerHTML = "&#x1f513;";
    lock5.innerHTML = "&#x1f513;";
}

function lockAll(){ // used to unlock all the colours with a click of one button
    lockState = [true, true, true, true, true];
    // have to also change the innerHTMl to the unlock icon, otherwise the icon remains the locked one while the colour is actually unlocked
    lock1.innerHTML = "&#128274;";
    lock2.innerHTML = "&#128274;";
    lock3.innerHTML = "&#128274;";
    lock4.innerHTML = "&#128274;";
    lock5.innerHTML = "&#128274;";
}

function lockAllError(){
    alert("please unlock a colour");
}

// adding the eventListeners
lock1.addEventListener("click", function(){lock(lock1, 0)}); // index starts from 0
lock2.addEventListener("click", function(){lock(lock2, 1)});
lock3.addEventListener("click", function(){lock(lock3, 2)});
lock4.addEventListener("click", function(){lock(lock4, 3)});
lock5.addEventListener("click", function(){lock(lock5, 4)});
document.getElementById("unlock").addEventListener("click", function(){unlockAll()});
document.getElementById("lockAll").addEventListener("click", function(){lockAll()});

// CODE FOR DARK MODE LIGHT MODE – put before the changeColour functions because i might need to access mode value to determine range for lightness value generation
let modeBtn = document.getElementById("modeBtn"); // get the div element of the modeBtn
let mode = false; // true if light mode, false if dark mode

// get HTML elements of charts
let lnChartBg = document.getElementById("lnPrvw");

// function for changes when modeBtn clicked
function changeMode(){
    if (mode == true){ // if mode is true, i.e. in light mode
        mode = false; // reassign value to false i.e. dark mode
        modeBtn.innerHTML = "&#9728; light bg"; // change the text to read light mode instead of dark mode (text option always opposite of the current mode)
        document.getElementById("chartPrvws").style.backgroundColor = "#011627";
        return mode;
    }
    else if (mode == false){ // if mode is false, i.e. in dark mode
        mode = true; // reassign value to true i.e. light mode
        modeBtn.innerHTML = "&#9790; dark bg"; // change the text to read dark mode instead of light mode (text option always opposite of the current mode)
        document.getElementById("chartPrvws").style.backgroundColor = "#fff9f5";
        return mode;
    }
    console.log(mode);
}
// eventlistener for modeBtn
modeBtn.addEventListener("click", function(){changeMode()});

// CODE FOR COLOUR CHANGER
// ELEMENTS TARGETED FOR COLOUR CHANGING
// the div element I want to change colours of are those with class "swatch"
// document.getElementsByClassName("swatch") will return a collection of "swatch" div elements
// this collection is ONLY array-like, not an actual array
// usually will start getting Uncaught TypeError: Cannot set properties of undefined (setting 'backgroundColor') when trying to alter CSS properties
// so must use Array.from to convert it to an actual array to get rid of that error (explanation found from https://bobbyhadz.com/blog/javascript-cannot-set-property-color-of-undefined)
// we use const so that we cannot reassign the value – helps to prevent accidental changes later on
const Swatches = Array.from(document.getElementsByClassName("swatch")); // these are the colour palette rectangles
const colourLabels = Array.from(document.getElementsByClassName("colourLabel")); // these are for the text in the colour palette rectangles
const hue1 = Array.from(document.getElementsByClassName("hue1"));
const hue2 = Array.from(document.getElementsByClassName("hue2"));
const hue3 = Array.from(document.getElementsByClassName("hue3"))
const baseHueDivs = Array.from(document.getElementsByClassName("baseHue")); // these are for base hues
const baseHueArray = []; // to store only UNIQUE base hue values
const HSLstringsArray = []; // to store HSL strings
const lvals1 = []; // to store lightness values (separate hue1 & hue2)
const lvals2 = []; // to store lightness values (separate hue1 & hue2)
const lvals3 = []; // to store lightness values (separate hue1 & hue2)
const sat1 = []; // to store saturation values of each generated colour
const sat2 = []; // to store saturation values of each generated colour
const sat3 = []; // to store saturation values of each generated colour
const rgbVal = []; // use to push rgb strings

// BASIC FUNCTIONS
// clear arrays
function clearArr(){
    HSLstringsArray.length = 0; // clear the HSLstringsArray each time the fn called (i.e. when button clicked)
    lvals1.length = 0; // clear lvals each time fn called, otherwise will just stack
    lvals2.length = 0;
    lvals3.length = 0;
    sat1.length = 0; // clear array when fn called
    sat2.length = 0; // clear array when fn called
    sat3.length = 0;
    rgbVal.length = 0;
}

// update charts AHAHAHAHAHA I DID IT!! EXCUSE THE UNPROFESSIONAL EXCITEMENT BUT THIS IS THE KEY the chart has to be "regenerated" for the colour changes in the function to show since this function has to come after the chart is declared (otherwise cannot access the properties)
// source: https://www.chartjs.org/docs/latest/developers/updates.html
function updateChart(){
    lnPrvw.update();
    barPrvw.update();
    piePrvw.update();
    donutPrvw.update();
    polarPrvw.update();
    bubblePrvw.update();
}

// BASIC MATHS FUNCTIONS
 
// generate random values, adapted from the Colour Palette Extra Practice
function random(min, max){
    let x = min;
    let y = max;
    let range = y - x; // "from where to where" should Math.random generate from
    return Math.floor(Math.random() * range);
}

// generate random values that round up (to prevent 0 values, needed for chart data randomisation)
function randomUp(min, max){
    let x = min;
    let y = max;
    let range = y - x; // "from where to where" should Math.random generate from
    return Math.ceil(Math.random() * range); // Math.ceil rounds up while Math.floor rounds down
}

// test if hue falls between 2 values (source: https://stackoverflow.com/questions/6454198/check-if-a-value-is-within-a-range-of-numbers)
function between(hue, min, max){
    return hue >= min && hue <= max
}

// get the value to "circle back" if the sum with a constant exceeds the maximum
function circleBack(base, max, x){ // base: base value, max: maximum value, x: constant that is added/subtracted
    // 1. get the sum
    let newVal  = base + x;
    // 2. test if newVal > max
    if (newVal > max){
        // 3. circle back
        newVal -= max;
    }
    return newVal;
}

// FORMULAS

// CONVERT HSLtoRGB (formula explanation: https://www.had2know.org/technology/hsl-rgb-color-converter.html)
function hslrgb(h, s1, l1){
    // kept getting massive numbers for the rgb, did more digging and realised you need to make sure your s & l are /100
    // divided hue by 360 at first but after looking at the source again, realise don't have to
    let s = s1/100;
    let l = l1/100;
    // formula start – I don't really understand the maths fully but I tried my best to "translate" it into js and it seems accurate so far!
    let d = s * (1 - Math.abs(2*l - 1)); // in the site, it says |2L - 1| which I assume is modulus. Math.abs is the js equivalent for that (source: https://www.educative.io/answers/how-to-convert-negative-numbers-to-positive-numbers-in-javascript)
    let m = 255 * (l - 1/2 * d);
    let x = d * (1 - Math.abs((h/60)%2 - 1)); // in the site, it ssays (H/60)mod_2, which means getting remainder when h/60 is divided by 2. the js equivalent of this is %2
    // preparing variables for rgb values
    let r = 0;
    let g = 0;
    let b = 0;
    if (0 <= h && h < 60){
        r = Math.floor(255 * d + m); // include Math.floor to round to nearest integer. not in the site but just something i learned from working with rgb conversions previously.
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
    return [r, g ,b]; // reason for returning as an object is explained in labelText(), around line 236
};

// CONVERT RGB TO HEX (source: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb)
// steps to convert rgb to hex are:
// 1. convert component by component (r, then g, then b)
function componentToHex(c) {
    // 2. get the whole number & the remainder of component / 16
    let hex = c.toString(16);
    // 3. remainder * 16, if 10 = A, 11 = B and so on until 15 = F (source: https://appkong.com/tools/hex-to-rgb/)
    return hex.length == 1 ? "0" + hex : hex;
    };

// 4. concatenate R, G, B values together to form #xxxxxx
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

// COLOUR CHANGE ALGORITHM

// 1. generate random base hues
function hueGen(){
    return random(0, 360); // returns a random value between 0 & 360
    };

// 2. test individual base hue if they are red or green
function testHue(hue){
    if (between (hue, 0, 10)){ // testing for red
        let red = true;
        // console.log(red); // this works
        return red;
    }
    else if (between (hue, 100, 130)){ // testing for green
        let green = true;
        // console.log(green); // this works
        return green;
    }
    else{
        let redGreen = false;
        // console.log(redGreen); // this works
        return redGreen;
    }
};

// 3. compare the 2 base hues to test if it is a red-green combination
function compareHue(hue1, hue2, hue3){
    if (testHue(hue1) == true && testHue(hue2) == true){ // if hue1 is red and hue2 is green or vice versa, return true
        return true;
    }
    else if (testHue(hue2) == true && testHue(hue3) == true) { // if hue2 is red and hue3 is green or vice versa, return true
        return true;
    }
    else if (testHue(hue1) == true && testHue(hue3) == true){ // if hue1 is red and hue3 is green or vice versa, return true
        return true;
    }
    else {
        return false;
    }
};

// 4. combine steps 1 - 3 to generate 2 base Hues that are not red & green together
function baseHueGen(){
    baseHueArray.length = 0; // clears the array and breaks the recursion
    // part a) generate 2 base hues
    let newHue1 = hueGen(); // generates a new random hue value for each element in baseHueDivs
    baseHueArray.push(newHue1); // pushes this new random hue value into another array called baseHueArray
    let newHue2 = circleBack(newHue1, 360, 137); // generates contrasting hue for second base hue via golden angle 137˚
    baseHueArray.push(newHue2); // pushes second hue into array as well
    // console.log(newHue2);
    let newHue3 = circleBack(newHue2, 360, 137); // generates another hue value for third hue
    // console.log(newHue3);
    baseHueArray.push(newHue3); // pushes third hue into array as well
    // part b) test if the hues in the array are in the ranges of forbidden combinations
    if (compareHue(baseHueArray[0], baseHueArray[1], baseHueArray[2]) == true){ // this is why I pushed the new hues into another array – so that I can access them here
        // console.log("combination not allowed"); // works – expected print different statements depending on whether colours are in red & green ranges
        baseHueGen(); // repeat the generation process if the combination is forbidden
    }
}

// 5. function to generate a base saturation value
function satValGen(){
    return 10 + random(0, 50); // random saturation values, max addition = 40 .: max here should be 100 - 40 = 60, 60 - 10 = 50
    };

// 6. function to make sure subsequent saturation values are spaced from each other
function satGen(hueArray, satArray){ // array to be replace by hue1 or hue2 to determine how many times the for loop should run
    let newSat = satValGen(); // random saturation for base
    satArray.push(newSat);
    for (let i = 0; i < hueArray.length - 1; i++){ // for loop runs as many times as the number of items in the array - 1 (bc the first one is set in newSat)
        newSat = circleBack(newSat, 100, random(20, 40)); // make sure each saturation generated is spaced out from each other
        console.log(newSat);
        satArray.push(newSat);
    }
};

// 7. function to generate base lightness value – random lightness value depending on whether light or dark mode is selected
function ltValGen(){
    if (mode == true){ // if light mode
        let ltVal = 10 + random(10, 70); // return a lightness value that is at least 10, 10 + random(0, 70) so max = 80. start from 10 because starting from 0 gives black.
        return ltVal; 
    }
    else if (mode == false){ // if dark mode
        let ltVal = 30 + random(0, 50); // return a lightness value between 50 - 90 i.e. lighter colours. cap at 80 because of the circleback fn later on that stacks on the base lightness value. this ensures the max stack of +10 lightness will still <= 100
        // have to use 50 + random(0,50) because the random(min, max) only defines the range, not where the number stands between min & max. random(0, 50) has the same range as random(50, 100) which will just give you 0 < x < 1 * 50 i.e. numbers below 50. in order to get numbers that fall in the range above 50, have to add the 50 to it.
        return ltVal;
    }
};

// 8. function to make sure subsequent lightness values are spaced from each other
function lightGen(hueArray, lvalsArray){ // lvalsArray refers to which either lvals1 or lvals2
    let newLi = ltValGen(); // random base lightness value (based on whether bg is light or dark)
    lvalsArray.push(newLi);
    for (let i = 0; i < hueArray.length - 1; i++){ // for loop runs as many times as the number of items in the array - 1 (bc the first one is set in newLi)
        newLi = circleBack(newLi, 100, 10 + random(0, 10)); // make sure each lightness generated is spaced out from each other by at least 10 (max 10 + 10 = 20)
        lvalsArray.push(newLi);
    }
};

// 9. function combining steps 1 - 6: generates saturation & lightness values based on their base hue
function satLightGen(hueArray, satArray, lvalsArray){ // generating 2 arrays of 5 values each for saturation & lightness values respectively
    satGen(hueArray, satArray);
    lightGen(hueArray, lvalsArray);
    // expected by this point, 5 saturation values in svals & 5 lightness values in lvals
};

// 10. string the HSL values together and push it into an array
function hslString(y, hueArray, satArray, lvalsArray){ // y is a number 0, 1 or 2 for the HSL values for hue1, hue2 or hue 3 respectively | hueArray is for hue1 and hue2 respectively
    satLightGen(hueArray, satArray, lvalsArray); // generate 2 arrays of 5 values each for saturation & lightness values respectively
    for (x in hueArray){
        //console.log("lvals[x] in hslString are" + lvals);
        // for xth colour, give it H: value of yth base hue, S: xth saturation, L: xth lightness
        // (baseHueArray[y] + (x * constant)) so that the hue value increases by constant each swatch for a little more variation
        let newHSLstring = "hsl(" + (baseHueArray[y] + (x*10)) + ", " + satArray[x] + "%, " + lvalsArray[x] + "%)";
        HSLstringsArray.push(newHSLstring); // expected 5 HSL strings in HSLstringsArray
    }
};

// 11. Create the rgbString from the hsl values. This rgb string will be used to do scaling (to get darker version of the colour for borders, for example) and for conversion to hex code
function rgbString(){ // function that creates rgbString
    const hues = [baseHueArray[0], baseHueArray[0], baseHueArray[1], baseHueArray[1], baseHueArray[2]]; // to get an array of the 5 base hues
    // console.log(hues);
    const sat = sat1.concat(sat2).concat(sat3); // to get an array of all 5 saturation values
    // console.log(sat);
    const lvals = lvals1.concat(lvals2).concat(lvals3); // to get an array of all 5 lightness values
    // console.log(lvals);
    let rgb = hslrgb(hues[x], sat[x], lvals[x]); // convert the hsl to rgb for the [r, g, b]
    rgbVal[x] = rgb;
    // console.log(rgb);
    // my colours & arrays are correct
};

// 12. Based on the generated colour, change the colours on the chart
function chartCol(){
    lnPrvw.data.datasets[x].borderColor = HSLstringsArray[x]; // change the line colour of the xth linegraph dataset to the xth HSL string
    barPrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; // have to direct it to datasets[0] specifically for it to change bar bg colours
    piePrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; // have to direct it to datasets[0] specifically for it to change pie segment bg colours
    donutPrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; // have to direct it to datasets[0] specifically for it to change donut segment bg colours
    polarPrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; // have to direct it to datasets[0] specifically for it to change polar area segment bg colours
    bubblePrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; // have to direct it to datasets[0] specifically for it to change bubble bg colours
};

// 13. Based on the generated colour, change the colour of the border for the swatch
function bdrCol(){ // to change the border of swatches & relevant charts
    // changing borders of swatches & piechart: adding a factor to RGB values makes them darker – smaller factors = darker colours source: https://stackoverflow.com/questions/6615002/given-an-rgb-value-how-do-i-create-a-tint-or-shade
    Swatches[x].style.borderColor = "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")";
    barPrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")"; // border for bar chart
    piePrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")"; // border for pie chart
    donutPrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")"; // border for donut chart
    polarPrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")"; // border for polar area chart
    bubblePrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.5 * rgbVal[x][0] + ", " + 0.5 * rgbVal[x][1] + ", " +  0.5 * rgbVal[x][2] + ")"; // border for bubble chart
};

// 14. Based on the swatch background (i.e. the generated colour), test for what font color to use for colourLabels
function labelCol(x){
    const lvals = lvals1.concat(lvals2).concat(lvals3); // store lightness values (altogether, needed for the labelCol fn to be able to loop through the arrays easier) | source of concat() https://www.w3schools.com/jsref/jsref_concat_array.asp
    // console.log(lvals + "in labelcol");
    if (between(lvals[x], 0, 50)){ // if lightness of the background is between 0 - 50 i.e. a dark colour
        colourLabels[x].style.color = "#ffffff"; // make the label colour white
    }
    else if (between(lvals[x], 50, 100)){ // if lightness of the background is between 50 - 100 i.e. a bright colour
        colourLabels[x].style.color = "#000000"; // make the label colour black
    }
};

// FINAL BOSS: actually changing everything
function changeColour(){
    // 1. clear relevant arrays
    clearArr();
    // 2. generate base hues
    baseHueGen();
    // 3. generate HSLstrings for the base hues (hue1 & hue2)
    hslString(0, hue1, sat1, lvals1);
    hslString(1, hue2, sat2, lvals2);
    hslString(2, hue3, sat3, lvals3);
    // console.log(HSLstringsArray); // works – expected: 5 HSL strings    
    // 4. start a loop through all the div elements with the class="swatch" and are .: in the Swatches array
    for (x in Swatches){
        if (lockState[x]==false){ // 5. make sure the colour is not locked before changing it
            // 6. change the background changing the swatches
            Swatches[x].style.backgroundColor = HSLstringsArray[x]; // change the background color of the xth Swatches element to the xth HSL value stored in HSLstringsArray
            rgbString(); // 7. generate rgbStrings from the HSL values
            chartCol(); // 8. change chart colours
            labelCol(x); // 9. change label text colour based on the background of the swatch
            // 10. change the rgbString (from step 7) to a hex code + change the colourLabel text to read the hex code
            colourLabels[x].innerHTML = rgbToHex(rgbVal[x][0], rgbVal[x][1], rgbVal[x][2]); // change the text of the xth colourLabels element to the xth rgbToHex value – this is why i had hslrgb() return an object – so that I can separate the r, g, b values to convert to hex
            // 11. change border colours
            bdrCol();
        }
    };
    updateChart(); // 12. updating the charts so that the changes show
}

// RGB TO HEX FUNCTIONS: to convert RGB values to HEX for nicer presentation of colour codes
// formula function from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
// steps to convert rgb to hex are:
// 1. convert component by component (r, then g, then b)
function componentToHex(c) {
    // 2. get the whole number & the remainder of component / 16
    let hex = c.toString(16);
    // 3. remainder * 16, if 10 = A, 11 = B and so on until 15 = F (read from https://appkong.com/tools/hex-to-rgb/)
    return hex.length == 1 ? "0" + hex : hex;
}

// concatenate R, G, B values together to form #xxxxxx
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// CODE FOR THE CHARTS

// labels for x-axis
let xLabels = ["", "", "", "", ""];

// datasets (random numbers)
let data1 = [1, 3, 4, 5, 1];
let data2 = [2, 5, 6, 1, 5];
let data3 = [6, 10, 5, 8, 2];
let data4 = [7, 6, 2, 5, 3];
let data5 = [3, 0, 9, 8, 4];
let allData = [data1, data2, data3, data4, data5]; // combining the 5 arrays into 1 variable while preserving the original array format (unlike if we used .concat())

let lnPrvw = new Chart("lnPrvw", { // I decided to put the chart into a variable because without that, I'm very confused as to how to refer to the borderColor
type: "line",
data: {
    labels: xLabels, // put the variable storing x-axis labels here
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
        aspectRatio: 1, // this makes the chart square (source: cmd-f "square" https://www.chartjs.org/docs/latest/getting-started/usage.html)
        scales:{ // the following code hides the x & y axes of the chart (source: https://www.chartjs.org/docs/latest/axes/)
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
        }
    }
});

let barPrvw = new Chart("barPrvw", {
    type: "bar",
    data: {
        labels: xLabels, // put the variable storing x-axis labels here
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
            aspectRatio: 1,
            scales:{ // the following code hides the x & y axes of the chart (source: https://www.chartjs.org/docs/latest/axes/)
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
            }
        }
    });

let piePrvw = new Chart("piePrvw", { // I decided to put the chart into a constant because without that, I'm very confused as to how to refer to the borderColor
    type: "pie",
    data: {
        labels: xLabels, // put the variable storing x-axis labels here
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
            aspectRatio: 1,
            plugins:{
                legend:{
                    display: false
                }
            }
        }
    });

let donutPrvw = new Chart("donutPrvw", { // I decided to put the chart into a constant because without that, I'm very confused as to how to refer to the borderColor
        type: "doughnut", // it's the british spelling, i put the american one and it broke lol
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
                aspectRatio: 1,
                plugins:{
                    legend:{
                        display: false
                    }
                }
            }
        });

let polarPrvw = new Chart("polarPrvw", { // I decided to put the chart into a constant because without that, I'm very confused as to how to refer to the borderColor
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
                aspectRatio: 1,
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
                }
            }
        });

let bubblePrvw = new Chart("bubblePrvw", { // I decided to put the chart into a constant because without that, I'm very confused as to how to refer to the borderColor
        type: "bubble",
        data: {
            labels: xLabels, // put the variable storing x-axis labels here
            datasets: [
                // for each line, add this object "template" (source: classwork resources)
                {
                    data: [{
                        x: data1[0], // x: where on the x-axis, y: where on the y-axis, r: radius of bubble
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
                aspectRatio: 1,
                scales:{ // the following code hides the x & y axes of the chart (source: https://www.chartjs.org/docs/latest/axes/)
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
                }
            }
        });


        // to generate randomised data values
function oneDataset(chartName){ // general function for bar, pie, polar area & doughnut charts as they all use 1 dataset
    let newData = [randomUp(1,11), randomUp(1,11), randomUp(1,11), randomUp(1,11), randomUp(1,11)]; // use 2,10 instead of 1,10 because with 1,10 some combinations lead to Math.floor rounding down to 0. Don't want to change to Math.ceil in random() because I need the 0 values for other areas where I use random() e.g. when generating hues
    chartName.data.datasets[0].data = newData;
}

function randomise(){ // to generate random datasets, between 1 - 10
// for linechart
    for (x in lnPrvw.data.datasets){
        lnPrvw.data.datasets[x].data = [randomUp(1,11), randomUp(1,11), randomUp(1,11), randomUp(1,11), randomUp(1,11)]
    }
    // for bar, pie, doughnut, polar area charts
    oneDataset(barPrvw);
    oneDataset(piePrvw);
    oneDataset(donutPrvw);
    oneDataset(polarPrvw);
    // for bubble chart
    let bubbleRad = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28]; // for bigger radius
    for (x in bubblePrvw.data.datasets[0].data){
        bubblePrvw.data.datasets[0].data[x].x = randomUp(1,11);; // have to target the x, y, r properties specifically
        bubblePrvw.data.datasets[0].data[x].y = randomUp(1,11);;
        bubblePrvw.data.datasets[0].data[x].r = bubbleRad[randomUp(1, 11)];
    };
    updateChart(); // if don't update, won't use new values
}

// eventListener for randomise()
let randBtn = document.getElementById("randBtn"); // get randBtn
randBtn.addEventListener("click", function(){randomise()});

// to generate randomised data values
function resetOne(chartName, dataX){ // general function for bar, pie, polar area & doughnut charts as they all use 1 dataset
    chartName.data.datasets[0].data = dataX;
}

function reset(){ // to reset back to starting data
    // for linechart
    for (x in lnPrvw.data.datasets){
        lnPrvw.data.datasets[x].data = allData[x];
    }
    // for bar, pie, doughnut, polar area charts
    resetOne(barPrvw, data3);
    resetOne(piePrvw, data1);
    resetOne(donutPrvw, data3);
    resetOne(polarPrvw, data3);

    let bubbleRad = [10, 14, 20, 12, 16]; // original values for bubble chart radii
    // bubble chart
    for (x in bubblePrvw.data.datasets[0].data){
        bubblePrvw.data.datasets[0].data[x].x = data1[x]; // have to target the x, y, r properties specifically
        bubblePrvw.data.datasets[0].data[x].y = data3[x];
        bubblePrvw.data.datasets[0].data[x].r = bubbleRad[x];
    };
    updateChart(); // update chart
}

// eventListener for reset()
let resetBtn = document.getElementById("resetBtn"); // get the resetBtn html element
resetBtn.addEventListener("click", function(){reset()});
 
// event listener so that changeColour() is called when the button (changeBtn) is clicked
let changeBtn = document.getElementById("changeBtn");
changeBtn.addEventListener("click", function(){changeColour()});

// call changeColour once when page is loaded
changeColour();

// COPY PASTE FEATURES
// how to use clipboardjs (source: https://clipboardjs.com)
// 1. get all the html elements you want to attach the clipboard eventListener to
let copyBtns = document.getElementsByClassName("copy");
let clipboard = new ClipboardJS(copyBtns); // 2. pass the collection through
// 3. function to change copy to copied! when text is copied as user feedback
function copyCol(){
    copyBtns.innerHTML = "copied!";
};

// copyBtns.addEventListener("click", function(){copyCol()});

// EXPORT OPTIONS
// 1. get the elements for the checkbox
let allDl = document.getElementById("allDl");
let lnDl = document.getElementById("lnDl");
let barDl = document.getElementById("barDl");
let pieDl = document.getElementById("pieDl");
let donutDl = document.getElementById("donutDl");
let polDl = document.getElementById("polarDl");
let bubbleDl = document.getElementById("bubbleDl");
let checkOptions = [lnDl, barDl, pieDl, donutDl, polDl, bubbleDl]; // store all the Dl checkboxes in an array so that can use in for loop (easier to code repetitive actions)

// 2. function that will tick/untick all checkboxes when the select all checkbox is clicked
function selectAll(){
    if (allDl.checked == true){ // i.e. checked. clicking it unchecks it.
        for(x in checkOptions){
            checkOptions[x].checked = true; // check them too – same as allDl.checked because they are happening together, not alternating
        }
    }
    else if (allDl.checked == false){ // i.e. allDl unchecked
        for(x in checkOptions){
            checkOptions[x].checked = false; // uncheck them too
        }
    }
};

allDl.addEventListener("click", function(){selectAll()});

// 2. write download function
// 2a. write function for if condition with xDl variable as parameter (xDl refers to the constant storing the various Dl checkboxes)
function ifCheck(xDl){
    if (xDl.check == true){
        // then do what to export & download
    }
};

function download(){
    // combine all the ifCheck(xDl) for each Dl option
};

// 3. get the download button html element
let downloadBtn = document.getElementById("download");

// 4. add eventListener to downloadBtn to call download() when clicked
downloadBtn.addEventListener("click", function(){download()});


// CODE TO HELP RESPONSIVE STYLING

// I want to set #swatchBox height to #ctrlPanel height for screens with width < 768px
// 1. get #swatchBox element (column with the colours)
let swatchBox = document.getElementById("swatchBox");
// 2. get #ctrlPanel element (column with the options)
let ctrlPanel = document.getElementById("ctrlPanel");
// 3. write the function test viewport width <720px
function windowRespond(){
    if (window.innerWidth < 768){ // test the viewport width (source: https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth)
        // 4. get height of ctrlPanel
        let ctrlPanelHt = ctrlPanel.offsetHeight; // offsetWidth = margin + border + padding + content (source: https://www.javascripttutorial.net/javascript-dom/javascript-width-height/)
        // 5. set swatchBox height = ctrlPanel height
        swatchBox.style.height = ctrlPanelHt + "px"; // must add + "px" otherwise it will only be replaced as the number
        console.log(ctrlPanelHt);
        console.log(swatchBox.style.height);
    }
    else if(window.innerWidth >= 768){ // for screens at or bigger than minimum
        swatchBox.style.height = "90vh"; // set the swatchBox to 90vh so that don't have to scroll (total viewport height is 100vh, header already takes 10vh)
    }
}
// 4. activate the windowRespond() function
// 4a. for screens <720 px onload
windowRespond();
// 4b. for screens resized
window.addEventListener("resize", function(){windowRespond()});

// I want to set the height of optBtn to = width while width = 20%
// 1. get optBtn html element array
let optBtn = Array.from(document.getElementsByClassName("optBtn"));
// 2. write function that will set the height of optBtn to = width
function optBtnHt(){
    // 3. get width of optBtn
    // have to specify one particular button out of the array
    // all of them have the same width so I just pick the first one in the array
    let optBtnWidth = optBtn[0].offsetWidth;
    console.log(optBtnWidth);
    // 4. loop through all the optBtns (i.e. through the array)
    for (x in optBtn){
        // 5. set the height for each optBtn to = optBtnWidth
        optBtn[x].style.height = optBtnWidth + "px"; // add "px" otherwise won't work
    }
}
// 6. call optBtnHt() it onload
optBtnHt();
// 7. listen for window resize to recalculate the numbers
window.addEventListener("resize", function(){optBtnHt()});