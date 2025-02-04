Does not support `ICMP`. Use `-sT` for nmap scans

Routes traffic down the ssh tunnel:

```bash
sudo sshuttle -r <user>@<ip> <target_subnet> -v
```

Verify with Nmap:

```bash
sudo nmap -v -sV -p 3389 <target_ip> -Pn
```

