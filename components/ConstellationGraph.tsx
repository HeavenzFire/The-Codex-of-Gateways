import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Artifact, Node, Link } from '../types';

interface ConstellationGraphProps {
  artifacts: Artifact[];
  onNodeSelect: (artifact: Artifact) => void;
  selectedId: string | null;
}

const ConstellationGraph: React.FC<ConstellationGraphProps> = ({ artifacts, onNodeSelect, selectedId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || artifacts.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = dimensions.width;
    const height = dimensions.height;

    // Prepare Graph Data
    const nodes: Node[] = artifacts.map(a => ({
      id: a.id,
      group: 1,
      radius: a.id === selectedId ? 30 : 20, // Highlight selected size
      color: a.color,
      data: a,
      // Initial positions centered
      x: width / 2 + (Math.random() - 0.5) * 50,
      y: height / 2 + (Math.random() - 0.5) * 50
    }));

    const links: Link[] = [];
    artifacts.forEach(source => {
      source.connections.forEach(targetId => {
        // Only add link if target exists in our subset
        if (artifacts.find(a => a.id === targetId)) {
          links.push({
            source: source.id, // D3 will map this to the object
            target: targetId,
            value: 1
          } as any);
        }
      });
    });

    // Simulation Setup
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    // Render Links
    const link = svg.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    // Render Nodes Groups (Circle + Label)
    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
      )
      .on("click", (event, d) => {
        onNodeSelect(d.data);
      });

    // Glow Filter Definition
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Node Circles
    nodeGroup.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", "#030712") 
      .attr("stroke", d => d.color)
      .attr("stroke-width", d => d.id === selectedId ? 4 : 2)
      .style("filter", "url(#glow)")
      .style("cursor", "pointer")
      .attr("class", "transition-all duration-300");
    
    // Inner pulse for selected
    nodeGroup.filter(d => d.id === selectedId)
      .append("circle")
      .attr("r", d => d.radius + 10)
      .attr("fill", "none")
      .attr("stroke", d => d.color)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1);


    // Node Labels
    nodeGroup.append("text")
      .text(d => d.data.name)
      .attr("x", 0)
      .attr("y", d => d.radius + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .style("pointer-events", "none");

    // Icons (Lucide simplified representation - purely illustrative letters for now)
    nodeGroup.append("text")
      .text(d => d.data.name.charAt(0))
      .attr("dy", "0.3em")
      .attr("text-anchor", "middle")
      .attr("fill", d => d.color)
      .attr("font-weight", "bold")
      .style("pointer-events", "none");

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag Functions
    function dragstarted(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [artifacts, dimensions, selectedId, onNodeSelect]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-void">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default ConstellationGraph;