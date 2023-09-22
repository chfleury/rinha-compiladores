const ast = require("./files/print.json");

const toIr = {
  Print: (node) => ["identifier", "print", toIr[node.value.kind](node.value)],
  Str: (node) => ["literal", node.value],
};

const irToJs = {
    identifier: (expr) => {
    if (expr[1] == "print") {
      console.log(irToJs[expr[2][0]](expr[2]));
    }
  },
  literal: (expr) => {
    return expr[1];
  },
};

const ir = toIr[ast.expression.kind](ast.expression);
irToJs[ir[0]](ir);
