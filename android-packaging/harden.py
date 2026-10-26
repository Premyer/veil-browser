"""Run after capacitor add android, passing packaging directory."""
from pathlib import Path
import sys
root=Path(sys.argv[1])
p=root/'android/app/src/main/AndroidManifest.xml';s=p.read_text()
s=s.replace('android:allowBackup="true"','android:allowBackup="false" android:fullBackupContent="false" android:dataExtractionRules="@xml/data_extraction_rules"');p.write_text(s)
(root/'android/app/src/main/res/xml/data_extraction_rules.xml').write_text('<data-extraction-rules><cloud-backup><exclude domain="root" path="."/><exclude domain="file" path="."/><exclude domain="database" path="."/><exclude domain="sharedpref" path="."/><exclude domain="external" path="."/></cloud-backup><device-transfer><exclude domain="root" path="."/><exclude domain="file" path="."/><exclude domain="database" path="."/><exclude domain="sharedpref" path="."/><exclude domain="external" path="."/></device-transfer></data-extraction-rules>')
