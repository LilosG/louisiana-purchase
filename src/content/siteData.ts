import { getCollection } from 'astro:content';

export async function getSingleton(collection: any, id: string): Promise<any> {
  const entries: any[] = await getCollection(collection as any) as any[];
  const entry: any = entries.find((item: any) => item.id === id) ?? entries[0];
  if (!entry) throw new Error(`Missing content singleton: ${collection}/${id}`);
  return entry.data;
}

export async function getOrderedCollection(collection: any): Promise<any[]> {
  const entries = await getCollection(collection);
  return entries
    .map((entry: any) => ({ id: entry.data.id ?? entry.id, ...entry.data }))
    .sort((a: any, b: any) => a.order - b.order);
}

export function resolveContent(value: any, images: Record<string, any>, env: Record<string, any>): any {
  if (typeof value === 'string') {
    if (value.startsWith('__IMAGE__')) return images[value.slice(9)];
    if (value.startsWith('__ENV__')) return env[value.slice(7)];
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => resolveContent(item, images, env));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveContent(item, images, env)]));
  return value;
}
