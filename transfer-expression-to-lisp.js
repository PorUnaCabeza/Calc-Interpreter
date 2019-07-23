const { Parser, OPERATOR_TYPE } = require('./lib/Parser')

function transfer2Lisp(ast) {
  let result = ''
  function recursive(node) {
    if (!node) return
    let { value } = node.token
    let isOp = node.type === OPERATOR_TYPE

    isOp && (result += '(')
    result += ` ${value} `
    recursive(node.left)
    recursive(node.right)
    isOp && (result += ')')
  }
  recursive(ast)
  console.log(result)
}

let expression = '(1+2 + 2 ) * (3*3 + 1) / 5 + 1 + 2*7'
let ast = new Parser(expression).parse()

transfer2Lisp(ast)
