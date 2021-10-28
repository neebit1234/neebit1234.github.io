//Data set for sleep, coding and revision across 7 days
let dataSet = [
    [7, 8, 7, 6, 6, 10, 8],
    [4, 4, 2, 2, 0, 3, 6],
    [1, 1, 4, 5, 6, 2, 3]
];

//Headers and labels for above data
let dataHeader = ["Day", "Sleep", "Coding", "Revision"];
let dataLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//Produces an array of colors for each data category
function randomColors(data) {
    let colorsArray = [];
    for (activity of data) {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        colorsArray.push("rgb(" + r + "," + g + "," + b + ")");
    }
    return (colorsArray);
}

//For pie function need a category's hours as a percent of total
function calcWeekPercent(data, index) {
    //Get activity hours
    let activityHours = 0;
    for (hour of data[index]) {
        activityHours = activityHours + hour;
    }

    //Get week's hours
    let total = 0;
    for (activity of data) {
        for (hour of activity) {
            total = total + hour;
        }
    }
    
    //Prevent rounding reducing largest back to 0
    let percent = (activityHours/total);
    if (percent > 1) {
        percent = 1;
    }
    return (percent)
}

//Draws a sector of the pie chart for given category
function drawSector(context, start, end, color) {
    context.strokeStyle = color;
    context.fillStyle = color;
    //Prevent fill filling the wrong area by doing greater than half in two
    if (end - start > 0.5) {
        drawSector(context, start, start + 0.5, color);
        start = start + 0.5;
    }
    //Draw with positions based on percentages of a full circle
    context.beginPath();
      context.arc(WIDTH/2, HEIGHT/2, HEIGHT*0.25, Math.PI*2*start, Math.PI*2*end, false);
      context.lineTo(WIDTH/2, HEIGHT/2);
      context.fill();
    context.stroke();
}

//Calls drawSector for each category with relevant data
function drawPie(data, colors) {
    //Clear canvas
    context.clearRect(0, 0, WIDTH, HEIGHT);
    startPoint = 0;
    for (i = 0; i < data.length; i++) {
        drawSector(context, startPoint, startPoint + calcWeekPercent(data, i), colors[i]);
        startPoint = startPoint + calcWeekPercent(data, i);
    }
}

//Draws a single bar in the correct place acording to amount of data
function drawBar(sections, bars, sectionIndex, barIndex, length, color) {
    context.fillStyle = color;
    context.fillRect(WIDTH/sections*sectionIndex + WIDTH/sections/bars*barIndex, HEIGHT - length, WIDTH/sections/bars, length);
}

//Calls drawBar for every data item with calcualted length
function drawBarChart(data, colors) {
    //Clear canvas
    context.clearRect(0, 0, WIDTH, HEIGHT);
    let numBars = data.length + 1;
    let numSections = 0;
    let maxVal = 0;
    //Collect limits of data display
    for (activity of data) {
        if (activity.length > numSections) {
            numSections = activity.length;
        }
        for (hour of activity) {
            if (hour > maxVal) {
                maxVal = hour;
            }
        }
    }
    //Draw each bar
    for (i = 0; i < numSections; i++) {
        for (j = 0; j < (numBars - 1); j++) {
            let length = HEIGHT*data[j][i]/maxVal;
            drawBar(numSections, numBars, i, j, length, colors[j]);
        }
    }
}

//Find middle value of an ordered array (for boxplot)
function findMedian(orderedArray) {
    let lowMidPoint = Math.floor((orderedArray.length - 1) / 2);
    let highMidPoint = Math.round((orderedArray.length - 1) / 2);
    let midNum = (orderedArray[lowMidPoint] + orderedArray[highMidPoint]) / 2;
    return midNum;
}

