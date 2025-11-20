import * as ts from 'typescript';

const testCases = [
  {
    name: "Comparison operators",
    code: `const result = a < b && c > d;`
  },
  {
    name: "Generic type syntax",
    code: `const arr: Array<number> = [1, 2, 3];`
  },
  {
    name: "Generic function call",
    code: `const result = identity<string>("hello");`
  },
  {
    name: "Nested generics",
    code: `type Complex = Map<string, Array<number>>;`
  },
  {
    name: "Chained comparisons",
    code: `if (x < y && y < z) { console.log("increasing"); }`
  },
  {
    name: "Type assertion (as syntax)",
    code: `const value = someValue as string;`
  },
  {
    name: "Arrow function with generic",
    code: `const identity = <T>(x: T): T => x;`
  },
  {
    name: "Loose bracket (syntax error)",
    code: `const x = <;`
  },
  {
    name: "Mixed comparison and generic",
    code: `const check = x < Array<number>.length;`
  }
];

function analyzeCode(code, scriptKind, kindName) {
  const ast = ts.createSourceFile(
    scriptKind === ts.ScriptKind.TSX ? 'temp.tsx' : 'temp.ts',
    code,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  );

  const hasErrors = ast.parseDiagnostics && ast.parseDiagnostics.length > 0;
  const errors = hasErrors ? ast.parseDiagnostics.map(d =>
    ts.flattenDiagnosticMessageText(d.messageText, ' ')
  ) : [];

  // Find what node types are present
  const nodeTypes = new Set();
  function collectNodeTypes(node) {
    nodeTypes.add(ts.SyntaxKind[node.kind]);
    ts.forEachChild(node, collectNodeTypes);
  }
  collectNodeTypes(ast);

  return {
    hasErrors,
    errors,
    hasJsx: Array.from(nodeTypes).some(t => t.startsWith('Jsx')),
    nodeTypes: Array.from(nodeTypes).filter(t =>
      !t.includes('Token') && !t.includes('Keyword') && t !== 'SourceFile' && t !== 'EndOfFileToken'
    )
  };
}

console.log("=".repeat(80));
testCases.forEach(({ name, code }) => {
  console.log(`\n${name}`);
  console.log(`Code: ${code}`);
  console.log("-".repeat(80));

  const tsResult = analyzeCode(code, ts.ScriptKind.TS, 'TS');
  const tsxResult = analyzeCode(code, ts.ScriptKind.TSX, 'TSX');

  console.log(`TS mode:  ${tsResult.hasErrors ? '❌ ERRORS' : '✅ OK'} | JSX detected: ${tsResult.hasJsx ? 'YES' : 'NO'}`);
  if (tsResult.hasErrors) {
    tsResult.errors.forEach(e => console.log(`          ${e}`));
  }
  console.log(`          Nodes: ${tsResult.nodeTypes.slice(0, 5).join(', ')}`);

  console.log(`TSX mode: ${tsxResult.hasErrors ? '❌ ERRORS' : '✅ OK'} | JSX detected: ${tsxResult.hasJsx ? 'YES' : 'NO'}`);
  if (tsxResult.hasErrors) {
    tsxResult.errors.forEach(e => console.log(`          ${e}`));
  }
  console.log(`          Nodes: ${tsxResult.nodeTypes.slice(0, 5).join(', ')}`);

  if (tsResult.hasErrors !== tsxResult.hasErrors || tsResult.hasJsx !== tsxResult.hasJsx) {
    console.log(`⚠️  DIFFERENCE DETECTED`);
  }
});
console.log("\n" + "=".repeat(80));
