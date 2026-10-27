import { describe, expect, it } from 'vitest';
import { addVisit, exportData, initialData, newTab, parseImport, resolveAddress, safeUrl } from './browser-model';
describe('Browser privacy and data', () => {
  it('does not record private visits', () => { const history = [{ id: '1', title: 'Public', url: 'https://example.com/', time: 1 }]; expect(addVisit(history, { ...newTab(true), url: 'https://private.example/' })).toEqual(history); });
  it('does not export private tabs', () => { const data = initialData(); data.tabs.push({ ...newTab(true), url: 'https://secret.example/' }); expect(JSON.stringify(exportData(data))).not.toContain('secret.example'); expect(exportData(data).tabs).toHaveLength(1); });
  it('does not restore private tabs from imports', () => { const data = initialData(); data.tabs.push({ ...newTab(true), url: 'https://secret.example/' }); expect(parseImport(data).tabs).toHaveLength(1); expect(parseImport(data).tabs.every(t => !t.private)).toBe(true); });
  it('rejects script URLs', () => { const data = initialData(); const first = data.bookmarks[0]; if (!first) throw new Error('Missing seed'); first.url = 'javascript:alert(1)'; expect(() => parseImport(data)).toThrow(); expect(safeUrl('javascript:alert(1)')).toBeNull(); });
  it('preserves bookmark folders and notes on roundtrip', () => { const data = initialData(); data.notes.push({ id: 'n', title: 'Notiz', body: 'Text', updated: 42 }); const restored = parseImport(JSON.parse(JSON.stringify(exportData(data)))); expect(restored.folders).toEqual(['Favoriten', 'Arbeit', 'Inspiration']); expect(restored.notes[0]?.body).toBe('Text'); });
  it('uses selected search engine and allows HTTPS addresses', () => { expect(resolveAddress('rote Füchse', 'Ecosia')).toBe('https://www.ecosia.org/search?q=rote%20F%C3%BCchse'); expect(resolveAddress('example.com', 'Google')).toBe('https://example.com/'); });
  it('rejects malformed backup records with clear errors', () => {
    const data = initialData();
    expect(() => parseImport({ ...data, bookmarks: [null] })).toThrow('Ungültiges Lesezeichen in der Sicherung.');
    expect(() => parseImport({ ...data, history: [null] })).toThrow('Ungültiger Verlaufseintrag in der Sicherung.');
    expect(() => parseImport({ ...data, notes: [null] })).toThrow('Ungültiger Notiz in der Sicherung.');
    expect(() => parseImport({ ...data, tabs: [null] })).toThrow('Ungültiger Tab in der Sicherung.');
    expect(() => parseImport([])).toThrow('Ungültige Datendatei.');
  });
  it('rejects oversized backup collections before mapping them', () => {
    const data = initialData();
    const tooManyFolders = Array.from({ length: 501 }, (_, i) => 'Folder ' + i);
    const tooManyBookmarks = Array.from({ length: 5001 }, (_, i) => ({ title: 'Link ' + i, url: 'https://example.com/', folder: 'Favoriten' }));
    const tooManyNotes = Array.from({ length: 5001 }, (_, i) => ({ title: 'Note ' + i, body: '', updated: 0 }));
    const tooManyTabs = Array.from({ length: 101 }, () => newTab());
    expect(() => parseImport({ ...data, folders: tooManyFolders })).toThrow('Zu viele Ordner in der Sicherung');
    const unlistedFolders = Array.from({ length: 501 }, (_, i) => ({ title: 'Link ' + i, url: 'https://example.com/', folder: 'Imported ' + i }));
    expect(() => parseImport({ ...data, folders: [], bookmarks: unlistedFolders })).toThrow('Zu viele Ordner in der Sicherung');
    expect(() => parseImport({ ...data, bookmarks: tooManyBookmarks })).toThrow('Zu viele Lesezeichen in der Sicherung');
    expect(() => parseImport({ ...data, notes: tooManyNotes })).toThrow('Zu viele Notizen in der Sicherung');
    expect(() => parseImport({ ...data, tabs: tooManyTabs })).toThrow('Zu viele Tabs in der Sicherung');
  });
  it('continues to discard private tabs without validating their contents', () => {
    const data = initialData();
    const privateTab = { ...newTab(true), title: 'Private', url: 'javascript:alert(1)' };
    const restored = parseImport({ ...data, tabs: [privateTab] });
    expect(restored.tabs).toHaveLength(1);
    expect(restored.tabs[0]?.url).toBe('');
  });
});