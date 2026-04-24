const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function submitHierarchyData(inputText) {
  const response = await fetch(`${API_BASE_URL}/bfhl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: inputText.replace(/\r/g, '').split('\n'),
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || 'The API request failed.');
  }

  return payload;
}
