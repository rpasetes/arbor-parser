import * as ts from 'typescript';

export interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
  value?: number;
  syntaxKind?: ts.SyntaxKind;
  astNode: ts.Node; // Reference to original AST node for hover highlighting
}

/**
 * Converts a TypeScript AST node into a D3-compatible hierarchy structure
 * for circle packing visualization.
 */
export function astToHierarchy(node: ts.Node): HierarchyNode {
  const syntaxKind = node.kind;
  const kindName = ts.SyntaxKind[syntaxKind];

  // Get node text for terminals (literals, identifiers, etc.)
  let nodeName = kindName;

  // For leaf nodes with meaningful text, append it to the name
  if (ts.isIdentifier(node)) {
    nodeName = `Identifier: ${node.text}`;
  } else if (ts.isNumericLiteral(node)) {
    nodeName = `NumericLiteral: ${node.text}`;
  } else if (ts.isStringLiteral(node)) {
    nodeName = `StringLiteral: "${node.text}"`;
  } else if (ts.isToken(node) && node.kind !== ts.SyntaxKind.EndOfFileToken) {
    // For operators and keywords, just use the kind name
    nodeName = kindName;
  }

  // Get children, filtering out noise
  const children: HierarchyNode[] = [];

  ts.forEachChild(node, (child) => {
    // Skip EndOfFileToken wrapper
    if (child.kind === ts.SyntaxKind.EndOfFileToken) {
      return;
    }

    children.push(astToHierarchy(child));
  });

  // Build hierarchy node
  const hierarchyNode: HierarchyNode = {
    name: nodeName,
    syntaxKind,
    value: 1, // Uniform sizing for now - can make dynamic later
    astNode: node, // Store reference to original AST node
  };

  if (children.length > 0) {
    hierarchyNode.children = children;
  }

  return hierarchyNode;
}

/**
 * Converts the root AST (SourceFile) to hierarchy, skipping the SourceFile wrapper
 * to start with the actual code content.
 */
export function astRootToHierarchy(sourceFile: ts.SourceFile): HierarchyNode {
  // If there's only one statement, start from there to avoid extra nesting
  if (sourceFile.statements.length === 1) {
    return astToHierarchy(sourceFile.statements[0]);
  }

  // Otherwise, create a root node with all statements as children
  return {
    name: 'Program',
    syntaxKind: ts.SyntaxKind.SourceFile,
    value: 1,
    astNode: sourceFile, // Store reference to original AST node
    children: sourceFile.statements.map(stmt => astToHierarchy(stmt)),
  };
}
