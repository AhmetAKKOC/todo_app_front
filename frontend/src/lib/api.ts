export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const hasBody = options.body !== undefined;

  const headers: Record<string, string> = hasBody ? { 'Content-Type': 'application/json' } : {};

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? (hasBody ? 'POST' : 'GET'),
    headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
    ...options,

  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}
