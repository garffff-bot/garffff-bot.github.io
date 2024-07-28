### kerbrute:
https://github.com/ropnop/kerbrute
Slow and noisy:

```bash
./kerbrute_linux_amd64 userenum --dc x.x.x.x -d domain.local /opt/kerberos_enum_userlists/A-Z.Surnames.txt
```

### Ldapnomnom:
https://github.com/lkarlslund/ldapnomnom

Quick and not noisy:

```bash
ldapnomnom -input users.txt -server x.x.x.x
```