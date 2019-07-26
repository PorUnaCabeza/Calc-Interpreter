const { NUM_TYPE, OPERATOR_TYPE, UNARY_OPERATOR_TYPE } = require('./Parser')
const {
  constant: { PLUS, MULTIPLE, MINUS, DIVISION }
} = require('./Lexer')

/**
 * 从ast中计算出表达式的值
 */
class Interpreter {
  visit(node) {
    if (node.type === OPERATOR_TYPE) {
      return this.visitOp(node)
    } else if (node.type === NUM_TYPE) {
      return this.visitNum(node)
    } else if (node.type === UNARY_OPERATOR_TYPE) {
      return this.visitUnaryOp(node)
    }
  }
  visitOp(node) {
    if (node.token.type === MULTIPLE) {
      return this.visit(node.left) * this.visit(node.right)
    } else if (node.token.type === DIVISION) {
      return this.visit(node.left) / this.visit(node.right)
    } else if (node.token.type === PLUS) {
      return this.visit(node.left) + this.visit(node.right)
    } else if (node.token.type === MINUS) {
      return this.visit(node.left) - this.visit(node.right)
    }
  }
  visitUnaryOp(node) {
    if (node.token.type === PLUS) return +this.visit(node.children)
    else if (node.token.type === MINUS) return -this.visit(node.children)
  }
  visitNum(node) {
    return node.token.value
  }
  interpret(node) {
    let r = this.visit(node)
    console.log(r)
    return r
  }
}

module.exports = {
  Interpreter
}
