// DiagramComponent.js
import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';

const DiagramComponent = ({ searchResult }) => {
  const diagramRef = useRef(null);

  useEffect(() => {
    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, diagramRef.current, {
      'undoManager.isEnabled': true
    });

    myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 }, new go.Binding('fill', 'color')),
      $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
    );

    myDiagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Normal, corner: 10 },
      $(go.Shape, { strokeWidth: 2, stroke: '#333' })
    );

    if (searchResult) {
      const nodes = [searchResult.node, ...searchResult.connectedNodes];
      const links = searchResult.connections.map(conn => ({
        from: conn.from,
        to: conn.to
      }));

      myDiagram.model = new go.GraphLinksModel(nodes, links);
    } else {
      myDiagram.model = new go.GraphLinksModel();
    }

    // Limpiar el diagrama al desmontar el componente
    return () => {
      myDiagram.div = null;
    };
  }, [searchResult]);

  return <div ref={diagramRef} style={{ width: '100%', height: '600px', border: '1px solid black' }}></div>;
};

export default DiagramComponent;
