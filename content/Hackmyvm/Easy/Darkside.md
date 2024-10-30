| Name     | Difficulty | OS    | Target IP     | Link                                                 |
| -------- | ---------- | ----- | ------------- | ---------------------------------------------------- |
| Darkside | Easy       | Linux | 192.168.0.202 | https://hackmyvm.eu/machines/machine.php?vm=Darkside |


### ARP Scan

```bash
gareth@gareth:~/hackmyvm/darkside$ sudo arp-scan -l | grep 8e           
192.168.0.181	08:00:27:8f:5b:8e	PCS Systemtechnik GmbH
```

### Nmap Scan Results

```bash
gareth@gareth:~/hackmyvm/darkside$ sudo nmap -p- -sV -sC 192.168.0.181 -oA nmap/darkside.tcp
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


![[Pasted image 20241030163545.png]]

Directory bruteforce, we see a file called `vote.txt`:

```bash
gareth@gareth:~/hackmyvm/darkside$ feroxbuster -u http://192.168.0.181 -w /opt/SecLists/Discovery/Web-Content/big.txt 

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
[####################] - 0s     20477/20477   6825667/s http://192.168.0.181/backup/ => Directory listing                                                                                                                                     gareth@gareth:~/hackmyvm/darkside$ curl http://192.168.0.181/backup/vote.txt
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


```bash

```

```bash

```

```bash

```

```bash

```

```bash

```

```bash

```

```bash

```

```bash

```

```bash

```



```bash

```

```bash

```

```bash

```
