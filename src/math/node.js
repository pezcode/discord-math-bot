'use strict'

const Value = require('./value.js')

class Node {
  constructor (tree) {
    this.tree = tree
  }

  toTex () {
    return this.tree.toTex()
  }

  // check for blocked functions and symbols in the tree
  // also check symbols for function names to prevent reassignment
  // eg. a = compile; a("1+2")
  // check for function creations: f(x) = x^2
  // http://mathjs.org/docs/expressions/expression_trees.html
  checkSafety () {
    this.tree.traverse(node => {
      switch (node.type) {
        case 'FunctionNode': // documentation says node.fn instead of node.name
        case 'SymbolNode':
          if (Node.blockedFunctions.indexOf(node.name) !== -1) {
            throw new Error('Function ' + node.name + ' is disabled')
          }
          break
        case 'FunctionAssignmentNode':
          throw new Error('Creating functions is disabled')
      }
    })
  }

  eval (scope = {}) {
    if (!this.code) {
      this.code = this.tree.compile()
    }
    return new Value(this.code.eval(scope))
  }
}

Node.blockedFunctions = [
  'import', 'config', 'typed', // Core functions
  'createUnit', // Construction functions
  'compile', 'eval', 'help', 'parse', 'parser', // Expression functions
  'derivative', 'simplify' // Algebra functions
]

module.exports = Node
