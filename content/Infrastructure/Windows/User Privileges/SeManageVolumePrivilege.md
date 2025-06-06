```bash
C:\> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                      State
============================= ================================ =======
SeMachineAccountPrivilege     Add workstations to domain       Enabled
SeChangeNotifyPrivilege       Bypass traverse checking         Enabled
SeManageVolumePrivilege       Perform volume maintenance tasks Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set   Enabled
```

https://github.com/CsEnox/SeManageVolumeExploit

This exploit grants full permission on C:\ drive for all users on the machine.

![[Pasted image 20250604041919.png]]

The `SeManageVolumeExploit` uses the `SeManageVolumePrivilege` to modify the security descriptor on the `C:\` drive, replacing the Administrators group with the Users group to grant all users full control over the volume root. This elevates access for non-privileged users to many areas under `C:\`, but it does not override or remove explicit NTFS permissions set on individual files or directories. As a result, files like `C:\Users\Administrator\Desktop\root.txt` may remain inaccessible if they have their own ACLs that deny access to the Users group or are inherited from protected parent folders.

![[Pasted image 20250604042147.png]]
