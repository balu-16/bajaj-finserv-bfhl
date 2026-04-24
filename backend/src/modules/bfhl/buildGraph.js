function compareLetters(left, right) {
  return left.localeCompare(right);
}

function ensureNode(map, node) {
  if (!map.has(node)) {
    map.set(node, new Set());
  }
}

function buildGraph(validEdges) {
  const seenEdges = new Set();
  const duplicateEdges = new Set();
  const childToParent = new Map();
  const childrenMap = new Map();
  const undirectedAdjacency = new Map();
  const allNodes = new Set();

  for (const { edge, parent, child } of validEdges) {
    if (seenEdges.has(edge)) {
      duplicateEdges.add(edge);
      continue;
    }

    seenEdges.add(edge);

    if (childToParent.has(child)) {
      continue;
    }

    childToParent.set(child, parent);
    allNodes.add(parent);
    allNodes.add(child);

    ensureNode(childrenMap, parent);
    ensureNode(childrenMap, child);
    ensureNode(undirectedAdjacency, parent);
    ensureNode(undirectedAdjacency, child);

    childrenMap.get(parent).add(child);
    undirectedAdjacency.get(parent).add(child);
    undirectedAdjacency.get(child).add(parent);
  }

  return {
    allNodes,
    childToParent,
    childrenMap,
    duplicateEdges: [...duplicateEdges].sort(compareLetters),
    undirectedAdjacency,
  };
}

function discoverComponents(allNodes, undirectedAdjacency) {
  const visited = new Set();
  const components = [];
  const orderedNodes = [...allNodes];

  for (const node of orderedNodes) {
    if (visited.has(node)) {
      continue;
    }

    const stack = [node];
    const component = [];
    visited.add(node);

    while (stack.length > 0) {
      const current = stack.pop();
      component.push(current);

      const neighbors = [...(undirectedAdjacency.get(current) ?? [])].sort(compareLetters);

      for (let index = neighbors.length - 1; index >= 0; index -= 1) {
        const neighbor = neighbors[index];

        if (visited.has(neighbor)) {
          continue;
        }

        visited.add(neighbor);
        stack.push(neighbor);
      }
    }

    components.push(component.sort(compareLetters));
  }

  return components;
}

function selectRoot(componentNodes, childToParent) {
  const rootCandidates = componentNodes
    .filter((node) => !childToParent.has(node))
    .sort(compareLetters);

  return rootCandidates[0] ?? [...componentNodes].sort(compareLetters)[0];
}

module.exports = {
  buildGraph,
  compareLetters,
  discoverComponents,
  selectRoot,
};
