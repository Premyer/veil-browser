import tempfile,subprocess,unittest
from pathlib import Path
class PackagingPrivacy(unittest.TestCase):
 def test_cloud_backup_disabled(self):
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp); manifest=root/'android/app/src/main/AndroidManifest.xml';manifest.parent.mkdir(parents=True);(manifest.parent/'res/xml').mkdir(parents=True)
   manifest.write_text('<manifest><application android:allowBackup="true"/></manifest>')
   subprocess.run(['python3',str(Path(__file__).parent/'harden.py'),tmp],check=True)
   self.assertIn('android:allowBackup="false"',manifest.read_text())
   self.assertIn('android:fullBackupContent="false"',manifest.read_text())
 def test_transfer_storage_excluded(self):
  import xml.etree.ElementTree as ET
  with tempfile.TemporaryDirectory() as tmp:
   root=Path(tmp);manifest=root/'android/app/src/main/AndroidManifest.xml';manifest.parent.mkdir(parents=True);(manifest.parent/'res/xml').mkdir(parents=True);manifest.write_text('android:allowBackup="true"')
   subprocess.run(['python3',str(Path(__file__).parent/'harden.py'),tmp],check=True)
   rules=ET.parse(manifest.parent/'res/xml/data_extraction_rules.xml').getroot()
   for section in ['cloud-backup','device-transfer']:
    block=rules.find(section);self.assertIsNotNone(block)
    self.assertEqual({x.attrib['domain'] for x in block}, {'root','file','database','sharedpref','external'})
if __name__=='__main__': unittest.main()
