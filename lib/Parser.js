const {
  Lexer,
  constant: { INTEGER, PLUS, MULTIPLE, MINUS, RPAREN, LPAREN, DIVISION }
} = require('./Lexer')

const OPERATOR_TYPE = 'NODE_OPERATOR'
const NUM_TYPE = 'NODE_NUMBER'
/**
 *  基类
 */
class ASTNode {}
/**
 * binary operator， 具有两个操作数的运算符节点
 */
class BindOp extends ASTNode {
  constructor(left, op, right) {
    super()
    this.left = left
    this.token = op
    this.right = right
    this.type = OPERATOR_TYPE
  }
}

/**
 * operands，操作数节点
 */
class Num extends ASTNode {
  constructor(token) {
    super()
    this.token = token
    this.value = token.value
    this.type = NUM_TYPE
  }
}


/**
 * 获得AST
 */
class Parser {
  constructor(text) {
    this.lexer = new Lexer(text)
    this.currentToken = this.lexer.getNextToken()
  }
  eat(type) {
    if (this.currentToken.type !== type) return this.error()
    this.currentToken = this.lexer.getNextToken()
  }

  /**
   * factor: 操作数，或者是一个括号表达式（expr）
   * returns: Num节点，或者expr()返回的ast子树
   */
  factor() {
    let token = this.currentToken
    if (token.type === INTEGER) {
      this.eat(INTEGER)
      return new Num(token) // num node
    } else if (token.type === LPAREN) {
      this.eat(LPAREN)
      let node = this.expr() // ast tree
      this.eat(RPAREN)
      return node
    }
  }

  /**
   * term: 乘除法，第一优先级
   * returns: ast子树
   */
  term() {
    //return op tree
    let astNode = this.factor()
    while (/MULTIPLE|DIVISION/.test(this.currentToken.type)) {
      let token = this.currentToken
      if (token.type === MULTIPLE) {
        this.eat(MULTIPLE)
      } else if (token.type === DIVISION) {
        this.eat(DIVISION)
      }
      astNode = new BindOp(astNode, token, this.factor())
    }
    return astNode
  }

  /**
   * 加减法，最低优先级
   * returns: ast树
   */
  expr() {
    let astNode = this.term()
    while (/MINUS|PLUS/.test(this.currentToken.type)) {
      let token = this.currentToken
      if (token.type === MINUS) {
        this.eat(MINUS)
      } else if (token.type === PLUS) {
        this.eat(PLUS)
      }
      astNode = new BindOp(astNode, token, this.term())
    }
    return astNode
  }
  error() {
    throw new Error('error input')
  }
  parse() {
    return this.expr()
  }
}

module.exports = {
  Parser,
  OPERATOR_TYPE,
  NUM_TYPE
}
