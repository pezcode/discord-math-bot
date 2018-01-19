'use strict'

const math = require('mathjs')
const Node = require('./node.js')

class Parser {
  constructor (expression) {
    this.expression = expression
  }

  parse () {
    const tree = math.parse(this.expression)
    const node = new Node(tree)
    node.checkSafety() // throws
    return node
  }
}

module.exports = Parser
