'use strict'

const math = require('mathjs')

class Value {
  constructor (value) {
    this.value = value
    this.type = math.typeof(this.value)
  }

  // http://mathjs.org/docs/reference/functions/typeof.html
  toString () {
    /*
    Some notes:
      - Arrays after parsing become type Matrix, even if just one row
      - ResultSet comes back as Object, but isResultSet is set
    */
    switch (this.type) {
      case 'undefined':
        return 'undefined'
      case 'null':
        return 'null'
      case 'Object':
        try {
          return JSON.stringify(this.value, null, 2)
        } catch (err) {
          return 'Object with ' + Object.keys(this.value).length + ' items'
        }
      case 'Function':
        return 'Function ' + this.value.name
      default:
        return this.value.toString()
    }
  }
}

module.exports = Value
