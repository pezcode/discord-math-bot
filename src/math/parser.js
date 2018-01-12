'use strict'

const math = require('mathjs')
const Node = require('./node.js')

class Parser {
  constructor (expression) {
    this.expression = expression
  }

  parse (scope = {}) {
    return new Node(math.parse(this.expression), scope)
  }
}

module.exports = Parser
