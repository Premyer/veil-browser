export type Tab = { id: string; title: string; url: string; private: boolean; trail: string[]; position: number };
export type Bookmark = { id: string; title: string; url: string; folder: string };
export type Visit = { id: string; title: string; url: string; time: number };
export type Note = { id: string; title: string; body: string; updated: number };
export type BrowserData = { version: 1; bookmarks: Bookmark[]; folders: string[]; history: Visit[]; notes: Note[]; engine: string; theme: 'light' | 'dark'; tabs: Tab[] };
export const engines: Record<string, string> = { DuckDuckGo: 'https://duckduckgo.com/?q=', Google: 'https://www.google.com/search?q=', Bing: 'https://www.bing.com/search?q=', Ecosia: 'https://www.ecosia.org/search?q=' };
export function newTab(isPrivate = false): Tab { return { id: crypto.randomUUID(), title: 'Neuer Tab', url: '', private: isPrivate, trail: [''], position: 0 }; }
export function safeUrl(value: string): string | null { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; } }
export function resolveAddress(value: string, engine: string) { const text = value.trim(); if (!text) return ''; const direct = safeUrl(text) || (/^[\w.-]+\.[a-z]{2,}([/:?#]|$)/i.test(text) ? safeUrl(`https://${text}`) : null); return direct || `${engines[engine] || engines['DuckDuckGo']}${encodeURIComponent(text)}`; }
export function exportData(data: BrowserData): BrowserData { return { ...data, tabs: data.tabs.filter(tab => !tab.private) }; }
export function addVisit(history: Visit[], tab: Tab): Visit[] { if (tab.private || !tab.url) return history; return [{ id: crypto.randomUUID(), title: tab.title, url: tab.url, time: Date.now() }, ...history].slice(0, 1000); }
export function initialData(): BrowserData { return { version: 1, folders: ['Favoriten', 'Arbeit', 'Inspiration'], bookmarks: [ { id: 'mozilla', title: 'Mozilla', url: 'https://www.mozilla.org/', folder: 'Favoriten' }, { id: 'wiki', title: 'Wikipedia', url: 'https://de.wikipedia.org/', folder: 'Favoriten' }, { id: 'github', title: 'GitHub', url: 'https://github.com/', folder: 'Arbeit' }, { id: 'mdn', title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', folder: 'Arbeit' } ], history: [], notes: [], engine: 'DuckDuckGo', theme: 'light', tabs: [newTab()] }; }
export function parseImport(input: unknown): BrowserData {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Ungültige Datendatei.');
  const raw = input as Record<string, unknown>;
  const rawFolders = raw['folders'];
  const rawBookmarks = raw['bookmarks'];
  const rawHistory = raw['history'];
  const rawNotes = raw['notes'];
  const rawTabs = raw['tabs'];
  if (raw['version'] !== 1 || !Array.isArray(rawFolders) || !Array.isArray(rawBookmarks) || !Array.isArray(rawHistory) || !Array.isArray(rawNotes) || !Array.isArray(rawTabs)) throw new Error('Keine gültige Veil-Sicherung.');
  const limits = { folders: 500, bookmarks: 5000, notes: 5000, tabs: 100 } as const;
  const checkLimit = (items: unknown[], label: string, limit: number) => { if (items.length > limit) throw new Error('Zu viele ' + label + ' in der Sicherung (maximal ' + limit + ').'); };
  checkLimit(rawFolders, 'Ordner', limits.folders);
  checkLimit(rawBookmarks, 'Lesezeichen', limits.bookmarks);
  checkLimit(rawNotes, 'Notizen', limits.notes);
  checkLimit(rawTabs, 'Tabs', limits.tabs);
  const record = (value: unknown, label: string): Record<string, unknown> => { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Ungültiger ' + label + ' in der Sicherung.'); return value as Record<string, unknown>; };
  const text = (v: unknown): string => { if (typeof v !== 'string' || v.length > 200000) throw new Error('Ungültiger Text.'); return v; };
  const url = (v: unknown) => { const result = safeUrl(text(v)); if (!result) throw new Error('Unsichere Adresse in der Sicherung.'); return result; };
  const folders = [...new Set(rawFolders.map(v => text(v)))];
  const bookmarks = rawBookmarks.map((value) => { const b = record(value, 'Lesezeichen'); return { id: crypto.randomUUID(), title: text(b['title']), url: url(b['url']), folder: text(b['folder']) }; });
  bookmarks.forEach(b => { if (!folders.includes(b.folder)) folders.push(b.folder); });
  checkLimit(folders, 'Ordner', limits.folders);
  const history = rawHistory.slice(0, 1000).map((value) => { const h = record(value, 'Verlaufseintrag'); return { id: crypto.randomUUID(), title: text(h['title']), url: url(h['url']), time: Number.isFinite(h['time']) ? h['time'] as number : 0 }; });
  const notes = rawNotes.map((value) => { const n = record(value, 'Notiz'); return { id: crypto.randomUUID(), title: text(n['title']), body: text(n['body']), updated: Number.isFinite(n['updated']) ? n['updated'] as number : 0 }; });
  const tabs = rawTabs.flatMap((value) => { const t = record(value, 'Tab'); if (typeof t['private'] !== 'boolean') throw new Error('Ungültiger Tab in der Sicherung.'); if (t['private']) return []; const address = t['url'] === '' ? '' : url(t['url']); return [{ ...newTab(), title: text(t['title']), url: address, trail: [address] }]; });
  return { version: 1, folders, bookmarks, history, notes, tabs: tabs.length ? tabs : [newTab()], engine: typeof raw['engine'] === 'string' && raw['engine'] in engines ? raw['engine'] : 'DuckDuckGo', theme: raw['theme'] === 'dark' ? 'dark' : 'light' };
}
