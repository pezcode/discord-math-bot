'use strict'

const Value = require('./value.js')

class Node {
  constructor (tree, scope) {
    this.tree = tree
    this.scope = scope
    this.code = this.tree.compile()
  }

  toTex () {
    return this.tree.toTex()
  }

  eval () {
    return new Value(this.code.eval(this.scope))
  }
}

module.exports = Node
