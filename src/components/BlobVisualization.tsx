import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as ts from 'typescript';
import { astRootToHierarchy, HierarchyNode } from '../utils/astToHierarchy';

interface BlobVisualizationProps {
  ast: ts.SourceFile;
}

export function BlobVisualization({ ast }: BlobVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Convert AST to hierarchy
    const hierarchyData = astRootToHierarchy(ast);

    // Set up dimensions
    const width = 800;
    const height = 600;
    const margin = 20;

    // Create D3 hierarchy
    const root = d3.hierarchy<HierarchyNode>(hierarchyData);

    // Sum values (required before pack)
    root.sum(d => d.value || 1);

    // Function to calculate font size for a node
    const getFontSize = (depth: number) => {
      const baseSize = 40 - (depth * 3); // 2x the original max (was 20)
      const minSize = 24; // 2x the original min (was 12)
      return Math.max(baseSize, minSize);
    };

    // Use font size as padding to visually tie labels to blobs
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

    // Get all nodes (descendants)
    const nodes = root.descendants();

    // Create color scale based on depth
    const colorScale = d3.scaleSequential()
      .domain([0, root.height])
      .interpolator(d3.interpolateViridis);

    // Create groups for each node
    const node = g.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Add circles
    node.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => colorScale(d.depth))
      .attr('fill-opacity', 0.6)
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseenter', function() {
        d3.select(this)
          .attr('fill-opacity', 0.9)
          .attr('stroke-width', 2.5);
      })
      .on('mouseleave', function(_, d) {
        d3.select(this)
          .attr('fill-opacity', 0.6)
          .attr('stroke-width', 1.5);
      });

    // Create defs for curved text paths
    const defs = svg.append('defs');

    // Add curved text labels along the top arc of each circle
    nodes.forEach((d, i) => {
      const label = d.data.name;
      const fontSize = getFontSize(d.depth);

      // Only show label if circle is large enough
      if (d.r > 30) {
        // Create a circular path for the text to follow
        const pathId = `circle-path-${i}`;

        // Create arc path along the top of the circle
        // Start at -90 degrees (top), arc radius slightly inside the circle
        const arcRadius = d.r - 5;

        defs.append('path')
          .attr('id', pathId)
          .attr('d', `
            M ${d.x - arcRadius}, ${d.y}
            A ${arcRadius}, ${arcRadius} 0 0 1 ${d.x + arcRadius}, ${d.y}
          `);

        // Truncate long labels based on circle circumference
        const maxChars = Math.floor((arcRadius * Math.PI) / (fontSize * 0.6));
        const truncatedLabel = label.length > maxChars ? label.slice(0, maxChars - 2) + '...' : label;

        // Add text element with textPath
        g.append('text')
          .style('font-size', `${fontSize}px`)
          .style('fill', '#fff')
          .style('pointer-events', 'none')
          .style('font-family', 'monospace')
          .style('font-weight', 'bold')
          .style('text-shadow', '0 0 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6)')
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
    <div style={{
      background: '#1a1a1a',
      padding: '20px',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}
