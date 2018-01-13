'use strict'

const math = require('mathjs')
const Node = require('./node.js')

class Parser {
  constructor (expression) {
    this.expression = expression
  }

  /*
  static makeSafe () {
    // http://mathjs.org/docs/expressions/security.html
    // http://mathjs.org/docs/reference/functions.html
    let oldImports = {}
    let imports = {}
    for (const func of Parser.blocked) {
      oldImports[func] = math[func]
      imports[func] = () => { throw new Error('Function ' + func + ' is disabled') }
    }
    math.import(imports, { override: true })
  }
  */

  // TODO prevent function assignment
  parse (scope = {}) {
    // Parser.oldImports.parse(this.expression)
    const tree = math.parse(this.expression)
    const node = new Node(tree, scope)
    // check for blocked functions and symbols in the tree
    // also check symbols for function names to prevent reassignment
    // eg. a = compile; a("1+2")
    const blocked = node.hasSymbol(Parser.blockedFunctions)
    if (blocked.length === 1) {
      throw new Error('Function ' + blocked[0] + ' is disabled')
    } else if (blocked.length > 0) {
      throw new Error('Functions ' + blocked.join(', ') + ' are disabled')
    }
    return node
  }
}

Parser.blockedFunctions = [
  'import', 'config', 'typed', // Core functions
  'createUnit', // Construction functions
  'compile', 'eval', 'help', 'parse', 'parser', // Expression functions
  'derivative', 'simplify', // Algebra functions
  'forEach', // Matrix functions
  'format', 'print' // String functions
]

// Parser.oldImports = Parser.makeSafe()

module.exports = Parser
