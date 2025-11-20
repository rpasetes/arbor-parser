import * as ts from 'typescript';

const jsxCode = `
function Button({ label }) {
  return (
    <button className="btn">
      {label}
    </button>
  );
}
`;

console.log("=== Parsing with ScriptKind.TS ===");
try {
  const astTS = ts.createSourceFile(
    'temp.ts',
    jsxCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  console.log("Success! AST created");
  console.log("Parse diagnostics:", astTS.parseDiagnostics?.length || 0);

  if (astTS.parseDiagnostics && astTS.parseDiagnostics.length > 0) {
    astTS.parseDiagnostics.forEach(d => {
      console.log("Error:", ts.flattenDiagnosticMessageText(d.messageText, '\n'));
    });
  }
} catch (e) {
  console.log("Failed:", e.message);
}

console.log("\n=== Parsing with ScriptKind.TSX ===");
try {
  const astTSX = ts.createSourceFile(
    'temp.tsx',
    jsxCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  console.log("Success! AST created");
  console.log("Parse diagnostics:", astTSX.parseDiagnostics?.length || 0);

  // Show some structure
  function printNode(node, depth = 0) {
    if (depth > 3) return; // Limit depth
    const indent = "  ".repeat(depth);
    console.log(`${indent}${ts.SyntaxKind[node.kind]}`);
    ts.forEachChild(node, child => printNode(child, depth + 1));
  }

  console.log("\nAST Structure (first few levels):");
  printNode(astTSX);

} catch (e) {
  console.log("Failed:", e.message);
}
