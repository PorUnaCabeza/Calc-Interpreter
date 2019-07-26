const { Parser } = require('./lib/Parser')
const { Interpreter } = require('./lib/Interpreter')

let expression = '(1+2 + 2 ) * (3*3 + 1) / 5 + 1 + 2*7 +-1'
let ast = new Parser(expression).parse()
new Interpreter().interpret(ast)
