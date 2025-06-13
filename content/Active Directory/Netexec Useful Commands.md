View user description via LDAP:

```bash
nxc ldap <hostname> -u "" -p "" -M get-desc-users
```

Find usernames with LDAP:

```bash
nxc ldap <hostname> -u "" -p "" --users
```

```bash
nxc ldap <hostname> -u "" -p "" --query "(sAMAccountName=*)" "" | grep userPrincipalName
```

Bloodhound:

```bash
nxc ldap 10.129.242.254 -u henry -p 'H3nry_987TGV!' -d tombwatcher.htb --dns-server 10.129.242.254 --bloodhound --collection All
```

