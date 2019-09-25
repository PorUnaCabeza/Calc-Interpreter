# Calc Interpreter

A Simple Interpreter

## grammars

    expr: term((PLUS|MINUS) term)*
    term: factor((MUL|DIVISION) factor)*
    factor: (PLUS|MINUS)factor | INTEGER | LPAREN expr RPAREN
        
[Parser.js](https://github.com/PorUnaCabeza/Calc-Interpreter/blob/master/lib/Parser.js)    
[Lexer.js](https://github.com/PorUnaCabeza/Calc-Interpreter/blob/master/lib/Lexer.js)

## run

    // calc interpreter
    node calc-expression.js
    
    // convert js expression to lisp
    node transfer-expression-to-lisp.js

