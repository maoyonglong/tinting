const wcwidth = require('wcwidth')

exports.isArray = function (obj) {
  return Array.isArray(obj)
}

exports.isString = function (obj) {
  return typeof obj === 'string'
}

exports.isObject = function (obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

exports.isIterable = function (obj) {
  return exports.isArray(obj) || exports.isObject(obj)
}

exports.isEmpty = function (obj) {
  // can't use === to compare the value of object or array
  return ['', null, undefined].indexOf(obj) >= 0 || obj.length === 0
}

exports.expectNotEmpty = function (obj, empty) {
  return exports.isEmpty(obj) ? (empty !== undefined ? empty : undefined) : obj
}

exports.forEach = function (cb) {
  if (exports.isObject(this)) {
    for (let key of Object.keys(this)) {
      if (cb.call(this, key, this[key], this) === false) break
    }
  } else if (exports.isArray(this)) {
    for (let i = 0, len = this.length; i < len; i++) {
      if (cb.call(this, i, this[i], this) === false) break
    }
  }
}

exports.capitalize = function (string) {
  return string.substr(0, 1).toUpperCase() + string.substr(1)
}

exports.mixinArr = function () {
  let arr = [].concat.apply(arguments[0], [].slice.call(arguments, 1))
  return [...new Set(arr)]
}

exports.getWidth = function (string) {
  return wcwidth(string)
}
