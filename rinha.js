const ast = require("./files/print.json");

const toIr = {
  Print: (node) => ["identifier", "print", toIr[node.value.kind](node.value)],
  Str: (node) => ["literal", node.kind, node.value],
  Call: (node) => [
    "call",
    node.arguments?.map((arg) => toIr[arg.kind](arg)) ?? [],
    toIr?.[node.callee.kind]?.(node.callee),
  ],
  Var: (node) => ["identifier", node.text],
  Int: (node) => ["literal", node.kind, node.value],
  Let: (node) => [
    "identifier",
    toIr[node.value.kind](node.value),
    toIr[node.next.kind](node.next),
  ],
  Function: (node) => [
    "keyword",
    node.kind,
    node.parameters?.map((param) => param.text) ?? null,
    toIr[node.value.kind](node.value),
  ],
  If: (node) => [
    "keyword",
    node.value.kind,
    toIr[node.value.condition.kind](node.value.condition),
    toIr[node.value.then.kind](node.value.then),
    toIr?.[node.value.otherwise?.kind]?.(node.value.otherwise) ?? null,
  ],
  Binary: (node) => [
    "operator",
    node.op,
    toIr[node.lhs.kind](node.lhs),
    toIr[node.rhs.kind](node.rhs),
  ],
};

const irToJs = {
  identifier: (expr) => {
    if (expr[1] === "print") {
      console.log(irToJs[expr[2][0]](expr[2]));
    }
  },
  literal: (expr) => {
    const literalMapper = {
      Str: (l) => String(l),
      Int: (l) => Number(l),
    };
    return literalMapper[expr[1]](expr[2]);
  },
  operator: (expr) => {
    // const operatorMapper = {
    //   Add: (l, r) => l + r,
    //   Sub: (l, r) => l - r,
    //   Eq: (l, r) => l == r,
    // };

     const operatorMapper = {
      Add: (l, r) => irToJs[l[0]](l) + irToJs[r[0]](r),
      Sub: (l, r) => irToJs[l[0]](l) - irToJs[r[0]](r),
      Eq: (l, r) => irToJs[l[0]](l) == irToJs[r[0]](r),
    };
    return operatorMapper[expr[1]](expr[2], expr[3]);
  },
  keyword: (expr) => {
    const keywordMapper = {
      If: (condition, then, otherwise) => (condition ? then : otherwise),
      Function: (params, body) => (params) => body,
    };
    return keywordMapper[expr[1]](expr[2], expr[3], expr[4]);
  },
};

const ir = toIr[ast.expression.kind](ast.expression);
irToJs[ir[0]](ir);
