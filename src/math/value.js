'use strict'

const math = require('mathjs')

class Value {
  constructor (value) {
    this.value = value
    this.type = Value.getType() // cache it
  }

  static getType (val) {
    const typeName = math.typeof(val)
    switch (typeName) {
      case 'Help':
        return 'help'
      case 'number':
      case 'BigNumber':
      case 'Complex':
      case 'Fraction':
      case 'boolean':
      case 'Array':
      case 'Matrix':
      case 'Unit':
        return 'number'
      /*
      case 'Object':
        try {
          reply = JSON.stringify(val)
        } catch (e) { } // shrug
        break
      */
      case 'string':
        return 'string'
      case 'ResultSet': // multiline eval
        return 'set'
      default:
        return typeName
    }
  }

  toString () {
    switch (this.type) {
      // case 'help':
      // case 'number':
      default:
        return this.value.toString()
      case 'string':
        return '"' + this.value.toString() + '"'
      case 'set':
        return this.value.entries.join('\n')
    }
  }
}

module.exports = Value
