import { useEffect, useRef, useState } from 'react';
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

  // Track focused node for UI (breadcrumbs, reset button)
  const [focusedNode, setFocusedNode] = useState<ts.Node | null>(null);

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
      .attr('transform', `translate(${margin}, ${margin})`)
      .attr('class', 'zoom-group');

    // Get all nodes (descendants) with pack layout properties
    const nodes = root.descendants() as PackNode[];

    // Create color scale based on depth (using ink gradient)
    const maxDepth = root.height;

    // Create defs for curved text paths early
    const defs = svg.append('defs');

    // Store label elements for dynamic updates (declare before use!)
    const labelElements: Array<{ node: PackNode; text: d3.Selection<SVGTextElement, unknown, null, undefined>; pathId: string }> = [];

    // Create groups for each node
    const node = g.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x!},${d.y!})`);

    // Add circles with ink-based coloring
    const circles = node.append('circle')
      .attr('r', d => d.r!)
      .attr('fill', d => getInkGradient(d.depth, maxDepth))
      .attr('fill-opacity', 0.15)
      .attr('stroke', d => getInkGradient(d.depth, maxDepth))
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .style('pointer-events', 'all') // Explicitly enable pointer events
      .on('click', function(event, clickedNode) {
        event.stopPropagation();

        // Set focused node for UI
        setFocusedNode(clickedNode.data.astNode);

        // Re-select group from DOM (not closure reference)
        const currentSvg = d3.select(svgRef.current);
        const currentGroup = currentSvg.select('.zoom-group');

        // Hide all current labels
        currentGroup.selectAll('.ring-label').style('opacity', 0);

        // Calculate transform to center and scale this circle
        const viewWidth = width - margin * 2;
        const viewHeight = height - margin * 2;
        const centerX = viewWidth / 2;
        const centerY = viewHeight / 2;

        // Scale so this circle fills the viewport exactly like the root does by default
        // The root circle naturally fills the pack layout size, so we match that
        const targetSize = Math.min(viewWidth, viewHeight);
        const scale = targetSize / (clickedNode.r! * 2);

        // Calculate translation to center the circle
        const translateX = centerX - clickedNode.x! * scale;
        const translateY = centerY - clickedNode.y! * scale;

        // Animate zoom with smooth easing
        currentGroup.transition()
          .duration(300)
          .ease(d3.easeCubicOut)
          .attr('transform', `translate(${margin + translateX}, ${margin + translateY}) scale(${scale})`)
          .on('end', () => {
            // After zoom completes, show label for the clicked node (new top-level)
            const clickedLabel = labelElements.find(l => l.node === clickedNode);
            if (clickedLabel) {
              d3.select(clickedLabel.text).style('opacity', 1);
            }
          });

        // Maintain hover highlight
        onNodeHoverRef.current?.(clickedNode.data.astNode);
      })
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
        const textElement = g.append('text')
          .style('font-size', `${fontSize}px`)
          .style('fill', 'var(--ink-fresh)')
          .style('pointer-events', 'none') // Critical: don't block clicks!
          .style('font-family', 'var(--font-body)')
          .style('font-weight', '600')
          .style('letter-spacing', '-0.01em')
          .attr('class', 'ring-label');

        textElement.append('textPath')
          .attr('href', `#${pathId}`)
          .attr('startOffset', '50%')
          .attr('text-anchor', 'middle')
          .style('pointer-events', 'none') // Also set on textPath
          .text(truncatedLabel);

        labelElements.push({ node: d, text: textElement.node()?.parentElement as any, pathId });
      }
    });

    // Add tooltips on hover
    node.append('title')
      .text(d => d.data.name);

  }, [ast]);

  // Reset zoom handler
  const handleResetZoom = () => {
    setFocusedNode(null);

    const svg = d3.select(svgRef.current);
    const g = svg.select('.zoom-group');

    // Animate back to original position
    g.transition()
      .duration(300)
      .ease(d3.easeCubicOut)
      .attr('transform', `translate(${50}, ${50})`)
      .on('end', () => {
        // Show all labels again
        g.selectAll('.ring-label').style('opacity', 1);
      });
  };

  return (
    <div className="tree-container" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Reset button when zoomed */}
      {focusedNode && (
        <div style={{
          position: 'absolute',
          top: 'var(--space-sm)',
          right: 'var(--space-sm)',
          zIndex: 10,
        }}>
          <button
            onClick={handleResetZoom}
            style={{
              all: 'unset',
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--ink-brown)',
              backgroundColor: 'var(--paper-weathered)',
              border: '1px solid var(--ink-light)',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all var(--duration-instant) var(--ease-natural)',
              boxShadow: '0 2px 4px var(--paper-shadow)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--paper-stained)';
              e.currentTarget.style.borderColor = 'var(--vermillion)';
              e.currentTarget.style.color = 'var(--vermillion)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--paper-weathered)';
              e.currentTarget.style.borderColor = 'var(--ink-light)';
              e.currentTarget.style.color = 'var(--ink-brown)';
            }}
          >
            ← Reset View
          </button>
        </div>
      )}

      {/* SVG Visualization */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
