The ESC9 vulnerability in Active Directory Certificate Services (AD CS) occurs when the `msPKI-Enrollment-Flag` attribute in a certificate template includes the `CT_FLAG_NO_SECURITY_EXTENSION` flag, which prevents the `szOID_NTDS_CA_SECURITY_EXT` security extension from being embedded in certificates. 

This bypasses the `StrongCertificateBindingEnforcement` registry key, even if it is set to enforce strong mapping. Attackers with privileges to modify a user's User Principal Name (UPN) can exploit this by aligning the UPN with that of another account, requesting a certificate, and having it mapped to the target account. This allows unauthorised access and potential privilege escalation. 

To mitigate this, organisations should audit certificate templates, enforce strong certificate mapping, and monitor for suspicious activities related to UPN changes and certificate requests.

### Summary

```bash
certipy req -u <user>@<domain> -p '<password>' -ca <ca> -template <template> -upn <target_user> -dc-ip <adcs_ip>
certipy auth -pfx administrator.pfx -domain lab.local -dc-ip <dc_ip>
```

