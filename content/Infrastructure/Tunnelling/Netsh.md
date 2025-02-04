Use Windows to pivot to another machine:

```bash
netsh.exe interface portproxy add v4tov4 listenport=<windows_host_listen_port> listenaddress=<windows_host_ip> connectport=<target_port> connectaddress=<target_ip>
```

Example:

```bash
netsh.exe interface portproxy add v4tov4 listenport=8080 listenaddress=10.129.42.198 connectport=3389 connectaddress=172.16.5.25
```

Verify:

```bash
C:\Windows\system32>netsh.exe interface portproxy show v4tov4

Listen on ipv4:             Connect to ipv4:

Address         Port        Address         Port
--------------- ----------  --------------- ----------
10.129.42.198   8080        172.16.5.25     3389
```

Connect to target:

```bash
xfreerdp /v:<windows_host_ip>:<windows_host_listen_port> /u:<user> /p:<pass>
```



