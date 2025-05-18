#### kerbrute:
https://github.com/ropnop/kerbrute

Slow and noisy:

```bash
./kerbrute_linux_amd64 userenum --dc x.x.x.x -d domain.local /opt/kerberos_enum_userlists/A-Z.Surnames.txt
```

#### Ldapnomnom:
https://github.com/lkarlslund/ldapnomnom

Quick and quiet:

```bash
ldapnomnom -input users.txt -server x.x.x.x
```

#### Netexec: 
Find usernames with LDAP:

```bash
nxc ldap 10.10.125.112 -u "" -p "" --users
```

```bash
nxc ldap 10.10.79.155 -u "" -p "" --query "(sAMAccountName=*)" "" | grep userPrincipalName
```

