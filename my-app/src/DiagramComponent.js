// src/DiagramComponent.js
import React, { useEffect, useRef } from 'react';
import * as go from 'gojs';

const DiagramComponent = ({ searchResult }) => {
  const diagramRef = useRef(null);
  const diagramInstance = useRef(null);

  useEffect(() => {
    if (!searchResult) return;

    const $ = go.GraphObject.make;

    // Limpiar el diagrama anterior si existe
    if (diagramInstance.current) {
      diagramInstance.current.div = null;
    }

    // Crear el nuevo diagrama con LayeredDigraphLayout para posiciones determinísticas
    const myDiagram = $(go.Diagram, diagramRef.current, {
      'layout': $(go.LayeredDigraphLayout, {
        direction: 90, // vertical layout
        layerSpacing: 50 // espacio entre niveles
      }),
      'undoManager.isEnabled': true
    });

    // Plantilla de nodos con imagen basada en el nombre del nodo
    myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      $(
        go.Shape,
        'RoundedRectangle',
        { strokeWidth: 0 },
        new go.Binding('fill', 'color')
      ),
      $(
        go.Picture,
        { margin: 8, width: 50, height: 50 },
        new go.Binding('source', 'key', (key) => `/images/${key}.png`) // Asumiendo que tienes imágenes como Alpha.png
      ),
      $(
        go.TextBlock,
        { margin: 8 },
        new go.Binding('text', 'key')
      )
    );

    // Plantilla de enlaces (sin flechas, líneas sólidas)
    myDiagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Orthogonal, corner: 10 },
      $(
        go.Shape,
        { strokeWidth: 2, stroke: '#333' }
      )
    );

    // Definir el modelo de datos usando el resultado de la búsqueda
    const nodes = [searchResult.node, ...searchResult.connectedNodes];
    myDiagram.model = new go.GraphLinksModel(nodes, searchResult.links);

    // Guardar la instancia del diagrama
    diagramInstance.current = myDiagram;

    // Limpiar el diagrama al desmontar el componente
    return () => {
      myDiagram.div = null;
    };
  }, [searchResult]);

  return <div ref={diagramRef} style={{ width: '100%', height: '350px', border: '1px solid black' }}></div>;
};

export default DiagramComponent;
