const { compareLetters } = require('./buildGraph');

function calculateDepth(root, childrenMap) {
  const children = [...(childrenMap.get(root) ?? [])].sort(compareLetters);

  if (children.length === 0) {
    return 1;
  }

  let deepestChild = 0;

  for (const child of children) {
    deepestChild = Math.max(deepestChild, calculateDepth(child, childrenMap));
  }

  return deepestChild + 1;
}

module.exports = {
  calculateDepth,
};
