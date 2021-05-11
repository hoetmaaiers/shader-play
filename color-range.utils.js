// Inspiration list:
// - https://stackoverflow.com/questions/17525215/calculate-color-values-from-green-to-red/17527156#17527156
// - https://codereview.stackexchange.com/questions/64708/calculation-of-rgb-values-given-min-and-max-values/64720#64720

let globalMin = 0.810405;
let globalMax = 115.151;
let totalRGB = 255 * 256 * 256 + 255 * 256 + 255;

const steps = 10;
const step = (globalMax - globalMin) / steps;

// convert three r,g,b integers (each 0-255) to a single decimal integer (something between 0 and ~16m)
function colourToNumber({ red, green, blue }) {
  return (red << 16) + (green << 8) + blue;
}

// convert it back again (to a string)
function numberToColour(number) {
  const red = (number & 0xff0000) >> 16;
  const green = (number & 0x00ff00) >> 8;
  const blue = number & 0x0000ff;

  return { red, green, blue };
  // or eg. return `rgb(${r},${g},${b})`;
}

const steppedResult = [...Array(steps).keys()].map((i) => {
  const value = step * i + globalMin;
  const rgbValue = getRgbValues(globalMin, globalMax, value);
  return {
    ...rgbValue,
    value, // validation: getPixelValue(rgbValue)
  };
});
const maxStep = {
  ...getRgbValues(globalMin, globalMax, globalMax),
  value: globalMax,
  // validation: getPixelValue(getRgbValues(globalMin, globalMax, globalMax)),
};

const result = [...steppedResult, maxStep];
// console.log('🌀 ~ file: color-range.utils.js ~ line 17 ~ result', result);

const vec3String = parseResult(result).reduce((acc, item, index) => {
  return (
    acc +
    `	colours[${index}] = vec4(convertRGB(vec3(${item.red}., ${item.blue}., ${item.red}.)),  ((customRange / 10. * ${index}. +  (customMin - globalMin)) / range));\n`
  );
  return acc + ``;
  return acc + item.hex + '\n';
}, '');
console.log(vec3String);

const xmlString = parseResult(result).reduce((acc, item) => {
  return acc + `<sld:ColorMapEntry label="${item.value}" color="#${item.hex}" quantity="${item.value}"/>\n`;
  return acc + item.hex + '\n';
}, '');
console.log(xmlString);

function decimalToHex(value) {
  const hex = Number(value).toString(16);
  if (hex.length === 1) return '0' + hex;
  return hex;
}

function parseResult(result) {
  return result.map((item) => ({
    ...item,
    hex: decimalToHex(item.red) + decimalToHex(item.green) + decimalToHex(item.blue),
    value: item.value,
  }));
}

function getRgbValues(minimum, maximum, value) {
  const pct = (value - minimum) / (maximum - minimum);
  return numberToColour(totalRGB * pct);
}

function getPixelValue(rgb) {
  const value = colourToNumber(rgb);
  const pct = (value - 0) / (totalRGB - 0);
  return pct * (globalMax - globalMin) + globalMin;
}

console.log(getPixelValue({ red: 127, green: 255, blue: 127 }));

function normalize(minimum, maximum, value) {
  return ((value - minimum) / (maximum - minimum)) * 2;
}

function denormalize(minimum, maximum, value) {
  return (value / 2) * (maximum - minimum) + minimum;
}

function distance(value, channel) {
  // console.log('----------------------------------------');
  // console.log('🌀 ~ file: color-range.utils.js ~ line 67 ~ value', value);
  // console.log('🌀 ~ file: color-range.utils.js ~ line 68 ~ channel', channel);
  const distance = Math.abs(value - channel);
  let colorStrength = 1 - distance;
  if (colorStrength < 0) colorStrength = 0;
  // console.log(
  //   '🌀 ~ file: color-range.utils.js ~ line 87 ~ value, distance, colorStrength',
  //   value,
  //   distance,
  //   colorStrength
  // );
  return Math.round(colorStrength * 255);
}

function dedistance(value, channel) {
  const distance = Math.abs(value - channel);
  let colorStrength = 1 - distance;
  if (colorStrength < 0) colorStrength = 0;
  return colorStrength / 255;
}
