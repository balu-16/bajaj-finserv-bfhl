const { compareLetters } = require('./buildGraph');

function detectCycles(componentNodes, childrenMap) {
  const componentSet = new Set(componentNodes);
  const visitState = new Map();

  function visit(node) {
    const currentState = visitState.get(node);

    if (currentState === 1) {
      return true;
    }

    if (currentState === 2) {
      return false;
    }

    visitState.set(node, 1);

    const children = [...(childrenMap.get(node) ?? [])]
      .filter((child) => componentSet.has(child))
      .sort(compareLetters);

    for (const child of children) {
      if (visit(child)) {
        return true;
      }
    }

    visitState.set(node, 2);
    return false;
  }

  for (const node of [...componentNodes].sort(compareLetters)) {
    if (visit(node)) {
      return true;
    }
  }

  return false;
}

module.exports = {
  detectCycles,
};
