const utils = require('../utils')
const test = require('ava')

test('check isString', t => {
  t.is(utils.isString('string'), true)
  t.is(utils.isString([]), false)
  t.is(utils.isString(undefined), false)
  t.is(utils.isString(null), false)
  t.is(utils.isString(123), false)
  t.is(utils.isString({}), false)
})

test('check isArray', t => {
  t.is(utils.isArray('string'), false)
  t.is(utils.isArray([]), true)
  t.is(utils.isArray(undefined), false)
  t.is(utils.isArray(null), false)
  t.is(utils.isArray(123), false)
  t.is(utils.isArray({}), false)
})

test('check isObject', t => {
  t.is(utils.isObject('string'), false)
  t.is(utils.isObject([]), false)
  t.is(utils.isObject(undefined), false)
  t.is(utils.isObject(null), false)
  t.is(utils.isObject(123), false)
  t.is(utils.isObject({}), true)
})

test('check isIterable', t => {
  t.is(utils.isIterable('string'), false)
  t.is(utils.isIterable([]), true)
  t.is(utils.isIterable(undefined), false)
  t.is(utils.isIterable(null), false)
  t.is(utils.isIterable(123), false)
  t.is(utils.isIterable({}), true)
})

test('check expectNotEmpty', t => {
  t.is(utils.expectNotEmpty(undefined), undefined)
  t.is(utils.expectNotEmpty('', 'empty string'), 'empty string')
  t.deepEqual(utils.expectNotEmpty([1, 2, 3]), [1, 2, 3])
})

test('check forEach', t => {
  const arr = [1, 2]
  const obj = { a: 1, b: 2 }
  utils.forEach.call(arr, function (idx, val) {
    t.is(this, arr)
    t.is(val, arr[idx])
  })
  utils.forEach.call(obj, (key, val) => {
    t.not(this, obj)
    t.is(val, obj[key])
  })
})

test('check capitalisze', t => {
  t.is(utils.capitalize('capital'), 'Capital')
})

test('check mixinArr', t => {
  t.deepEqual(utils.mixinArr([1, 2, 3], [2, 3], [9, 1]), [1, 2, 3, 9])
})

test('check getWidth', t => {
  t.is(utils.getWidth('abc'), 3)
  t.is(utils.getWidth('中'), 2)
})
