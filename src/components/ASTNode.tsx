import * as ts from 'typescript';
import { getNodeTypeName } from '../utils/parser';

interface ASTNodeProps {
  node: ts.Node;
  onClick?: (node: ts.Node) => void;
  isHighlighted?: boolean;
}

/**
 * ASTNode Component
 *
 * COMPILER INSIGHT: What's in a Node?
 * =====================================
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
 */
export function ASTNode({ node, onClick, isHighlighted }: ASTNodeProps) {
  const typeName = getNodeTypeName(node.kind);

  // Extract interesting properties to display
  let displayValue = '';

  // Show the actual value for literals and identifiers
  if (ts.isIdentifier(node)) {
    displayValue = `: ${node.text}`;
  } else if (ts.isStringLiteral(node)) {
    displayValue = `: "${node.text}"`;
  } else if (ts.isNumericLiteral(node)) {
    displayValue = `: ${node.text}`;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // Don't trigger parent clicks
        onClick?.(node);
      }}
      style={{
        padding: '0.5rem 0.75rem',
        backgroundColor: isHighlighted ? '#646cff' : '#2a2a2a',
        border: '1px solid #444',
        borderRadius: '4px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background-color 0.2s',
        fontSize: '13px',
        fontFamily: 'monospace',
      }}
    >
      <strong>{typeName}</strong>
      {displayValue && <span style={{ color: '#aaa' }}>{displayValue}</span>}
    </div>
  );
}
