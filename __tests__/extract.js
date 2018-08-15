const extract = require('../src/parser/extract.js');

test('Single comment test', () => {
  const address = ['./mockData/singleComment.js'];
  const expected = [{
    content: [{
      comment: '*\n * Sample function\n * @constructor\n * @param {number} a  First multiplier\n * @param {number} b  Second multiplier\n * @return\n ',
      name: 'mul',
    }],
    name: ""
  }];
  expect.assertions(1);
  return extract(address).then((received) => {
    expect(received).toEqual(expected);
  })
});

test('Multiple comments test', () => {
  const address = ['./mockData/subFolder/multipleComments.js'];
  const expected = [{
    content: [{
      comment: '*\n * Sample function\n * @constructor\n * @param {number} a  First multiplier\n * @param {number} b  Second multiplier\n * @return\n ',
      name: 'mul',
    }, {
      comment: '*\n * Sample function\n * @constructor\n * @param {number} a  Numerator\n * @param {number} b  Denominator\n * @return\n ',
      name: 'div',
    }],
    name: ""
  }];
  expect.assertions(1);
  return extract(address).then((received) => {
    expect(received).toEqual(expected);
  });
});

test('Declare function as a const', () => {
  const address = ['./mockData/constFunction.js'];
  const expected = [{
    content: [{
      comment: '*\n * Sample function\n * @constructor\n * @param {number} a  First multiplier\n * @param {number} b  Second multiplier\n * @return\n ',
      name: 'mul',
    }],
    name: "",
  }];
  expect.assertions(1);
  return extract(address).then((received) => {
    expect(received).toEqual(expected);
  })
});

test('should work for a folder and only process js and jsx file', () => {
  const address = ['./mockData/subFolder'];
  const expected = [{
    content: [{
      comment: '*\n * Sample function\n * @constructor\n * @param {number} a  First multiplier\n * @param {number} b  Second multiplier\n * @return\n ',
      name: 'mul',
    }, {
      comment: '*\n * Sample function\n * @constructor\n * @param {number} a  Numerator\n * @param {number} b  Denominator\n * @return\n ',
      name: 'div',
    }],
    name: ""
  }];
  expect.assertions(1);
  return extract(address).then((received) => {
    expect(received).toEqual(expected);
  })
});

test('should work for glob pattern', () => {
  const address = ['../mockData/*.js'];
  const expected = [{
    content: [{
      comment: '*\n * Sample function\n * @constructor\n * @param {number} a  First multiplier\n * @param {number} b  Second multiplier\n * @return\n ',
      name: 'mul',
    }],
    name: "",
  }];
  expect.assertions(1);
  return extract(address).then((received) => {
    expect(received).toEqual(expected);
  })
});