//Draws boxplot - needs to calcualte min, max, Q1, Q2, Q3 (Qs use findMedian);
function drawBoxPlot(data, colors) {
    //Clear canvas
    context.clearRect(0, 0, WIDTH, HEIGHT);
    let y = 0;
    let maxVal = 0;
    let minVal = 0;
    //Limits of all data
    for (activity of data) {
        for (hour of activity) {
            if (maxVal < hour) {
                maxVal = hour;
            }
            if (minVal > hour) {
                minVal = hour;
            }
        }
    }
    //Counter only for keeping consistent color
    let activityCount = 0;
    for (activity of data) {
        let largestHour = 0;
        let smallestHour = 9999;
        //limits of current data
        for (hour of activity) {
            if (largestHour < hour) {
                largestHour = hour;
            }
            if (smallestHour > hour) {
                smallestHour = hour;
            }
        }
        //Finds position based on where all data's max/min is
        y += WIDTH/(data.length + 1);
        let minimum = (WIDTH*0.1) + (WIDTH*0.8*(smallestHour/maxVal));
        let maximum = (WIDTH*0.9) - (WIDTH*0.8*(1 - largestHour/maxVal));
        let barHeight = HEIGHT*0.1;
        let activityCopy = activity.slice();
        let orderedArray = activityCopy.sort();
        let midPoint = Math.floor((orderedArray.length - 1) / 2);
        //median
        let Q1 = findMedian(orderedArray.slice(0, midPoint));
        let Q2 = findMedian(orderedArray);
        let Q3 = findMedian(orderedArray.slice(midPoint + 1, orderedArray.length));
        //Quartile positions
        Q1 = (WIDTH*0.1) + (WIDTH*0.8*(Q1/maxVal));
        Q2 = (WIDTH*0.1) + (WIDTH*0.8*(Q2/maxVal));
        Q3 = (WIDTH*0.1) + (WIDTH*0.8*(Q3/maxVal));
        context.beginPath();
          context.strokeStyle = "black";
          context.moveTo(minimum, y - (barHeight/2));
          context.lineTo(minimum, y + (barHeight/2));
          context.moveTo(minimum, y);
          context.lineTo(maximum, y);
          context.moveTo(maximum, y - (barHeight/2));
          context.lineTo(maximum, y + (barHeight/2));
          context.fillStyle = colors[activityCount];
          context.fillRect(Q1, y - (barHeight/2), Q3 - Q1, barHeight);
          context.rect(Q1, y - (barHeight/2), Q3 - Q1, barHeight);
          context.moveTo(Q2, y - (barHeight/2));
          context.lineTo(Q2, y + (barHeight/2));
        context.stroke();
        activityCount++;
    }
}

//Creates a table with this file's data
function createTable(data, header, colors) {
    //Find table and delete any existing data
    let table = document.getElementById("data_table");
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    //Create row for headings
    let row = document.createElement("tr");
    table.appendChild(row);
    //Find longest data[x] array incase data is unequal
    let numCells = 0;
    for (activity of data) {
        if (activity.length > numCells) {
            numCells = activity.length;
        }
    }
    //Add headings to first row and color them based on existing color scheme
    for (i = 0; i < header.length; i++) {
        let title = document.createElement("th");
        title.style.backgroundColor = colors[i - 1];
        row.appendChild(title);
        title.innerHTML = header[i];
    }
    //Adds data with each activity being a new column
    for (i = 0; i < numCells; i++) {
        let dataRow = document.createElement("tr");
        table.appendChild(dataRow);
        for (j = 0; j < data.length; j++) {
            let cell = document.createElement("td");
            dataRow.appendChild(cell);
            cell.innerHTML = data[j][i];
        }
        dataRow.insertCell(0).outerHTML = "<th class='dataLabel'>" + dataLabels[i] + "</th>";
    }
    
}

//main
//Setting up canvas
let canvas = document.getElementById("data_chart");
let context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

//To create table and chart on page entry
let dataColors = randomColors(dataSet);
createTable(dataSet, dataHeader, dataColors);
drawPie(dataSet, dataColors);

let currentChart = "pie";
//Redraws chart whenever a chart button is pressed
document.getElementById("pie_btn").addEventListener("click", function() {
    drawPie(dataSet, dataColors);
    currentChart = "pie";
});
document.getElementById("bar_btn").addEventListener("click", function() {
    drawBarChart(dataSet, dataColors);
    currentChart = "bar";
});
document.getElementById("box_btn").addEventListener("click", function() {
    drawBoxPlot(dataSet, dataColors);
    currentChart = "box";
});
//When clicking the chart give each category a new colour but maintain current chart
document.getElementById("data_chart").addEventListener("click", function() {
    dataColors = randomColors(dataSet);
    createTable(dataSet, dataHeader, dataColors);
    //maintain current chart
    switch (currentChart) {
        case "pie":
            drawPie(dataSet,dataColors);
            break;
        case "bar":
            drawBarChart(dataSet,dataColors);
            break;
        case "box":
            drawBoxPlot(dataSet,dataColors);
            break;
    }
});