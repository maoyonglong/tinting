'use strict'
const chalk = require('chalk')
const mixin = require('mixin-deep')
const Table = require('cli-table')
const utils = require('./utils')

const proto = {}
Object.setPrototypeOf(proto, console)

function Console (options) {
  const con = {}
  applyOptions(con, options)
  if (!this || !(this instanceof Console)) {
    Object.setPrototypeOf(con, proto)
    con.constructor = Console
    con.createInstance = function (options) {
      return Console(options)
    }
    return con
  }

  proto.error.call(con, `can't initalize an instance of Console by constructor.`)
}

function applyOptions (obj, options) {
  options = options || {}

  // config default options here
  let defaultOptions = {
    tableStyle: {
      head: ['white', 'bold'],
      border: ['bold', 'magenta'],
      layer: 1
    },
    logStyle: {
      text: ['green']
    },
    infoStyle: {
      text: ['cyan']
    },
    warnStyle: {
      text: ['yellow']
    },
    errorStyle: {
      text: ['red']
    },
    globalStyle: {}
  }
  mixin(obj, defaultOptions, options)
}

function applyStyles (string, styles) {
  if (!string) {
    return ''
  }
  styles.forEach(function (style) {
    string = chalk[style](string)
  })
  return string
}

function getApplyOption (type, key, value) {
  const typeVal = this[`${type}Style`][key]
  const globalVal = this['globalStyle'][key]
  if (key === 'keywords') {
    return utils.mixinArr([], globalVal || [], typeVal || [])
  }
  return value || utils.expectNotEmpty(typeVal) || utils.expectNotEmpty(globalVal)
}

function applyKeywordStyles (string, keywords) {
  keywords.forEach(function (keyword) {
    let text = keyword.text
    let style = keyword.style
    let re = new RegExp(`${text}`, 'g')
    string = string.replace(re, function (match) {
      return applyStyles(match, style)
    })
  })
  return string
}

function applyTextStyles (string, type) {
  let text = getApplyOption.call(this, type, 'defaultText', string)
  let textStyle = getApplyOption.call(this, type, 'text')
  let keywordStyle = getApplyOption.call(this, type, 'keywords')

  return applyStyles(applyKeywordStyles(text, keywordStyle), textStyle)
}

['log', 'wran', 'info'].forEach(function (type) {
  proto[type] = function (string) {
    console[type](applyTextStyles.call(this, string, type))
  }
})

proto.error = function (string) {
  console.error(new Error(applyTextStyles.call(this, string, 'error')))
}

proto.table = function (obj) {
  const self = this
  const maxLayer = this.tableStyle.layer
  let curLayer = 1
  output('', '', curLayer, obj)
  function output (preload, curLoad, curLayer, obj) {
    let load = preload + '->' + curLoad
    let table = createTable.call(self, obj)
    if (preload === '') {
      load = 'root'
    }
    utils.forEach.call(obj, function (key, value) {
      table.push([key, format(value)])
      if (curLayer < maxLayer && utils.isIterable(value)) {
        output(load, key, curLayer + 1, value)
      }
    })
    console.log(load)
    console.log(table.toString())
  }
  function createTable (obj) {
    let maxWidth = [utils.getWidth('index/key'), utils.getWidth('[object Object]')]
    utils.forEach.call(obj, function (key, value) {
      // getMaxWidth
      maxWidth[0] = maxWidth[0] < utils.getWidth(key) ? utils.getWidth(key) : maxWidth[0]
      maxWidth[1] = maxWidth[1] < utils.getWidth(value) ? utils.getWidth(value) : maxWidth[1]
    })
    maxWidth[0] = formatWidth(maxWidth[0])
    maxWidth[1] = formatWidth(maxWidth[1])

    function formatWidth (width) {
      const DISPLAY_MAX_WIDTH = 30
      width += 2
      if (DISPLAY_MAX_WIDTH < width) {
        width = DISPLAY_MAX_WIDTH
      }
      return width
    }
    return new Table({
      head: ['index/key', 'value'],
      colWidths: maxWidth,
      style: self.tableStyle
    })
  }
  function format (value) {
    if (utils.isArray(value)) {
      return '[object Array]'
    } else if (utils.isObject(value)) {
      return '[object Object]'
    } else {
      return value
    }
  }
}

Console.prototype = proto

module.exports = Console()
module.exports.default = module.exports
