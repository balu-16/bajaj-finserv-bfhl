const { compareLetters } = require('./buildGraph');

function buildBranch(node, childrenMap) {
  const branch = {};
  const children = [...(childrenMap.get(node) ?? [])].sort(compareLetters);

  for (const child of children) {
    branch[child] = buildBranch(child, childrenMap);
  }

  return branch;
}

function buildTree(root, childrenMap) {
  return {
    [root]: buildBranch(root, childrenMap),
  };
}

module.exports = {
  buildTree,
};
