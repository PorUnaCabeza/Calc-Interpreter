const {
  Lexer,
  constant: { INTEGER, PLUS, MULTIPLE, MINUS, RPAREN, LPAREN, DIVISION }
} = require('./Lexer')

const OPERATOR_TYPE = 'NODE_OPERATOR'
const NUM_TYPE = 'NODE_NUMBER'
const UNARY_OPERATOR_TYPE = 'UNARY_OPERATOR_TYPE'
/**
 *  基类
 */
class ASTNode {}

/**
 * binary operator， 二元操作
 */
class BindOp extends ASTNode {
  constructor(left, opToken, right) {
    super()
    this.left = left
    this.token = opToken
    this.right = right
    this.type = OPERATOR_TYPE
  }
}

/**
 * unary operator, 一元操作
 */
class UnaryOp extends ASTNode {
  constructor(opToken, children) {
    super()
    this.token = opToken
    this.children = children
    this.type = UNARY_OPERATOR_TYPE
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
 * expr: term ((PLUS | MINUS) term)*
 * term: factor ((MULTIPLE | DIVISION) factor)*
 * factor: INTEGER | LPAREN expr RPAREN | (PLUS | MINUS)factor
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
    if (token.type === PLUS) {
      this.eat(PLUS)
      return new UnaryOp(token, this.factor())
    } else if (token.type === MINUS) {
      this.eat(MINUS)
      return new UnaryOp(token, this.factor())
    } else if (token.type === INTEGER) {
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
  NUM_TYPE,
  UNARY_OPERATOR_TYPE
}
