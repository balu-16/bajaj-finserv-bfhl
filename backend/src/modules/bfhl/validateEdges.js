const EDGE_PATTERN = /^[A-Z]->[A-Z]$/;

function normalizeEntry(entry) {
  if (typeof entry === 'string') {
    return entry.trim();
  }

  if (entry === null || entry === undefined) {
    return '';
  }

  return String(entry).trim();
}

function validateEdges(data) {
  const invalidEntries = [];
  const validEdges = [];

  for (const entry of data) {
    const normalized = normalizeEntry(entry);

    if (!EDGE_PATTERN.test(normalized)) {
      invalidEntries.push(normalized);
      continue;
    }

    const [parent, child] = normalized.split('->');

    if (parent === child) {
      invalidEntries.push(normalized);
      continue;
    }

    validEdges.push({
      edge: normalized,
      parent,
      child,
    });
  }

  return {
    invalidEntries,
    validEdges,
  };
}

module.exports = {
  EDGE_PATTERN,
  normalizeEntry,
  validateEdges,
};
