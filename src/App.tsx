import { parseCode, getNodeTypeName } from "./utils/parser";
import * as ts from "typescript";

function App() {
  // Quick test of our parser
  const testCode = "const x: number = 42";
  const result = parseCode(testCode, "typescript");

  if (!result.success) {
    return (
      <div>
        <h1>Compile Time</h1>
        <p>Parser Error: {result.error}</p>
      </div>
    );
  }

  // Walk the AST and collect node types
  const nodeTypes: string[] = [];
  function visit(node: ts.Node) {
    nodeTypes.push(getNodeTypeName(node.kind));
    ts.forEachChild(node, visit);
  }
  visit(result.ast);

  return (
    <div>
      <h1>Compile Time</h1>
      <p>
        Testing parser with: <code>{testCode}</code>
      </p>
      <h2>AST Node Types Found:</h2>
      <ul style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}>
        {nodeTypes.map((type, i) => (
          <li key={i}>{type}</li>
        ))}
      </ul>
      <p style={{ marginTop: "2rem", color: "#888" }}>
        ✓ Parser is working! Found {nodeTypes.length} nodes.
      </p>
    </div>
  );
}

export default App;
