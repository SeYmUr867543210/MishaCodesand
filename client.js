////////////////////////////////////////////////////////////////////////////////

//gor xAxis
const minDistance = 12;
const maxDistance = 50;
const scalePadding = 20;
const scaleWidth = 50;
const fontSize = 16;
const gap = 5;
const pointSize = 10;
let xyPosition = {}
let multiplier = 1;
let offset = 0;

let valueShift = 0;
let yScaling = 1;

const steps = [
    0.00001, 0.000025, 0.00005,
    0.0001, 0.00025, 0.0005,
    0.001, 0.0025, 0.005,
    0.01, 0.025, 0.05,
    0.1, 0.25, 0.5, 1, 2.5, 5,
    10, 25, 50, 100, 250, 500,
    1000, 2500, 5000,
    10000, 25000, 50000,
    100000, 250000, 500000,
    1000000, 2500000, 5000000,
];

function round(num) {
    return steps.reduce((closest, step) => Math.abs(step - num) < Math.abs(closest - num) ? step : closest)
}

function drawPriceScale(minPrice, maxPrice, stepIndex = 0) {
    const svgHeight = svg.clientHeight;
    const scaleHeight = svgHeight - scalePadding * 2;
    const perfectDistance = (maxDistance + minDistance) / 2;
    //n * (distance + fontSize) + fontSize = scaleHeight
    const priceCount = (scaleHeight - fontSize) / (perfectDistance + fontSize) + 1;
    const priceRange = maxPrice - minPrice || maxPrice / 12;
    const imperfectPriceStep = priceRange / (priceCount - 1);
    const perfectPriceStep = round(imperfectPriceStep);
    const priceStep = steps[steps.indexOf(perfectPriceStep) + stepIndex];
    const minMark = Math.floor(minPrice / priceStep) * priceStep;

    const priceMarks = [];

    for (let lastMark = minMark; lastMark <= maxPrice + priceStep; lastMark += priceStep) {
        priceMarks.push(lastMark)
    }
    valueShift = priceMarks[0];
    yScaling = scaleHeight / (priceMarks[priceMarks.length - 1] - priceMarks[0]);

    const distance = scaleHeight / (priceMarks.length - 1);

    const digits = (priceStep.toString().split(".")[1] || "").length;
    drawScalePrices(priceMarks.map(price => price.toFixed(digits)), distance)
}


function drawScalePrices(prices, distance) {
    const svgHeight = svg.clientHeight;
    const svgWidth = svg.clientWidth;
    const priceScaleWidth = 50;

    const x = svgWidth - priceScaleWidth;


    priceScale.innerHTML =
        prices.map(function (price, i) {
            return `<text id="scalePrice${i}"x="${x}" y="${valToY(price) + fontSize / 2 + 1}">${price}</text>`
        }).join('');

    multiplier = (distance + fontSize) / (prices[0] - prices[1]);
    offset = svgHeight - scalePadding - fontSize / 2 + prices[0] * multiplier;
}

////////////////////////////////////////////////////////////////////////////////

let arr = [];

let randomNum;
let level = 10000 ** Math.random(), volatility = Math.random(), dynamic = (1 - Math.random()) * volatility / 20;
// dynamic = 0;

function generateNumForArr(length = Infinity) {
    randomNum = (level + Math.random() ** volatility + dynamic * arr.length).toFixed(3)
    let date = new Date();
    let seconds = date.getSeconds()
    arr.push({ num: randomNum, sec: seconds })

    const maxPrice = Math.max.apply(Math, arr.map(function (o) { return o.num; }))
    const minPrice = Math.min.apply(Math, arr.map(function (o) { return o.num; }))
    drawPriceScale(minPrice, maxPrice, 0)
    renderData()

    if (length) setTimeout(generateNumForArr, Math.random() * 300, length - 1);

}
generateNumForArr(100)


//napisat funkcyyu points kotoraya budet vyvodit na grafike chislovyye znacheniya iz massiva v sootvetstvii so shkaloy otrisovannoy

function renderData() {
    circles.innerHTML = "";
    arr.forEach(({ num }, i) => renderPoint(num, i + 1 - arr.length))
}

function renderPoint(price, stackPos = 0) {
    const maxPointCount = Math.floor((svg.clientWidth - scaleWidth) / (pointSize + gap));  // SKOLKO SEKCYY POMESTITSYA na holste
    const i = maxPointCount + stackPos - 1;

    const r = pointSize / 2;
    const x = (gap + r) + (gap + pointSize) * i;
    const y = valToY(price);  // price * koeficient + smeshenie(stackPos)

    if (x >= 0 && x <= svg.clientWidth && y >= 0 && y <= svg.clientHeight) {
        drawCircle(x, y, r)
    }
}
function valToY(value) {
    return svg.clientHeight - yScaling * (value - valueShift) - scalePadding;
}

function drawCircle(x, y, r) {
    let circle = document.createElementNS('http://www.w3.org/2000/svg', "circle");
    circle.setAttribute("id", `circle`)
    circle.setAttribute("r", r)
    circle.setAttribute("cx", x)
    circle.setAttribute("cy", y)
    circle.style = `stroke: black;`
    circles.append(circle)
}





















// function renderNumbers() {
//     let span = document.createElement("span");
//     if (arr[arr.length - 1]?.sec != arr[arr.length - 2]?.sec) {
//         document.body.append(document.createElement("br"))
//     }
//     span.innerText = `___${arr[arr.length - 1].num} `

//     document.body.append(span)
// }