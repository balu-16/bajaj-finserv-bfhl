const identity = require('../../config/identity');
const { buildGraph, compareLetters, discoverComponents, selectRoot } = require('./buildGraph');
const { buildTree } = require('./buildTree');
const { calculateDepth } = require('./calculateDepth');
const { detectCycles } = require('./detectCycles');
const { validateEdges } = require('./validateEdges');

function buildResponse(data) {
  const { invalidEntries, validEdges } = validateEdges(data);
  const { allNodes, childToParent, childrenMap, duplicateEdges, undirectedAdjacency } =
    buildGraph(validEdges);
  const components = discoverComponents(allNodes, undirectedAdjacency);
  const hierarchies = [];

  for (const componentNodes of components) {
    const root = selectRoot(componentNodes, childToParent);

    if (detectCycles(componentNodes, childrenMap)) {
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });
      continue;
    }

    hierarchies.push({
      root,
      tree: buildTree(root, childrenMap),
      depth: calculateDepth(root, childrenMap),
    });
  }

  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = '';
  let largestDepth = 0;

  for (const hierarchy of hierarchies) {
    if (hierarchy.has_cycle) {
      totalCycles += 1;
      continue;
    }

    totalTrees += 1;

    if (
      hierarchy.depth > largestDepth ||
      (hierarchy.depth === largestDepth && compareLetters(hierarchy.root, largestTreeRoot) < 0)
    ) {
      largestDepth = hierarchy.depth;
      largestTreeRoot = hierarchy.root;
    }
  }

  return {
    ...identity,
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot,
    },
  };
}

module.exports = {
  buildResponse,
};
