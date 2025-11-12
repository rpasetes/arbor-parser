import * as ts from 'typescript';
import { ASTNode } from './ASTNode';

interface ASTTreeProps {
  ast: ts.SourceFile;
  onNodeClick?: (node: ts.Node) => void;
  highlightedNode?: ts.Node;
}

/**
 * ASTTree Component
 *
 * COMPILER INSIGHT: Tree Traversal
 * ==================================
 * The AST is a recursive data structure - nodes contain nodes contain nodes.
 * To render it, we use recursive rendering: a component that renders itself
 * for each child.
 *
 * This mirrors how the compiler traverses the tree during compilation:
 * - Visit a node
 * - Process it
 * - Recursively visit its children
 *
 * Tree traversal is fundamental to everything compilers do:
 * - Type checking: "visit every node, verify types match"
 * - Code generation: "visit every node, emit corresponding machine code"
 * - Optimization: "visit every node, look for patterns to improve"
 */
export function ASTTree({ ast, onNodeClick, highlightedNode }: ASTTreeProps) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: '0.75rem',
      backgroundColor: '#1a1a1a',
      border: '1px solid #444',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1.2rem' }}>
        Abstract Syntax Tree
      </h2>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>
        <TreeNode
          node={ast}
          onNodeClick={onNodeClick}
          highlightedNode={highlightedNode}
        />
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: ts.Node;
  onNodeClick?: (node: ts.Node) => void;
  highlightedNode?: ts.Node;
}

/**
 * Recursive TreeNode component
 * Each node renders itself and all its children
 */
function TreeNode({ node, onNodeClick, highlightedNode }: TreeNodeProps) {
  // Collect children
  const children: ts.Node[] = [];
  ts.forEachChild(node, (child) => {
    children.push(child);
  });

  const isHighlighted = node === highlightedNode;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      {/* Render this node */}
      <ASTNode
        node={node}
        onClick={onNodeClick}
        isHighlighted={isHighlighted}
      />

      {/* Recursively render children with indentation */}
      {children.length > 0 && (
        <div style={{
          marginLeft: '2rem',
          paddingLeft: '1rem',
          borderLeft: '2px solid #444',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {children.map((child, index) => (
            <TreeNode
              key={`${child.kind}-${child.pos}-${index}`}
              node={child}
              onNodeClick={onNodeClick}
              highlightedNode={highlightedNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
