export async function triggerRevalidate(tags: string[] | string): Promise<boolean> {
  const list = Array.isArray(tags) ? tags : [tags];
  try {
    const res = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags: list }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
