
```bash
Get-LapsADPassword -Identity <HOST-NAME> -AsPlainText
```

Example:

```bash
Get-LapsADPassword -Identity SRV -AsPlainText

ComputerName        : SRV
DistinguishedName   : CN=SRV,OU=Servers,DC=tea,DC=vl
Account             : Administrator
Password            : K@J11isF)CvoW9
PasswordUpdateTime  : 6/5/2025 2:58:29 AM
ExpirationTimestamp : 7/5/2025 2:58:29 AM
Source              : EncryptedPassword
DecryptionStatus    : Success
AuthorizedDecryptor : TEA\Server Administration
```

