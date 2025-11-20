import * as ts from 'typescript';

export interface ParseResult {
  success: true;
  ast: ts.SourceFile;
}

export interface ParseError {
  success: false;
  error: string;
  line?: number;
  column?: number;
}

/**
 * Parse source code into an Abstract Syntax Tree (AST)
 *
 * PARSING INSIGHT #1: Two-Phase Process
 * ==============================================
 * When you write code, the parser does two main things:
 * 1. LEXICAL ANALYSIS (tokenization): "const x = 5" → [CONST, IDENTIFIER, EQUALS, NUMBER]
 * 2. SYNTACTIC ANALYSIS (parsing): tokens → tree structure
 *
 * TypeScript's createSourceFile() does BOTH phases for us in one call!
 * It returns a SourceFile node, which is the root of the entire AST.
 *
 * PARSING INSIGHT #2: Why Trees?
 * ==============================================
 * Code has nested structure:
 *   if (x > 5) { return x * 2; }
 *
 * The tree captures this nesting:
 *   IfStatement
 *   ├── condition: BinaryExpression (x > 5)
 *   └── thenStatement: Block
 *       └── ReturnStatement
 *           └── expression: BinaryExpression (x * 2)
 *
 * This structure is what lets the engine know: "evaluate condition first,
 * then decide whether to execute the block."
 */
export function parseCode(
  sourceCode: string
): ParseResult | ParseError {
  try {
    /**
     * PARSING INSIGHT #3: Parser Configuration
     * ==============================================
     * We use TypeScript's parser because it's a superset of JavaScript.
     * This means it handles both regular JS and TS with type annotations.
     *
     * Why TypeScript's parser is special:
     * - Used by VS Code for autocomplete, navigation, refactoring
     * - Used by ESLint via @typescript-eslint/parser for linting TypeScript
     * - Designed to parse INCOMPLETE code (critical for IDE features)
     * - Fault-tolerant: returns partial AST even with syntax errors
     *
     * createSourceFile parameters:
     * 1. fileName: Just for error messages (not actually reading a file)
     * 2. sourceCode: The actual code string to parse
     * 3. languageVersion: ES2020, ES2015, etc. (we use Latest for max features)
     * 4. setParentNodes: true = each node knows its parent (useful for traversal)
     * 5. scriptKind: TS mode handles both JS and TS syntax
     */
    const ast = ts.createSourceFile(
      'temp.ts',
      sourceCode,
      ts.ScriptTarget.Latest,
      true, // setParentNodes
      ts.ScriptKind.TS
    );

    /**
     * PARSING INSIGHT #4: Error Recovery
     * ==============================================
     * TypeScript's parser is "fault-tolerant" - it tries to parse as much
     * as it can even with syntax errors. This is crucial for IDEs that need
     * to provide completions even when your code isn't perfect yet.
     *
     * Example: If you type "const x = " and pause, the parser returns:
     * - VariableDeclaration node for "x"
     * - Missing initializer (marked as error)
     * - But enough structure for autocomplete to suggest values
     *
     * This is why VS Code can offer suggestions mid-typing. The parser works
     * with incomplete code, returning partial ASTs that tools can reason about.
     *
     * For our visualizer, we return the full AST regardless of errors, letting
     * you see how the parser interprets even malformed code.
     */

    return {
      success: true,
      ast,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

/**
 * Get a human-readable name for a SyntaxKind enum value
 *
 * PARSING INSIGHT #5: Node Types
 * ==============================================
 * Every node in the AST has a "kind" property - a number that identifies
 * what type of syntax element it represents. TypeScript has 300+ different
 * SyntaxKind values!
 *
 * Examples:
 * - SyntaxKind.Identifier = 80 (variable/function names)
 * - SyntaxKind.BinaryExpression = 226 (x + y, a === b, etc.)
 * - SyntaxKind.FunctionDeclaration = 261 (function definitions)
 *
 * These SyntaxKind enums are what tools match against:
 * - ESLint rule: "When you see a VariableDeclaration, check if it's used"
 * - Prettier: "When you see an ArrowFunctionExpression, format it consistently"
 * - Refactoring: "Find all Identifier nodes with name 'oldName', rename to 'newName'"
 *
 * This function converts the number back to a readable string for display.
 */
export function getNodeTypeName(kind: ts.SyntaxKind): string {
  return ts.SyntaxKind[kind];
}
