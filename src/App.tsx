import { useState } from "react";
import { parseCode } from "./utils/parser";
import { CodeEditor } from "./components/CodeEditor";
import { RingsVisualization } from "./components/RingsVisualization";
import { ASTNodes } from "./components/ASTNodes";
import { SegmentedControl } from "./components/SegmentedControl";
import { CustomSelect } from "./components/CustomSelect";
import { examples } from "./examples";

/**
 * Main App Component
 *
 * PARSING INSIGHT: How Parsers Read Code
 * =======================================
 * Parsers transform text into structured trees (ASTs) through two phases:
 *
 * 1. LEXICAL ANALYSIS (Tokenization)
 *    "const x = 5" → [CONST, IDENTIFIER, EQUALS, NUMBER]
 *    Breaking code into smallest meaningful units
 *
 * 2. SYNTACTIC ANALYSIS (Tree Building)
 *    Tokens → VariableStatement tree with nested expression nodes
 *    Capturing the semantic relationships and nesting structure
 *
 * Why this matters: Every developer tool operates on ASTs, not text.
 *
 * - Syntax highlighters: Use tokens to colorize keywords, strings, operators
 * - Linters (ESLint): Traverse trees to find patterns that violate rules
 * - Formatters (Prettier): Parse → discard formatting → regenerate with consistency
 * - Refactoring tools: Find all references to a symbol across entire codebases
 * - Transpilers (Babel): Transform tree nodes to generate different languages
 * - IDEs: Parse in real-time for autocomplete, navigation, type checking
 *
 * This visualizer shows you what parsers see: the hidden structure beneath your code.
 */
function App() {
  const [sourceCode, setSourceCode] = useState(examples[0].code);
  const [selectedExample, setSelectedExample] = useState<string>(
    examples[0].name,
  );
  const [vizMode, setVizMode] = useState<"nodes" | "rings">("nodes");

  // Parse the code whenever it changes (always using TypeScript mode)
  const parseResult = parseCode(sourceCode);

  // Handle example selection
  const handleExampleChange = (exampleName: string) => {
    const example = examples.find((ex) => ex.name === exampleName);
    if (example) {
      setSourceCode(example.code);
      setSelectedExample(exampleName);
    }
  };

  // Handle manual code changes - switch to "Custom" if user edits
  const handleCodeChange = (newCode: string) => {
    setSourceCode(newCode);

    // Check if the new code matches any example
    const matchingExample = examples.find((ex) => ex.code === newCode);
    if (matchingExample) {
      setSelectedExample(matchingExample.name);
    } else if (selectedExample !== "Custom") {
      setSelectedExample("Custom");
    }
  };

  return (
    <div
      className="paper-layer"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Arbor Parser</h1>
        <p className="app-subtitle">
          See how parsers read your code. Every syntax tree, visualized.
        </p>
      </header>

      {/* Split layout: Editor left, Tree right */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left half: Code Editor */}
        <div
          className="paper-layer"
          style={{
            width: "50%",
            padding: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRight: "2px solid var(--paper-stained)",
          }}
        >
          {/* Example selector dropdown */}
          <CustomSelect
            label="Preset Examples:"
            value={selectedExample}
            onChange={handleExampleChange}
            options={[
              ...examples.map((ex) => ({ value: ex.name, label: ex.name })),
              ...(selectedExample === "Custom"
                ? [{ value: "Custom", label: "Custom" }]
                : []),
            ]}
          />

          <CodeEditor value={sourceCode} onChange={handleCodeChange} />
        </div>

        {/* Right half: Visualization */}
        <div
          style={{
            width: "50%",
            padding: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Visualization Toggle - fixed to left */}
          <div
            style={{
              marginBottom: "var(--space-md)",
              alignSelf: "flex-start",
            }}
          >
            <SegmentedControl
              options={["Nodes", "Rings"]}
              selected={vizMode}
              onChange={(mode) => setVizMode(mode as "nodes" | "rings")}
            />
          </div>

          {/* Viz container */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {parseResult.success ? (
              vizMode === "nodes" ? (
                <ASTNodes ast={parseResult.ast} />
              ) : (
                <RingsVisualization ast={parseResult.ast} />
              )
            ) : (
              <div
                className="paper-elevated"
                style={{
                  padding: "var(--space-md)",
                  border: "2px solid var(--vermillion)",
                  borderRadius: "4px",
                }}
              >
                <strong
                  style={{
                    color: "var(--vermillion)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Parse Error:
                </strong>{" "}
                <span
                  style={{
                    color: "var(--ink-fresh)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {parseResult.error}
                </span>
                {parseResult.line && parseResult.column && (
                  <div
                    style={{
                      marginTop: "var(--space-sm)",
                      fontSize: "0.875rem",
                      color: "var(--ink-faded)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Line {parseResult.line}, Column {parseResult.column}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
