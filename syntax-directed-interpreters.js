const {
  Lexer,
  constant: { INTEGER, PLUS, MULTIPLE, MINUS, RPAREN, LPAREN, DIVISION }
} = require('./lib/Lexer')
class Interpreter {
  constructor(text) {
    this.lexer = new Lexer(text)
    this.currentToken = this.lexer.getNextToken()
  }
  eat(type) {
    if (this.currentToken.type !== type) return this.error()
    this.currentToken = this.lexer.getNextToken()
  }
  factor() {
    let type = this.currentToken.type
    let r
    if (type === INTEGER) {
      r = this.currentToken.value
      this.eat(INTEGER)
    } else if (type === LPAREN) {
      this.eat(LPAREN)
      r = this.expr()
      this.eat(RPAREN)
    }
    return r
  }
  term() {
    let r = this.factor()
    while (/MULTIPLE|DIVISION/.test(this.currentToken.type)) {
      let type = this.currentToken.type
      if (type === MULTIPLE) {
        this.eat(MULTIPLE)
        r = r * this.factor()
      } else if (type === DIVISION) {
        this.eat(DIVISION)
        r = r / this.factor()
      }
    }
    return r
  }
  expr() {
    let result = this.term()
    while (/MINUS|PLUS/.test(this.currentToken.type)) {
      let type = this.currentToken.type
      if (type === MINUS) {
        this.eat(MINUS)
        result = result - this.term()
      } else if (type === PLUS) {
        this.eat(PLUS)
        result = result + this.term()
      }
    }
    return result
  }
  error() {
    throw new Error('error input')
  }
}
console.log(new Interpreter(' (1 +  10  )  * 3 / ( 1 + 2) ').expr())
