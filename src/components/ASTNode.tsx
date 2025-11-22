import * as ts from 'typescript';
import { getNodeTypeName } from '../utils/parser';

interface ASTNodeProps {
  node: ts.Node;
  onHover?: (node: ts.Node | null) => void;
}

/**
 * ASTNode Component
 *
 * PARSING INSIGHT: What's in a Node?
 * ===================================
 * Each AST node represents a "syntactic construct" - a piece of grammar.
 *
 * Every node has:
 * - kind: What type of syntax (Identifier, BinaryExpression, etc.)
 * - pos/end: Where it lives in the source code (character positions)
 * - Children: Other nodes nested inside
 *
 * Example: In "x + 5", the BinaryExpression node has:
 * - left child: Identifier "x"
 * - operator: PlusToken "+"
 * - right child: NumericLiteral "5"
 *
 * This structure is why refactoring tools can rename "x" across your entire
 * codebase without accidentally changing strings that contain "x" or comments
 * that mention "x". The AST knows which "x" is the variable you care about.
 */
export function ASTNode({ node, onHover }: ASTNodeProps) {
  const typeName = getNodeTypeName(node.kind);

  // Extract interesting properties to display
  let displayValue = '';
  let valueColor = 'var(--ink-fresh)';

  // Show the actual value for literals
  if (ts.isIdentifier(node)) {
    displayValue = `: ${node.text}`;
    // Check if this identifier is a function name (parent is FunctionDeclaration/Expression/ArrowFunction)
    if (node.parent) {
      const parent = node.parent;
      if (
        ts.isFunctionDeclaration(parent) ||
        ts.isFunctionExpression(parent) ||
        ts.isArrowFunction(parent) ||
        ts.isMethodDeclaration(parent)
      ) {
        // Check if this identifier is the name property of the function
        if ((parent as any).name === node) {
          valueColor = 'var(--ochre)'; // Function names → ochre (yellow)
        }
      }
    }
  } else if (ts.isStringLiteral(node)) {
    displayValue = `: "${node.text}"`;
    valueColor = 'var(--indigo)'; // Strings → indigo
  } else if (ts.isNumericLiteral(node)) {
    displayValue = `: ${node.text}`;
    valueColor = 'var(--verdigris)'; // Numbers → verdigris
  }

  // Color statement node type labels (keywords/control flow/operators/TypeScript)
  let typeNameColor = 'var(--ink-fresh)';
  let typeNameWeight: 'normal' | '600' = 'normal';
  const kind = node.kind;

  if (
    kind === ts.SyntaxKind.IfStatement ||
    kind === ts.SyntaxKind.WhileStatement ||
    kind === ts.SyntaxKind.ForStatement ||
    kind === ts.SyntaxKind.ForInStatement ||
    kind === ts.SyntaxKind.ForOfStatement ||
    kind === ts.SyntaxKind.DoStatement ||
    kind === ts.SyntaxKind.ReturnStatement ||
    kind === ts.SyntaxKind.BreakStatement ||
    kind === ts.SyntaxKind.ContinueStatement ||
    kind === ts.SyntaxKind.SwitchStatement ||
    kind === ts.SyntaxKind.CaseClause ||
    kind === ts.SyntaxKind.DefaultClause ||
    kind === ts.SyntaxKind.TryStatement ||
    kind === ts.SyntaxKind.CatchClause ||
    kind === ts.SyntaxKind.ThrowStatement ||
    kind === ts.SyntaxKind.VariableStatement ||
    kind === ts.SyntaxKind.ExpressionStatement ||
    kind === ts.SyntaxKind.VariableDeclarationList ||
    kind === ts.SyntaxKind.AwaitExpression ||
    // TypeScript: interface and type declarations
    kind === ts.SyntaxKind.InterfaceDeclaration ||
    kind === ts.SyntaxKind.TypeAliasDeclaration ||
    // Tokens: operators and comparison
    kind === ts.SyntaxKind.PercentToken ||
    kind === ts.SyntaxKind.PlusToken ||
    kind === ts.SyntaxKind.MinusToken ||
    kind === ts.SyntaxKind.AsteriskToken ||
    kind === ts.SyntaxKind.SlashToken ||
    kind === ts.SyntaxKind.EqualsEqualsToken ||
    kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
    kind === ts.SyntaxKind.ExclamationEqualsToken ||
    kind === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
    kind === ts.SyntaxKind.LessThanToken ||
    kind === ts.SyntaxKind.LessThanEqualsToken ||
    kind === ts.SyntaxKind.GreaterThanToken ||
    kind === ts.SyntaxKind.GreaterThanEqualsToken ||
    kind === ts.SyntaxKind.AmpersandAmpersandToken ||
    kind === ts.SyntaxKind.BarBarToken
  ) {
    typeNameColor = 'var(--vermillion)'; // Statements, awaits, operators, TS declarations → vermillion (red)
  }

  // TypeScript: Make type-related keywords bold
  if (
    kind === ts.SyntaxKind.StringKeyword ||
    kind === ts.SyntaxKind.NumberKeyword ||
    kind === ts.SyntaxKind.BooleanKeyword ||
    kind === ts.SyntaxKind.VoidKeyword ||
    kind === ts.SyntaxKind.AnyKeyword ||
    kind === ts.SyntaxKind.UnknownKeyword ||
    kind === ts.SyntaxKind.NeverKeyword ||
    kind === ts.SyntaxKind.ObjectKeyword ||
    kind === ts.SyntaxKind.TypeReference ||
    kind === ts.SyntaxKind.TypeLiteral ||
    kind === ts.SyntaxKind.UnionType ||
    kind === ts.SyntaxKind.IntersectionType
  ) {
    typeNameWeight = '600'; // Bold type keywords
  }

  return (
    <div
      className="ast-node"
      onMouseEnter={() => onHover?.(node)}
      onMouseLeave={() => onHover?.(null)}
    >
      <strong style={{ color: typeNameColor, fontWeight: typeNameWeight }}>{typeName}</strong>
      {displayValue && <span className="ast-node-value" style={{ color: valueColor }}>{displayValue}</span>}
    </div>
  );
}
