"""Run from project root; prepares independent packaging in /tmp/veil-web-android."""
from pathlib import Path
import shutil
root=Path(__file__).resolve().parent.parent
out=Path('/tmp/veil-web-android')
if out.exists(): raise SystemExit('Remove or rename /tmp/veil-web-android before preparing again.')
(out/'web/src').mkdir(parents=True)
for name in ['components','lib','assets']: shutil.copytree(root/'src'/name,out/'web/src'/name)
shutil.copy(root/'src/styles.css',out/'web/src/styles.css')
shutil.copy(root/'public/favicon.ico',out/'web/favicon.ico')
for name in ['package.json','bun.lock','vite.config.ts','capacitor.config.json']: shutil.copy(root/'android-packaging'/name,out/name)
shutil.copy(root/'android-packaging/entry.tsx',out/'web/entry.tsx')
shutil.copy(root/'android-packaging/shell.html',out/'web/index.html')
p=out/'web/src/components/browser-workspace.tsx';s=p.read_text()
s="import { Capacitor } from '@capacitor/core';\nimport { Filesystem, Directory, Encoding } from '@capacitor/filesystem';\nimport { Share } from '@capacitor/share';\n"+s
old="function download(content: string, filename: string, type = 'application/json') { const url"
new="function download(content: string, filename: string, type = 'application/json') { if (Capacitor.isNativePlatform()) { void (async () => { try { const written = await Filesystem.writeFile({ path: filename, data: content, directory: Directory.Cache, encoding: Encoding.UTF8 }); await Share.share({ title: filename, files: [written.uri] }); } catch { setMessage('Export abgebrochen oder fehlgeschlagen.'); } })(); return; } const url"
if old not in s: raise SystemExit('Workspace export changed; review native export adapter.')
p.write_text(s.replace(old,new))
print(out)
