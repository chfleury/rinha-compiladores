const ast = require("./files/print.json");

const toIr = {
  Print: (node) => ["identifier", "print", toIr[node.value.kind](node.value)],
  Str: (node) => ["literal", "str", node.value],
  Call: (node) => ["identifier", toIr[node.callee.kind](node.callee)],
  Var:  (node) => ["identifier", node.arguments.map(arg => toIr[arg.kind](arg)), toIr[node.callee.kind](node.callee)],
  Int: (node) => ["literal", "int", node.value]
};

const irToJs = {
    identifier: (expr) => {
    if (expr[1] === "print") {
      console.log(irToJs[expr[2][0]](expr[2]));
    }
  },
  literal: (expr) => {
    const literalMapper = {
        str: (l)=> String(l),
        int: (l) => Number(l)
    }
    return literalMapper[expr[1]](expr[2]);
  },
};

const ir = toIr[ast.expression.kind](ast.expression);
irToJs[ir[0]](ir);
