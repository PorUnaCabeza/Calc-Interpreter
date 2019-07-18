const INTEGER = "INTEGER";
const PLUS = "PLUS";
const MINUS = "MINUS";
const MULTIPLE = "MULTIPLE";
const DIVISION = "DIVISION";
const LPAREN = "LPAREN";
const RPAREN = "RPAREN";
const EOF = "EOF";
class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}
class Lexer {
  // lexical analyzer
  constructor(text) {
    this.text = text || "";
    this.pos = 0;
    this.currentChar = this.text[this.pos];
  }
  isNull(value) {
    return value === null || value === undefined;
  }
  isNumber(value) {
    return /\d+/.test(value);
  }
  isEmpty(value) {
    return (
      value === null || value === undefined || value === "" || /\s+/.test(value)
    );
  }
  advance() {
    if (this.pos > this.text.length - 1) {
      this.currentChar = null;
      return;
    }
    this.pos = this.pos + 1;
    this.currentChar = this.text.charAt(this.pos);
  }
  skipSpace() {
    while (this.isEmpty(this.currentChar) && this.pos < this.text.length) {
      this.advance();
    }
  }
  toInteger() {
    let result = "";
    while (this.isNumber(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return parseInt(result);
  }
  getNextToken() {
    while (!this.isNull(this.currentChar)) {
      if (this.pos > this.text.length - 1) {
        this.currentToken = new Token(EOF, null);
        return this.currentToken;
      }
      if (this.isEmpty(this.currentChar)) {
        this.skipSpace(this.currentChar);
        continue;
      }
      if (this.isNumber(this.currentChar)) {
        this.currentToken = new Token(INTEGER, this.toInteger());
        return this.currentToken;
      } else if (this.currentChar === "+") {
        this.currentToken = new Token(PLUS, this.currentChar);
      } else if (this.currentChar === "-") {
        this.currentToken = new Token(MINUS, this.currentChar);
      } else if (this.currentChar === "*") {
        this.currentToken = new Token(MULTIPLE, this.currentChar);
      } else if (this.currentChar === "/") {
        this.currentToken = new Token(DIVISION, this.currentChar);
      } else if (this.currentChar === "(") {
        this.currentToken = new Token(LPAREN, "(");
      } else if (this.currentChar === ")") {
        this.currentToken = new Token(RPAREN, ")");
      }
      this.advance();
      return this.currentToken;
    }
    this.currentToken = new Token(EOF, null);
    return this.currentToken;
  }
}
class Interpreter {
  constructor(text) {
    this.lexer = new Lexer(text);
    this.currentToken = this.lexer.getNextToken();
  }
  eat(type) {
    if (this.currentToken.type !== type) return this.error();
    this.currentToken = this.lexer.getNextToken();
  }
  factor() {
    let type = this.currentToken.type;
    let r;
    if (type === INTEGER) {
      r = this.currentToken.value;
      this.eat(INTEGER);
    } else if (type === LPAREN) {
      this.eat(LPAREN);
      r = this.expr();
      this.eat(RPAREN);
    }
    return r;
  }
  term() {
    let r = this.factor();
    while (/MULTIPLE|DIVISION/.test(this.currentToken.type)) {
      let type = this.currentToken.type;
      if (type === MULTIPLE) {
        this.eat(MULTIPLE);
        r = r * this.factor();
      } else if (type === DIVISION) {
        this.eat(DIVISION);
        r = r / this.factor();
      }
    }
    return r;
  }
  expr() {
    let result = this.term();
    while (/MINUS|PLUS/.test(this.currentToken.type)) {
      let type = this.currentToken.type;
      if (type === MINUS) {
        this.eat(MINUS);
        result = result - this.term();
      } else if (type === PLUS) {
        this.eat(PLUS);
        result = result + this.term();
      }
    }
    return result;
  }
  error() {
    throw new Error("error input");
  }
}
console.log(new Interpreter(" (1 +  10  )  * 3 / ( 1 + 2) ").expr());
