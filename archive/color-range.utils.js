// TODO: https://stackoverflow.com/questions/17525215/calculate-color-values-from-green-to-red/17527156#17527156

// took inspiration from here: https://codereview.stackexchange.com/questions/64708/calculation-of-rgb-values-given-min-and-max-values/64720#64720

let globalMin = 0.810405;
let globalMax = 115.151;

const steps = 10;
const step = (globalMax - globalMin) / steps;

// console.log('getPixelValue', getPixelValue(globalMin, globalMax, { red: 204, green: 51, blue: 0 }));
// console.log('getPixelValue', getPixelValue(globalMin, globalMax, { red: 204, green: 51, blue: 255 }));
// console.log('getRgbValues', getRgbValuess(globalMin, globalMax, globalMin));
console.log('getRgbValues', getRgbValuess(globalMin, globalMax, 2));
console.log('getPixelValues', getPixelValuess(globalMin, globalMax, 2));
// console.log('getRgbValues', getRgbValuess(globalMin, globalMax, 70));
// console.log('getRgbValues', getRgbValuess(globalMin, globalMax, globalMax));

// const steppedResult = [...Array(steps).keys()].map((i) => {
//   const value = step * i + globalMin;
//   return { ...getRgbValues(globalMin, globalMax, value), value };
// });

// const result = [...steppedResult, { ...getRgbValues(globalMin, globalMax, globalMax), value: globalMax }];
// console.log('🌀 ~ file: color-range.utils.js ~ line 17 ~ result', result);

// const xmlString = parseResult(result).reduce((acc, item) => {
//   return acc + `<sld:ColorMapEntry label="${item.value}" color="#${item.hex}" quantity="${item.value}"/>\n`;
//   return acc + item.hex + '\n';
// }, '');

// console.log(xmlString);
// const normalizedValues = [globalMin, 10, 20, 100, globalMax].map((val) => normalize(globalMin, globalMax, val));
// console.log('🌀 ~ file: color-range.utils.js ~ line 23 ~ normalizedValues', normalizedValues);
// const denormalizedValues = normalizedValues.map((val) => denormalize(globalMin, globalMax, val));
// console.log('🌀 ~ file: color-range.utils.js ~ line 25 ~ denormalizedValues', denormalizedValues);

// const distanceValues = [0.1, 0.2, 0.9, 1].map((val) => distance(val, 0));
// console.log('🌀 ~ file: color-range.utils.js ~ line 23 ~ distanceValues', distanceValues);
// const dedistanceValues = distanceValues.map((val) => dedistance(val, 0));
// console.log('🌀 ~ file: color-range.utils.js ~ line 25 ~ dedistanceValues', distanceValues);

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

function getRgbValuess(minimum, maximum, value) {
  const pct = (value - minimum) / (maximum - minimum);
  console.log('🌀 ~ file: color-range.utils.js ~ line 59 ~ pct', pct);
  return {
    red: Math.round(255 - 255 * pct),
    green: Math.round(255 * pct),
    blue: 0,
  };
}

// 252 = 255 - (255 * x),
// 252 + 255 = (255 * x)
// (252 + 255) / 255

function getPixelValuess(minimum, maximum, value) {
  const pct = (value - minimum) / (maximum - minimum);
  console.log('🌀 ~ file: color-range.utils.js ~ line 67 ~ pct', pct);
  const red = 255 * (255 / pct);
  const green = 255 / pct;
  const blue = 0;

  console.log(red, green, blue);
}
function getRgbValues(minimum, maximum, value) {
  const normalizedValue = normalize(minimum, maximum, value);
  console.log('🌀 ~ file: color-range.utils.js ~ line 57 ~ value', value);
  console.log('🌀 ~ file: color-range.utils.js ~ line 53 ~ normalizedValue', normalizedValue);
  console.log(
    '🌀 ~ file: color-range.utils.js ~ line 53 ~ denormalizedValue',
    denormalize(globalMin, globalMax, normalizedValue)
  );

  console.log('🌀 ~ file: color-range.utils.js ~ line 57 ~ distance 0', distance(normalizedValue, 0));
  console.log('🌀 ~ file: color-range.utils.js ~ line 57 ~ distance 1', distance(normalizedValue, 1));
  console.log('🌀 ~ file: color-range.utils.js ~ line 57 ~ distance 2', distance(normalizedValue, 2));
  // console.log('🌀 ~ file: color-range.utils.js ~ line 57 ~ dedistance 0', dedistance(normalizedValue, 0));
  // console.log('🌀 ~ file: color-range.utils.js ~ line 57 ~ dedistance 1', dedistance(normalizedValue, 1));
  // console.log('🌀 ~ file: color-range.utils.js ~ line 57 ~ dedistance 2', dedistance(normalizedValue, 2));

  return {
    red: distance(normalizedValue, 0),
    green: distance(normalizedValue, 1),
    blue: distance(normalizedValue, 2),
  };
}

function getPixelValue(minimum, maximum, rgb) {
  // const denormalizedValue = denormalize(minimum, maximum, rgb.red);

  return {
    red: dedistance(rgb.red, 0),
    green: dedistance(rgb.green, 1),
    blue: dedistance(rgb.blue, 2),
  };
}

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
