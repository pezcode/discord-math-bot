'use strict'

const Value = require('./value.js')

class Node {
  constructor (tree, scope) {
    this.tree = tree
    this.scope = scope
    this.code = this.tree.compile()
  }

  // http://mathjs.org/docs/expressions/expression_trees.html
  hasSymbol (symbols) {
    let found = []
    this.tree.traverse(node => {
      switch (node.type) {
        case 'FunctionNode': // documentation says node.fn instead of node.name
        case 'SymbolNode':
          if (symbols.indexOf(node.name) !== -1) {
            found.push(node.name)
          }
          break
      }
    })
    return found
  }

  getScope () {
    return this.scope
  }

  toTex () {
    return this.tree.toTex()
  }

  eval () {
    return new Value(this.code.eval(this.scope))
  }
}

module.exports = Node
