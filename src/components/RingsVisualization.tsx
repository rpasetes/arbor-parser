import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as ts from 'typescript';
import { astRootToHierarchy, HierarchyNode } from '../utils/astToHierarchy';
import { getInkGradient } from '../theme/botanical';

interface RingsVisualizationProps {
  ast: ts.SourceFile;
  onNodeHover?: (node: ts.Node | null) => void;
}

export function RingsVisualization({ ast, onNodeHover }: RingsVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const onNodeHoverRef = useRef(onNodeHover);

  // Keep ref updated with latest callback
  useEffect(() => {
    onNodeHoverRef.current = onNodeHover;
  }, [onNodeHover]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Convert AST to hierarchy
    const hierarchyData = astRootToHierarchy(ast);

    // Set up dimensions
    const width = 800;
    const height = 600;
    const margin = 50; // Increased margin to prevent label clipping

    // Create D3 hierarchy
    const root = d3.hierarchy<HierarchyNode>(hierarchyData);

    // Sum values (required before pack)
    root.sum(d => d.value || 1);

    // Define type for pack layout node (includes x, y, r)
    type PackNode = d3.HierarchyCircularNode<HierarchyNode>;

    // Function to calculate font size for a node
    const getFontSize = (depth: number) => {
      const baseSize = 40 - (depth * 3); // 2x the original max (was 20)
      const minSize = 24; // 2x the original min (was 12)
      return Math.max(baseSize, minSize);
    };

    // Use font size as padding to visually tie labels to rings
    const maxFontSize = getFontSize(0);
    const pack = d3.pack<HierarchyNode>()
      .size([width - margin * 2, height - margin * 2])
      .padding(maxFontSize); // Padding matches font size

    // Apply pack layout
    pack(root);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('max-width', '100%')
      .style('height', 'auto');

    // Create a group for the visualization with margin
    const g = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    // Get all nodes (descendants) with pack layout properties
    const nodes = root.descendants() as PackNode[];

    // Create color scale based on depth (using ink gradient)
    const maxDepth = root.height;

    // Create groups for each node
    const node = g.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x!},${d.y!})`);

    // Add circles with ink-based coloring
    node.append('circle')
      .attr('r', d => d.r!)
      .attr('fill', d => getInkGradient(d.depth, maxDepth))
      .attr('fill-opacity', 0.15)
      .attr('stroke', d => getInkGradient(d.depth, maxDepth))
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function(_, d) {
        d3.select(this)
          .attr('fill', 'var(--vermillion)')
          .attr('fill-opacity', 0.3)
          .attr('stroke', 'var(--vermillion)')
          .attr('stroke-width', 2.5);
        // Highlight corresponding code in editor
        onNodeHoverRef.current?.(d.data.astNode);
      })
      .on('mouseleave', function(_, d) {
        d3.select(this)
          .attr('fill', getInkGradient(d.depth, maxDepth))
          .attr('fill-opacity', 0.15)
          .attr('stroke', getInkGradient(d.depth, maxDepth))
          .attr('stroke-width', 1.5);
        // Clear highlight in editor
        onNodeHoverRef.current?.(null);
      });

    // Create defs for curved text paths
    const defs = svg.append('defs');

    // Add curved text labels along the top arc of each circle
    nodes.forEach((d, i) => {
      const label = d.data.name;
      const fontSize = getFontSize(d.depth);

      // Only show label for top-level ring (depth === 0) and if circle is large enough
      if (d.depth === 0 && d.r! > 30) {
        // Create a circular path for the text to follow
        const pathId = `circle-path-${i}`;

        // Create arc path along the top of the circle
        // Start at -90 degrees (top), arc radius slightly inside the circle
        const arcRadius = d.r! - 5;

        defs.append('path')
          .attr('id', pathId)
          .attr('d', `
            M ${d.x! - arcRadius}, ${d.y!}
            A ${arcRadius}, ${arcRadius} 0 0 1 ${d.x! + arcRadius}, ${d.y!}
          `);

        // Truncate long labels based on circle circumference
        const maxChars = Math.floor((arcRadius * Math.PI) / (fontSize * 0.6));
        const truncatedLabel = label.length > maxChars ? label.slice(0, maxChars - 2) + '...' : label;

        // Add text element with textPath (ink color, serif font)
        g.append('text')
          .style('font-size', `${fontSize}px`)
          .style('fill', 'var(--ink-fresh)')
          .style('pointer-events', 'none')
          .style('font-family', 'var(--font-body)')
          .style('font-weight', '600')
          .style('letter-spacing', '-0.01em')
          .append('textPath')
          .attr('href', `#${pathId}`)
          .attr('startOffset', '50%')
          .attr('text-anchor', 'middle')
          .text(truncatedLabel);
      }
    });

    // Add tooltips on hover
    node.append('title')
      .text(d => d.data.name);

  }, [ast]);

  return (
    <div className="tree-container" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}
