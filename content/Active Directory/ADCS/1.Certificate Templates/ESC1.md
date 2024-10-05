it is possible to specify an alternate user in a certificate request. If a certificate template permits the inclusion of a `subjectAltName` (`SAN`) that differs from the user submitting the certificate signing request (CSR), this functionality can be exploited. Specifically, an attacker can request a certificate on behalf of any user in the domain by including their `subjectAltName` in the request.

The following prerequisites must apply:
- Enrollment Rights: `DOMAIN\Domain Users`.
- Requires Manager Approval: `False`.
- Authorized Signature Required: `0`.
- Client Authentication: `True` or Extended Key Usage `Client Authentication`.
- Enrollee Supplies Subject: `True`

![[Pasted image 20241005173153.png]]

```bash

```