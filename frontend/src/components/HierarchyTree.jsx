function TreeNode({ label, childrenTree }) {
  const entries = Object.entries(childrenTree);

  return (
    <li className="tree-node">
      <div className="tree-label">{label}</div>
      {entries.length > 0 ? (
        <ul className="tree-children">
          {entries.map(([childLabel, childTree]) => (
            <TreeNode key={childLabel} label={childLabel} childrenTree={childTree} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function HierarchyTree({ tree }) {
  const entries = Object.entries(tree);

  if (entries.length === 0) {
    return <p className="cycle-copy">This component contains a cycle, so the tree is empty.</p>;
  }

  return (
    <ul className="tree-root">
      {entries.map(([label, childrenTree]) => (
        <TreeNode key={label} label={label} childrenTree={childrenTree} />
      ))}
    </ul>
  );
}
