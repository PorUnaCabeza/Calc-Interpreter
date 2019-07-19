const {
  Lexer,
  constant: { INTEGER, PLUS, MULTIPLE, MINUS, RPAREN, LPAREN, DIVISION }
} = require('./lib/Lexer')
/**
 *  基类
 */
class AST {}
/**
 * binary operator， 具有两个操作数的运算符节点
 */
class BindOp extends AST {
  constructor(left, op, right) {
    super()
    this.left = left
    this.token = op
    this.right = right
  }
}

/**
 * operands，操作数节点
 */
class Num extends AST {
  constructor(token) {
    super()
    this.token = token
    this.value = token.value
  }
}

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

class NodeVisitor {
  //递归后续遍历
  recursionVisit(root, callback) {
    if (!root) {
      return
    }
    this.visit(root.left)
    this.visit(root.right)
    callback(root.token)
  }

  //非递归后续遍历
  visit(root, callback) {
    let stack = []
    let node = root
    let lastVisit = root
    while (node || stack.length > 0) {
      while (node) {
        stack.push(node)
        node = node.left
      }
      node = stack[stack.length - 1] //peek
      if (!node.right || node.right === lastVisit) {
        callback(node.token)
        stack.pop()
        lastVisit = node
        node = null
      } else {
        node = node.right
      }
    }
  }
}
class Interpreter {
  // 从ast求算数表达式的值
  interpret(ast) {}
}
let ast = new Parser('(1+2) * (3*3 + 1)').parse()
console.log(ast)
