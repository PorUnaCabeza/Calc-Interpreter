const INTEGER = 'INTEGER'
const PLUS = 'PLUS'
const MINUS = 'MINUS'
const MULTIPLE = 'MULTIPLE'
const DIVISION = 'DIVISION'
const LPAREN = 'LPAREN'
const RPAREN = 'RPAREN'
const EOF = 'EOF'
class Token {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

class Lexer {
  // lexical analyzer
  constructor(text) {
    this.text = text || ''
    this.pos = 0
    this.currentChar = this.text[this.pos]
  }
  isNull(value) {
    return value === null || value === undefined
  }
  isNumber(value) {
    return /\d+/.test(value)
  }
  isEmpty(value) {
    return value === null || value === undefined || value === '' || /\s+/.test(value)
  }
  advance() {
    if (this.pos > this.text.length - 1) {
      this.currentChar = null
      return
    }
    this.pos = this.pos + 1
    this.currentChar = this.text.charAt(this.pos)
  }
  skipSpace() {
    while (this.isEmpty(this.currentChar) && this.pos < this.text.length) {
      this.advance()
    }
  }
  toInteger() {
    let result = ''
    while (this.isNumber(this.currentChar)) {
      result += this.currentChar
      this.advance()
    }
    return parseInt(result)
  }
  getNextToken() {
    while (!this.isNull(this.currentChar)) {
      if (this.pos > this.text.length - 1) {
        this.currentToken = new Token(EOF, null)
        return this.currentToken
      }
      if (this.isEmpty(this.currentChar)) {
        this.skipSpace(this.currentChar)
        continue
      }
      if (this.isNumber(this.currentChar)) {
        this.currentToken = new Token(INTEGER, this.toInteger())
        return this.currentToken
      } else if (this.currentChar === '+') {
        this.currentToken = new Token(PLUS, this.currentChar)
      } else if (this.currentChar === '-') {
        this.currentToken = new Token(MINUS, this.currentChar)
      } else if (this.currentChar === '*') {
        this.currentToken = new Token(MULTIPLE, this.currentChar)
      } else if (this.currentChar === '/') {
        this.currentToken = new Token(DIVISION, this.currentChar)
      } else if (this.currentChar === '(') {
        this.currentToken = new Token(LPAREN, '(')
      } else if (this.currentChar === ')') {
        this.currentToken = new Token(RPAREN, ')')
      }
      this.advance()
      return this.currentToken
    }
    this.currentToken = new Token(EOF, null)
    return this.currentToken
  }
}

module.exports = {
  Lexer,
  constant: {
    INTEGER,
    PLUS,
    MULTIPLE,
    MINUS,
    RPAREN,
    LPAREN,
    DIVISION
  }
}
