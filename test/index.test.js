const Con = require('..')
const test = require('ava')

test(`check createInstance`, t => {
  const con = Con.createInstance({ logStyle: { text: ['bold'] } })
  // Con is not con
  t.notDeepEqual(Con.logStyle, con.logStyle)
  // con is an instance of Console
  t.deepEqual(Con.tableStyle, con.tableStyle)
})

test('check options', t => {
  const con = Con.createInstance({
    logStyle: {
      text: ['bold', 'green'],
      keywords: [
        {
          text: 'd',
          style: ['yellow']
        }
      ]
    },
    globalStyle: {
      keywords: [
        {
          text: 'de',
          style: ['magenta', 'bold']
        }
      ]
    }
  })
  const expectedOption = {
    tableStyle: {
      head: ['white', 'bold'],
      border: ['bold', 'magenta'],
      layer: 1
    },
    logStyle: {
      text: ['bold', 'green'],
      keywords: [
        {
          text: 'd',
          style: ['yellow']
        }
      ]
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
    globalStyle: {
      keywords: [
        {
          text: 'de',
          style: ['magenta', 'bold']
        }
      ]
    }
  }
  for (let [key, val] of Object.entries(expectedOption)) {
    t.deepEqual(val, con[key])
  }
})
