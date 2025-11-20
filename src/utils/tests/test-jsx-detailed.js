import * as ts from 'typescript';

const jsxCode = `<button>{label}</button>`;

console.log("=== ScriptKind.TSX - Detailed AST ===");
const astTSX = ts.createSourceFile('temp.tsx', jsxCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

function printNodeDetailed(node, depth = 0) {
  const indent = "  ".repeat(depth);
  const kindName = ts.SyntaxKind[node.kind];

  let extra = "";
  if (node.kind === ts.SyntaxKind.Identifier) {
    extra = ` [${node.text}]`;
  } else if (node.kind === ts.SyntaxKind.JsxText) {
    extra = ` [${node.text}]`;
  }

  console.log(`${indent}${kindName}${extra}`);
  ts.forEachChild(node, child => printNodeDetailed(child, depth + 1));
}

printNodeDetailed(astTSX);

console.log("\n=== ScriptKind.TS - Same code ===");
const astTS = ts.createSourceFile('temp.ts', jsxCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
printNodeDetailed(astTS);
