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

// storing all the lock buttons into their own variables
let lock1 = document.getElementById("lock1");
let lock2 = document.getElementById("lock2");
let lock3 = document.getElementById("lock3");
let lock4 = document.getElementById("lock4");
let lock5 = document.getElementById("lock5");

// for the locked state data to be accessed by the colourChange loop later, I will need to have it stored in an object property
// 1. Create an object property for the lockState of each lock
let lockState = [false, false, false, false, false];

function lock(lock, x){ // lock: variable storing the html element | x: index of the corresponding object in lockState
    if(lockState[x] == true){ // i.e. when lock is locked
        lockState[x] = false; // unlock it
        lock.innerHTML = "&#x1f513;"; // unlocked emoji
        // console.log(lockState[x].locked); // works – expected false
    }
    else if (lockState[x] == false){ // i.e. when lock is unlocked
        lockState[x] = true; // lock it
        lock.innerHTML = "&#128274;"; // locked emoji
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
let mode = true; // true if light mode, false if dark mode

// get HTML elements of charts
let lnChartBg = document.getElementById("lnPrvw");

// function for changes when modeBtn clicked
function changeMode(){
    if (mode == true){ // if mode is true, i.e. in light mode
        mode = false; // reassign value to false i.e. dark mode
        modeBtn.innerHTML = "&#9728; light bg"; // change the text to read light mode instead of dark mode (text option always opposite of the current mode)
        document.getElementById("previews").style.backgroundColor = "#011627";
        return mode;
    }
    else if (mode == false){ // if mode is false, i.e. in dark mode
        mode = true; // reassign value to true i.e. light mode
        modeBtn.innerHTML = "&#9790; dark bg"; // change the text to read dark mode instead of light mode (text option always opposite of the current mode)
        document.getElementById("previews").style.backgroundColor = "#fff9f5";
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
const baseHueDivs = Array.from(document.getElementsByClassName("baseHue")); // these are for base hues
const baseHueArray = []; // to store only UNIQUE base hue values
const HSLstringsArray = []; // to store HSL strings
const lvals1 = []; // to store lightness values (separate hue1 & hue2)
const lvals2 = []; // to store lightness values (separate hue1 & hue2)
const sat1 = []; // to store saturation values of each generated colour
const sat2 = []; // to store saturation values of each generated colour
const rgbVal = []; // use to push rgb strings

// BASIC FUNCTIONS
// clear arrays
function clearArr(){
    HSLstringsArray.length = 0; // clear the HSLstringsArray each time the fn called (i.e. when button clicked)
    lvals1.length = 0; // clear lvals each time fn called, otherwise will just stack
    lvals2.length = 0;
    sat1.length = 0; // clear array when fn called
    sat2.length = 0; // clear array when fn called
    rgbVal.length = 0;
}

// update charts AHAHAHAHAHA I DID IT!! EXCUSE THE UNPROFESSIONAL EXCITEMENT BUT THIS IS THE KEY the chart has to be "regenerated" for the colour changes in the function to show since this function has to come after the chart is declared (otherwise cannot access the properties)
// source: https://www.chartjs.org/docs/latest/developers/updates.html
function updateChart(){
    lnPrvw.update();
    barPrvw.update();
    piePrvw.update();
}

// BASIC MATHS FUNCTIONS
 
// generate random values, adapted from the Colour Palette Extra Practice
function random(min, max){
    let x = min;
    let y = max;
    let range = y - x; // "from where to where" should Math.random generate from
    return Math.floor(Math.random() * range);
}

// random hue
function hueGen(){
    return random(0, 360); // returns a randm value between 0 & 360
    }
    
// random S & B values (0 - 100)
function satValGen(){
    return random(0, 100);
    }

function ltValGen(){
    if (mode == true){ // if light mode
        let ltVal = random(0, 60); // return a lightness value between 0 - 60 i.e. darker colours. max after the stacking later will be 80.
        return ltVal; 
    }
    else if (mode == false){ // if dark mode
        let ltVal = 30 + random(0, 50); // return a lightness value between 50 - 90 i.e. lighter colours. cap at 80 because of the circleback fn later on that stacks on the base lightness value. this ensures the max stack of +10 lightness will still <= 100
        // have to use 50 + random(0,50) because the random(min, max) only defines the range, not where the number stands between min & max. random(0, 50) has the same range as random(50, 100) which will just give you 0 < x < 1 * 50 i.e. numbers below 50. in order to get numbers that fall in the range above 50, have to add the 50 to it.
        return ltVal;
    }
};

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

// CONVERTERS

// HSLtoRGB (formula explanation: https://www.had2know.org/technology/hsl-rgb-color-converter.html)
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

// TEST FORMULA: light blue, hsl(188, 33, 74), rgb(165, 204, 210), hex #A5CCD2
// console.log(hslrgb(188, 33, 74)); // expected 165, 204, 210. got 166, 204, 210. +/-1 is okay because the colour still quite similar

// rgb to hex
// RGB TO HEX FUNCTIONS: to convert RGB values to HEX for nicer presentation of colour codes
// formula function from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
// steps to convert rgb to hex are:
// 1. convert component by component (r, then g, then b)
function componentToHex(c) {
    // 2. get the whole number & the remainder of component / 16
    let hex = c.toString(16);
    // 3. remainder * 16, if 10 = A, 11 = B and so on until 15 = F (source: https://appkong.com/tools/hex-to-rgb/)
    return hex.length == 1 ? "0" + hex : hex;
    }

// concatenate R, G, B values together to form #xxxxxx
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// TESTS

// test all the hues
function testHue(hue){
    if (between (hue, 0, 30)){ // testing for red
        let red = true;
        // console.log(red); // this works
        return red;
    }
    else if (between (hue, 90, 150)){ // testing for green
        let green = true;
        // console.log(green); // this works
        return green;
    }
    else{
        let redGreen = false;
        // console.log(redGreen); // this works
        return redGreen;
    }
}

// test hues against each other to see if they are combination of red and green
function compareHue(hue1, hue2){
    if (testHue(hue1) == true && testHue(hue2) == true){ // if hue1 is red or green and hue2 is red or green, return true
        return true;
    }
    else {
        return false;
    }
}


// 1. generate 2 base Hues that are not red & green together
function baseHueGen(){
    baseHueArray.length = 0; // clears the array and breaks the recursion
    // part a) generate 2 base hues
    let newHue1 = hueGen(); // generates a new random hue value for each element in baseHueDivs
    baseHueArray.push(newHue1); // pushes this new random hue value into another array called baseHueArray
    let newHue2 = circleBack(newHue1, 360, 137); // generates contrasting hue for second base hue via golden angle 137˚
    baseHueArray.push(newHue2); // pushes second hue into array as well
    // console.log(baseHueArray); // works – expect 2 numbers
    // part b) test if the hues in the array are in the ranges of forbidden combinations
    if (compareHue(baseHueArray[0], baseHueArray[1]) == true){ // this is why I pushed the new hues into another array – so that I can access them here
        // console.log("combination not allowed"); // works – expected print different statements depending on whether colours are in red & green ranges
        baseHueGen(); // repeat the generation process if the combination is forbidden
    }
}

// 2. function that generate saturations that are spaced from each other
function satGen(hueArray, satArray){ // array to be replace by hue1 or hue2 to determine how many times the for loop should run
    let newSat = satValGen(); // random saturation for base
    satArray.push(newSat);
    for (let i = 0; i < hueArray.length - 1; i++){ // for loop runs as many times as the number of items in the array - 1 (bc the first one is set in newSat)
        newSat = circleBack(newSat, 100, 30); // make sure each saturation generated is spaced out from each other
        satArray.push(newSat);
    }
}

// 3. function that generates lightness values that are spaced from each other
function lightGen(hueArray, lvalsArray){ // lvalsArray refers to which either lvals1 or lvals2
    let newLi = ltValGen(); // random saturation for base
    lvalsArray.push(newLi);
    for (let i = 0; i < hueArray.length - 1; i++){ // for loop runs as many times as the number of items in the array - 1 (bc the first one is set in newLi)
        newLi = circleBack(newLi, 100, 10); // make sure each lightness generated is spaced out from each other
        lvalsArray.push(newLi);
    }
}

// 4. make a function that generates saturation & lightness values
function satLightGen(hueArray, satArray, lvalsArray){ // generating 2 arrays of 5 values each for saturation & lightness values respectively
    satGen(hueArray, satArray);
    lightGen(hueArray, lvalsArray);
    // expected by this point, 5 saturation values in svals & 5 lightness values in lvals
}

// 5. string the different values together and push it into an array
function hslString(y, hueArray, satArray, lvalsArray){ // y is a number 0 or 1 for the HSL values for hue1 or hue2 respectively | hueArray is for hue1 and hue2 respectively
    satLightGen(hueArray, satArray, lvalsArray); // generate 2 arrays of 5 values each for saturation & lightness values respectively
    for (x in hueArray){
        //console.log("lvals[x] in hslString are" + lvals);
        // for xth colour, give it H: value of yth base hue, S: xth saturation, L: xth lightness
        // (baseHueArray[y] + (x * constant)) so that the hue value increases by constant each swatch for a little more variation
        let newHSLstring = "hsl(" + (baseHueArray[y] + (x*20)) + ", " + satArray[x] + "%, " + lvalsArray[x] + "%)";
        HSLstringsArray.push(newHSLstring); // expected 5 HSL strings in HSLstringsArray
    }
}

// 6. test what the background is and which font color to use for colourLabels
function labelCol(x){
    const lvals = lvals1.concat(lvals2); // store lightness values (altogether, needed for the labelCol fn to be able to loop through the arrays easier) | source of concat() https://www.w3schools.com/jsref/jsref_concat_array.asp
    // console.log(lvals + "in labelcol");
    if (between(lvals[x], 0, 50)){ // if lightness is between 0 - 50 i.e. a dark colour
        colourLabels[x].style.color = "#ffffff"; // make the label colour white
    }
    else if (between(lvals[x], 50, 100)){ // if lightness is between 50 - 100 i.e. a bright colour
        colourLabels[x].style.color = "#000000"; // make the label colour black
    }
}

function chartCol(){ // since I have so many charts now, separate out the code
    lnPrvw.data.datasets[x].borderColor = HSLstringsArray[x]; // change the line colour of the xth linegraph dataset to the xth HSL string
    barPrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; // have to direct it to datasets[0] specifically for it to change bar bg colours
    piePrvw.data.datasets[0].backgroundColor[x] = HSLstringsArray[x]; // have to direct it to datasets[0] specifically for it to change pie segment bg colours
};

function bdrCol(){ // to change the border of swatches & relevant charts
    // changing borders of swatches & piechart: adding a factor to RGB values makes them darker – smaller factors = darker colours source: https://stackoverflow.com/questions/6615002/given-an-rgb-value-how-do-i-create-a-tint-or-shade
    Swatches[x].style.borderColor = "rgb(" + 0.75 * rgbVal[x][0] + ", " + 0.75 * rgbVal[x][1] + ", " +  0.75 * rgbVal[x][2] + ")";
    barPrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.75 * rgbVal[x][0] + ", " + 0.75 * rgbVal[x][1] + ", " +  0.75 * rgbVal[x][2] + ")"; // border for bar chart
    piePrvw.data.datasets[0].borderColor[x]= "rgb(" + 0.75 * rgbVal[x][0] + ", " + 0.75 * rgbVal[x][1] + ", " +  0.75 * rgbVal[x][2] + ")"; // border for pie chart
}

function rgbString(){ // function that creates 
    const hues = [baseHueArray[0], baseHueArray[0], baseHueArray[1], baseHueArray[1], baseHueArray[1]]; // to get an array of the 5 base hues
    const sat = sat1.concat(sat2); // to get an array of all 5 saturation values
    const lvals = lvals1.concat(lvals2); // to get an array of all 5 lightness values
    let rgb = hslrgb(hues[x], sat[x], lvals[x]); // convert the hsl to rgb for the [r, g, b]
    rgbVal[x] = rgb;
}

// FINAL STEP: function that changes the colours
function changeColour(){
    clearArr(); // clear arrays
    // 1. get the baseHues
    baseHueGen();

    // 2. generate HSLstrings for hue1 & hue2
    hslString(0, hue1, sat1, lvals1);
    hslString(1, hue2, sat2, lvals2);
    // console.log(HSLstringsArray); // works – expected: 5 HSL strings    

    for (x in Swatches){ // for all the div elements with the class="swatch" and are .: in the Swatches array
        if (lockState[x]==false){ // to test if the colour should be changed or not
            // changing the swatches
            Swatches[x].style.backgroundColor = HSLstringsArray[x]; // change the background color of the xth Swatches element to the xth HSL value stored in HSLstringsArray
            rgbString(); // generate rgbStrings from the HSL values
            chartCol(); // change chart colours
            labelCol(x); // function to change label text colour based on the background of the swatch
            colourLabels[x].innerHTML = rgbToHex(rgbVal[x][0], rgbVal[x][1], rgbVal[x][2]); // change the text of the xth colourLabels element to the xth rgbToHex value – this is why i had hslrgb() return an object – so that I can separate the r, g, b values to convert to hex
            bdrCol();
        }
    };
    updateChart(); // updating the charts
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

// CODE FOR THE CHART PREVIEWS

// labels for x-axis
let xLabels = ["", "", "", "", ""];

// For drawing the lines
let data1 = [1, 3, 4, 5, 1];
let data2 = [2, 5, 6, 1, 5];
let data3 = [6, 10, 5, 8, 2];
let data4 = [7, 6, 2, 5, 3];
let data5 = [3, 0, 9, 8, 4];

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
            plugins:{
                aspectRatio: 1,
                legend:{
                    display: false
                }
            }
        }
    });
 
// event listener so that changeColour() is called when the button (changeBtn) is clicked
let changeBtn = document.getElementById("changeBtn");
changeBtn.addEventListener("click", function(){changeColour()})

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
}

// copyBtns.addEventListener("click", function(){copyCol()});