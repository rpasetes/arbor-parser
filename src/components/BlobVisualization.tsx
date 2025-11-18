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

    // Create pack layout
    const pack = d3.pack<HierarchyNode>()
      .size([width - margin * 2, height - margin * 2])
      .padding(3);

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

    // Add labels (only for nodes with enough space)
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .style('font-size', d => `${Math.min(d.r / 3, 14)}px`)
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .style('font-family', 'monospace')
      .style('font-weight', 'bold')
      .text(d => {
        // Only show label if circle is large enough
        const label = d.data.name;
        if (d.r > 20) {
          // Truncate long labels
          return label.length > 20 ? label.slice(0, 18) + '...' : label;
        }
        return '';
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
