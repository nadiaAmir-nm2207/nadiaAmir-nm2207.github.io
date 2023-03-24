// global variables
 // initialise at 0 outside function so that it doesn't get set to 0 every time the button is pressed
let gradClickCounter = 0;

// elements I wish to target for colour changing
        // the div element I want to change colours of are those with class "swatch"
        // document.getElementsByClassName("swatch") will return a collection of "swatch" div elements
        // this collection is ONLY array-like, not an actual array
        // usually will start getting Uncaught TypeError: Cannot set properties of undefined (setting 'backgroundColor') when trying to alter CSS properties
        // so must use Array.from to convert it to an actual array to get rid of that error (explanation found from https://bobbyhadz.com/blog/javascript-cannot-set-property-color-of-undefined)
        // we use const so that we cannot reassign the value – helps to prevent accidental changes later on
        const Swatches = Array.from(document.getElementsByClassName("swatch"));
        const colourLabels = document.getElementsByClassName("colourLabel"); // returns COLLECTION of rgb colourLabel class paragraphs. We don't need Array.from here because we're not touching CSS properties


// MATHS FUNCTIONS

// COUNTER FUNCTION: so that after a certain number of times the button is clicked, the random RGB values refresh
    // this is needed because after about 3 clicks, the gradients appear to repeat themselves (rgb values slightly different, but visually very similar), probably because of the scaling function going up and down
    // the only way to refresh the random RGB values WITHOUT a counter is to reload the page, which is very hassle
function gradientCycle(){
    gradClickCounter += 1;
    if (gradClickCounter%3 == 0){ // this condition means "if gradClickCounter when divided by 3 has a remainder of 0, activate code". This is how I detect if the button has been pressed 3 times for a particular set of randomised RGB values
       changeColour();
    }
 }

// RANDOM FUNCTION: to generate random values, adapted from the Colour Palette Extra Practice
function random(min, max){
    let x = min;
    let y = max;
    let range = y - x; // "from where to where" should Math.random generate from
    return Math.floor(Math.random() * range); // Math.floor converts it to an integer value (important as we are using this to generate RGB values)
 }

// SCALING FUNCTION: makes the numbers go up and then down, also adapted from the Colour Palette Extra Practice
function scaling(RGBvalue){
    let scaleV = 0;
    // input a value it has to scale
    // max = 255, min = 0

    // sin function takes in a value
    // sin function returns a value between -1 and 1
    let sinValue = Math.sin(RGBvalue);
    // can change this value into a value between 0 - 255
    xMax = 255;
    xMin = 0;

    // y is sin function range
    let yMax = 1;
    let yMin = -1;
    let percent = (sinValue - yMin) / (yMax - yMin);
    scaleV = percent * (xMax - xMin) + xMin;

    // return a value between 0 & 255
    return Math.floor(scaleV); //Math.floor for pretty integers
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

// CODE FOR THE CHART PREVIEW

// labels for x-axis
let xLabels = ["x1", "x2", "x3", "x4", "x5"];

// For drawing the lines
let data1 = [1, 3, 4, 5, 1];
let data2 = [2, 5, 6, 1, 5];
let data3 = [6, 10, 5, 8, 2];
let data4 = [7, 6, 2, 5, 3];
let data5 = [3, 0, 9, 8, 4];

let chartPreview = new Chart("chartPreview", { // I decided to put the chart into a constant because without that, I'm very confused as to how to refer to the borderColor
    type: "line",
    data: {
        labels: xLabels, // put the variable storing x-axis labels here
        datasets: [
            // for each line, add this object "template"
            {
                data: data1,
                label: "data1",
                borderColor: "",
                fill: false
            },
            { 
                data: data2,
                label: "data2",
                borderColor: "",
                fill: false
              },
              { 
                data: data3,
                label: "data3",
                borderColor: "",
                fill: false
              },
              { 
                data: data4,
                label: "data4",
                borderColor: "",
                fill: false
              },
              { 
                data: data5,
                label: "data5",
                borderColor: "",
                fill: false
              },
        ]
    }
});



// fn that changes colours for gradient generator – put this at the end so all the required variables are initialised
function changeColour() {
    // Step 1. add to counter
    gradientCycle();
    let scaleR = random(0, 255); // random(0, 255) generates a random value between 0 - 255 for scaleR, scaleG and scaleB respectively
    let scaleG = random(0, 255);
    let scaleB = random(0, 255);

    // Step 2. loop through Swatches (array of divs with class="swatch" so that I change their colours one by one)
    // I don't think I can use forEach for this because it also involves the chartPreview.data.datasets[x].borderColor and the random values generated for the colours are local variables, so splitting them into 2 blocks
    for (let x in Swatches){
        // necessary to get R, G, B values to increase per swatch (I tried doing +=100 as part of scaling() but it resulted in all the swatches having the same colour)
        scaleR += 100; // in the Colour Palette Exercise, this was 50. I changed it to 100 for more contrast between colours.
        scaleG += 100;
        scaleB += 100;
        // scaling all the new RGB values
        let scaledR = scaling(scaleR);
        let scaledG = scaling(scaleG);
        let scaledB = scaling(scaleB);
    
        // Step 3. (still within the loop) change CSS properties & innerHTML of relevant elements e.g. backgroundColor of "swatch", colourLabel
        let newRgbString = "RGB(" + scaledR + ", " + scaledB + ", " + scaledG + ")";
        //console.log(newRgbString);

        // this part is to change the colour of the swatch border
        // adding a factor to RGB values makes them darker – smaller factors = darker colours – from: https://stackoverflow.com/questions/6615002/given-an-rgb-value-how-do-i-create-a-tint-or-shade
        let darkerString = "RGBA(" + 3/4 * scaledR + ", " + 3/4 * scaledB + ", " +  3/4 * scaledG + ")";

        // put the new RGB string into the CSS
        Swatches[x].style.backgroundColor = newRgbString;
        Swatches[x].style.border = "1px solid " + darkerString;
        
        // put the new RGB string into the properties for the chart
        chartPreview.data.datasets[x].borderColor = newRgbString;
        chartPreview.update(); // AHAHAHAHAHA I DID IT!! EXCUSE THE UNPROFESSIONAL EXCITEMENT BUT THIS IS THE KEY the chart has to be "regenerated" for the colour changes in the function to show since this function has to come after the chart is declared (otherwise cannot access the properties)
        // ^^ this piece of code came from https://www.chartjs.org/docs/latest/developers/updates.html
    
        //console.log(chartPreview.data.datasets[x].borderColor);
        
        // display hex code for each colour on each swatch
        // don't have to do another for loop because x here will match Palette[x] and colourLabels[x]
        // if run another for loop, it will get stuck on just looping the first colourLabel
        colourLabels[x].innerHTML = rgbToHex(scaledR, scaledG, scaledB);
    }
}

// CODE INVOLVING CHANGECOLOUR()

changeColour(); // so that a random palette is generated on load

// event listener so that changeColour() is called when the button (changeBtn) is clicked
let changeBtn = document.getElementById("changeBtn");
changeBtn.addEventListener("click", function(){changeColour()})

// testing assigning colour
    console.log(chartPreview.data.datasets[0].borderColor);
    chartPreview.data.datasets[0].borderColor = "";
    console.log(chartPreview.data.datasets[0].borderColor);
